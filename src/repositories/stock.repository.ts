// ============================================================
// FICHIER : src/repositories/stock.repository.ts
// Rôle : Accès BD pour tout ce qui concerne le stock.
// ============================================================

import { Origine, CategorieStock } from '@prisma/client'
import prisma from '../lib/prisma'


// ── Lister les stocks avec filtres
export async function listerStocks(params: {
  agenceId?: number
  fruitId?: number
  calibreId?: number
  categorie?: CategorieStock
  skip: number
  limit: number
}) {
  const where: any = {}
  if (params.agenceId) where.agenceId = params.agenceId
  if (params.fruitId) where.fruitId = params.fruitId
  if (params.calibreId) where.calibreId = params.calibreId
  if (params.categorie) where.categorie = params.categorie

  const [stocks, total] = await Promise.all([
    prisma.stock.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      include: {
        agence: { select: { id: true, nom: true } },
        fruit: { select: { id: true, nom: true, uniteMesure: true, imageUrl: true } },
        calibre: { select: { id: true, valeur: true } },
      },
      orderBy: [{ fruit: { nom: 'asc' } }, { calibre: { ordreAffichage: 'asc' } }],
    }),
    prisma.stock.count({ where }),
  ])

  return { stocks, total }
}

// ── Alertes stock bas (moins de 5 cartons)
export async function obtenirAlertesStock(agenceId?: number) {
  const where: any = { quantiteCartons: { lte: 5 } }
  if (agenceId) where.agenceId = agenceId

  return prisma.stock.findMany({
    where,
    include: {
      agence: { select: { id: true, nom: true } },
      fruit: { select: { id: true, nom: true, imageUrl: true } },
      calibre: { select: { id: true, valeur: true } },
    },
    orderBy: { quantiteCartons: 'asc' },
  })
}

// ── Réceptionner de la marchandise (transaction atomique)
// Une transaction atomique = tout réussit ou tout échoue
// Pas de risque d'avoir le stock mis à jour sans la réception enregistrée
export async function receptionnerMarchandise(data: {
  agenceId: number
  fruitId: number
  calibreId: number
  origine: Origine
  cartonsNormal: number
  cartonsSolde: number
  prixNormal: number
  prixSolde?: number
  recuParId: number
}) {
  return prisma.$transaction(async (tx) => {
    // 1. Enregistrer la réception
    const reception = await tx.receptionMarchandise.create({
      data: {
        agenceId: data.agenceId,
        fruitId: data.fruitId,
        calibreId: data.calibreId,
        origine: data.origine,
        cartonsNormal: data.cartonsNormal,
        cartonsSolde: data.cartonsSolde,
        prixNormal: data.prixNormal,
        prixSolde: data.prixSolde,
        recuParId: data.recuParId,
      },
    })

    // 2. Mettre à jour ou créer le stock NORMAL
    if (data.cartonsNormal > 0) {
      await tx.stock.upsert({
        where: {
          agenceId_fruitId_calibreId_origine_categorie: {
            agenceId: data.agenceId,
            fruitId: data.fruitId,
            calibreId: data.calibreId,
            origine: data.origine,
            categorie: 'NORMAL',
          },
        },
        update: {
          quantiteCartons: { increment: data.cartonsNormal },
          prixUnitaire: data.prixNormal,
          dateDerniereMaj: new Date(),
        },
        create: {
          agenceId: data.agenceId,
          fruitId: data.fruitId,
          calibreId: data.calibreId,
          origine: data.origine,
          categorie: 'NORMAL',
          quantiteCartons: data.cartonsNormal,
          prixUnitaire: data.prixNormal,
        },
      })
    }

    // 3. Mettre à jour ou créer le stock SOLDE
    if (data.cartonsSolde > 0 && data.prixSolde) {
      await tx.stock.upsert({
        where: {
          agenceId_fruitId_calibreId_origine_categorie: {
            agenceId: data.agenceId,
            fruitId: data.fruitId,
            calibreId: data.calibreId,
            origine: data.origine,
            categorie: 'SOLDE',
          },
        },
        update: {
          quantiteCartons: { increment: data.cartonsSolde },
          prixUnitaire: data.prixSolde,
          dateDerniereMaj: new Date(),
        },
        create: {
          agenceId: data.agenceId,
          fruitId: data.fruitId,
          calibreId: data.calibreId,
          origine: data.origine,
          categorie: 'SOLDE',
          quantiteCartons: data.cartonsSolde,
          prixUnitaire: data.prixSolde,
        },
      })
    }

    return reception
  })
}

// ── Déclarer une perte (transaction atomique)
export async function declarerPerte(data: {
  agenceId: number
  fruitId: number
  calibreId: number
  origine: Origine
  categorie: CategorieStock
  quantite: number
  raison: any
  declarePar: number
}) {
  return prisma.$transaction(async (tx) => {
    // 1. Vérifier le stock disponible
    const stock = await tx.stock.findUnique({
      where: {
        agenceId_fruitId_calibreId_origine_categorie: {
          agenceId: data.agenceId,
          fruitId: data.fruitId,
          calibreId: data.calibreId,
          origine: data.origine,
          categorie: data.categorie,
        },
      },
    })

    if (!stock || stock.quantiteCartons < data.quantite) {
      throw new Error('Stock insuffisant pour déclarer cette perte.')
    }

    const valeurPerdue = Number(stock.prixUnitaire) * data.quantite

    // 2. Enregistrer la perte
    const perte = await tx.perte.create({
      data: {
        agenceId: data.agenceId,
        fruitId: data.fruitId,
        calibreId: data.calibreId,
        quantite: data.quantite,
        raison: data.raison,
        valeurPerdue,
        declarePar: data.declarePar,
      },
    })

    // 3. Déduire du stock
    await tx.stock.update({
      where: {
        agenceId_fruitId_calibreId_origine_categorie: {
          agenceId: data.agenceId,
          fruitId: data.fruitId,
          calibreId: data.calibreId,
          origine: data.origine,
          categorie: data.categorie,
        },
      },
      data: {
        quantiteCartons: { decrement: data.quantite },
        dateDerniereMaj: new Date(),
      },
    })

    return { ...perte, valeurPerdue }
  })
}

// ── Catalogue public (pour les clients)
export async function obtenirCatalogue(agenceId: number) {
  return prisma.stock.findMany({
    where: {
      agenceId,
      quantiteCartons: { gt: 0 },
    },
    include: {
      fruit: { select: { id: true, nom: true, uniteMesure: true, imageUrl: true } },
      calibre: { select: { id: true, valeur: true, ordreAffichage: true } },
    },
    orderBy: [{ fruit: { nom: 'asc' } }, { calibre: { ordreAffichage: 'asc' } }],
  })
}

// ── Déduire du stock lors d'une commande
export async function deduireStock(
  tx: any,
  agenceId: number,
  fruitId: number,
  calibreId: number,
  categorie: CategorieStock,
  quantite: number
) {
  // Trouver le stock (peu importe l'origine)
  const stock = await tx.stock.findFirst({
    where: { agenceId, fruitId, calibreId, categorie, quantiteCartons: { gte: quantite } },
  })

  if (!stock) {
    throw new Error(`Stock insuffisant pour le fruit ID ${fruitId}, calibre ID ${calibreId}.`)
  }

  await tx.stock.update({
    where: { id: stock.id },
    data: { quantiteCartons: { decrement: quantite }, dateDerniereMaj: new Date() },
  })

  return stock
}
