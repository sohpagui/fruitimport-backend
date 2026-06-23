import { StatutCommande } from '@prisma/client'
import { creerCommande, listerCommandes, trouverCommandeParId, changerStatutCommande } from '../repositories/commande.repository'
import { PaginationParams } from '../types'

export async function passerCommande(data: any) {
  return creerCommande(data)
}
export async function obtenirCommandes(params: PaginationParams & { agenceId?: number; clientId?: number; statut?: StatutCommande }) {
  return listerCommandes(params)
}
export async function obtenirCommande(id: number) {
  const commande = await trouverCommandeParId(id)
  if (!commande) throw new Error('Commande introuvable.')
  return commande
}
export async function mettreAJourStatutCommande(id: number, statut: StatutCommande) {
  const commande = await trouverCommandeParId(id)
  if (!commande) throw new Error('Commande introuvable.')
  const transitionsValides: Record<string, string[]> = {
    EN_ATTENTE: ['CONFIRMEE', 'ANNULEE'],
    CONFIRMEE: ['PREPAREE', 'ANNULEE'],
    PREPAREE: ['EN_LIVRAISON', 'ANNULEE'],
    EN_LIVRAISON: ['LIVREE'],
    LIVREE: [],
    ANNULEE: [],
  }
  if (!transitionsValides[commande.statut]?.includes(statut)) {
    throw new Error(`Transition invalide : ${commande.statut} -> ${statut}.`)
  }
  return changerStatutCommande(id, statut)
}
