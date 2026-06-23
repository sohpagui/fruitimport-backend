import { StatutLivraison } from '@prisma/client'
import { creerLivraison, listerLivraisons, mettreAJourStatutLivraison } from '../repositories/livraison.repository'
import { PaginationParams } from '../types'

export async function assignerLivraison(data: { commandeId: number; livreurId: number }) {
  return creerLivraison(data)
}
export async function obtenirLivraisons(params: PaginationParams & { livreurId?: number; statut?: StatutLivraison; agenceId?: number }) {
  return listerLivraisons(params)
}
export async function mettreAJourLivraison(id: number, statut: StatutLivraison, noteProbleme?: string) {
  return mettreAJourStatutLivraison(id, statut, noteProbleme)
}
