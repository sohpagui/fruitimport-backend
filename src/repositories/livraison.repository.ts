// ============================================================
// FICHIER : src/repositories/livraison.repository.ts
// Rôle : Accès BD pour les livraisons.
// ============================================================

import { StatutLivraison } from '@prisma/client'
import prisma from '../lib/prisma'


// ── Créer une livraison
export async function creerLivraison(data: {
  commandeId: number
  livreurId: number
}) {
  // Vérifier que la commande est dans l'état PREPAREE
  const commande = await prisma.commande.findUnique({
    where: { id: data.commandeId },
  })

  if (!commande) throw new Error('Commande introuvable.')
  if (commande.statut !== 'PREPAREE') {
    throw new Error('La commande doit être dans l\'état PREPAREE pour être livrée.')
  }

  return prisma.$transaction(async (tx) => {
    const livraison = await tx.livraison.create({
      data: {
        commandeId: data.commandeId,
        livreurId: data.livreurId,
        statut: 'PREPARE',
      },
      include: {
        commande: { include: { client: true } },
        livreur: { select: { id: true, nom: true, telephone: true } },
      },
    })

    // Mettre à jour le statut de la commande
    await tx.commande.update({
      where: { id: data.commandeId },
      data: { statut: 'EN_LIVRAISON' },
    })

    return livraison
  })
}

// ── Lister les livraisons
export async function listerLivraisons(params: {
  livreurId?: number
  statut?: StatutLivraison
  agenceId?: number
  skip: number
  limit: number
}) {
  const where: any = {}
  if (params.livreurId) where.livreurId = params.livreurId
  if (params.statut) where.statut = params.statut
  if (params.agenceId) where.commande = { agenceId: params.agenceId }

  const [livraisons, total] = await Promise.all([
    prisma.livraison.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      include: {
        commande: {
          include: {
            client: { select: { id: true, nom: true, telephone: true } },
            agence: { select: { id: true, nom: true } },
          },
        },
        livreur: { select: { id: true, nom: true, telephone: true } },
      },
      orderBy: { dateAssignation: 'desc' },
    }),
    prisma.livraison.count({ where }),
  ])

  return { livraisons, total }
}

// ── Mettre à jour le statut d'une livraison
export async function mettreAJourStatutLivraison(
  id: number,
  statut: StatutLivraison,
  noteProbleme?: string
) {
  return prisma.$transaction(async (tx) => {
    const livraison = await tx.livraison.update({
      where: { id },
      data: {
        statut,
        noteProbleme: noteProbleme || null,
        dateLivraison: statut === 'LIVRE' ? new Date() : undefined,
      },
    })

    // Si livré, mettre à jour la commande aussi
    if (statut === 'LIVRE') {
      await tx.commande.update({
        where: { id: livraison.commandeId },
        data: { statut: 'LIVREE' },
      })
    }

    return livraison
  })
}
