// ============================================================
// FICHIER : src/repositories/commande.repository.ts
// Rôle : Accès BD pour les commandes.
// ============================================================

import { StatutCommande, ModePaiement } from '@prisma/client'
import prisma from '../lib/prisma'
import { deduireStock } from './stock.repository'


// Génère un numéro de commande unique : BC-2026-000001
async function genererNumeroCommande(): Promise<string> {
  const annee = new Date().getFullYear()
  const count = await prisma.commande.count()
  const numero = String(count + 1).padStart(6, '0')
  return `BC-${annee}-${numero}`
}

// ── Créer une commande (transaction atomique)
export async function creerCommande(data: {
  agenceId: number
  clientId: number
  creeParId?: number
  modePaiement: ModePaiement
  adresseLivraison?: string
  note?: string
  lignes: Array<{
    fruitId: number
    calibreId: number
    categorie: 'NORMAL' | 'SOLDE'
    quantite: number
    prixUnitaire: number
  }>
}) {
  return prisma.$transaction(async (tx) => {
    // 1. Calculer le montant total
    let montantTotal = 0
    for (const ligne of data.lignes) {
      montantTotal += ligne.quantite * ligne.prixUnitaire
    }

    // 2. Vérifier la limite de crédit si paiement par crédit
    if (data.modePaiement === 'CREDIT') {
      const client = await tx.client.findUnique({ where: { id: data.clientId } })
      if (!client) throw new Error('Client introuvable.')

      const creditDisponible = Number(client.limiteCredit) - Number(client.creditUtilise)
      if (montantTotal > creditDisponible) {
        throw new Error(
          `Limite de crédit insuffisante. Disponible : ${creditDisponible} FCFA, Commande : ${montantTotal} FCFA.`
        )
      }
    }

    // 3. Générer le numéro de commande
    const numero = await genererNumeroCommande()

    // 4. Créer la commande
    const commande = await tx.commande.create({
      data: {
        numero,
        agenceId: data.agenceId,
        clientId: data.clientId,
        creeParId: data.creeParId,
        modePaiement: data.modePaiement,
        montantTotal,
        adresseLivraison: data.adresseLivraison,
        note: data.note,
        statut: 'EN_ATTENTE',
        lignes: {
          create: data.lignes.map((l) => ({
            fruitId: l.fruitId,
            calibreId: l.calibreId,
            categorie: l.categorie,
            quantite: l.quantite,
            prixUnitaire: l.prixUnitaire,
            sousTotal: l.quantite * l.prixUnitaire,
          })),
        },
      },
      include: {
        lignes: {
          include: {
            fruit: { select: { id: true, nom: true } },
            calibre: { select: { id: true, valeur: true } },
          },
        },
        client: { select: { id: true, nom: true, telephone: true } },
      },
    })

    // 5. Déduire du stock pour chaque ligne
    for (const ligne of data.lignes) {
      await deduireStock(tx, data.agenceId, ligne.fruitId, ligne.calibreId, ligne.categorie as any, ligne.quantite)
    }

    // 6. Mettre à jour le crédit utilisé si paiement par crédit
    if (data.modePaiement === 'CREDIT') {
      await tx.client.update({
        where: { id: data.clientId },
        data: { creditUtilise: { increment: montantTotal } },
      })
    }

    return commande
  })
}

// ── Lister les commandes avec filtres
export async function listerCommandes(params: {
  agenceId?: number
  clientId?: number
  statut?: StatutCommande
  skip: number
  limit: number
}) {
  const where: any = {}
  if (params.agenceId) where.agenceId = params.agenceId
  if (params.clientId) where.clientId = params.clientId
  if (params.statut) where.statut = params.statut

  const [commandes, total] = await Promise.all([
    prisma.commande.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      include: {
        client: { select: { id: true, nom: true, telephone: true, type: true } },
        agence: { select: { id: true, nom: true } },
        creePar: { select: { id: true, nom: true, role: true } },
        lignes: {
          include: {
            fruit: { select: { id: true, nom: true } },
            calibre: { select: { id: true, valeur: true } },
          },
        },
        livraison: true,
      },
      orderBy: { date: 'desc' },
    }),
    prisma.commande.count({ where }),
  ])

  return { commandes, total }
}

// ── Trouver une commande par ID
export async function trouverCommandeParId(id: number) {
  return prisma.commande.findUnique({
    where: { id },
    include: {
      client: true,
      agence: { select: { id: true, nom: true } },
      creePar: { select: { id: true, nom: true, role: true } },
      lignes: {
        include: {
          fruit: { select: { id: true, nom: true, uniteMesure: true } },
          calibre: { select: { id: true, valeur: true } },
        },
      },
      livraison: {
        include: { livreur: { select: { id: true, nom: true, telephone: true } } },
      },
    },
  })
}

// ── Changer le statut d'une commande
export async function changerStatutCommande(id: number, statut: StatutCommande) {
  return prisma.commande.update({
    where: { id },
    data: { statut },
  })
}
