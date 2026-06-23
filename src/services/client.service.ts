import { StatutCredit } from '@prisma/client'
import { listerClients, trouverClientParId, modifierLimiteCredit, enregistrerPaiementCredit } from '../repositories/client.repository'
import { PaginationParams } from '../types'

export async function obtenirClients(params: PaginationParams & { agenceId?: number; statutCredit?: StatutCredit }) {
  return listerClients(params)
}
export async function obtenirClient(id: number) {
  const client = await trouverClientParId(id)
  if (!client) throw new Error('Client introuvable.')
  return client
}
export async function mettreAJourLimiteCredit(clientId: number, limiteCredit: number, modifiePar: number) {
  if (limiteCredit < 0) throw new Error('La limite de credit ne peut pas etre negative.')
  return modifierLimiteCredit(clientId, limiteCredit, modifiePar)
}
export async function enregistrerPaiement(data: { clientId: number; commandeId?: number; montant: number; enregistrePar: number }) {
  if (data.montant <= 0) throw new Error('Le montant doit etre positif.')
  return enregistrerPaiementCredit(data)
}
