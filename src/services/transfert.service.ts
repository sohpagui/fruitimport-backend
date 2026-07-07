import { StatutTransfert, Role } from '@prisma/client'
import { creerTransfert, listerTransferts, approuverTransfert, rejeterTransfert } from '../repositories/transfert.repository'
import { PaginationParams } from '../types'

export async function demanderTransfert(data: any, demandeur: { id: number; agenceId: number | null; role: string }) {
  if (demandeur.role !== Role.MAGASINIER && demandeur.role !== Role.SECRETAIRE) {
    throw new Error('Seul un magasinier ou secretaire peut initier un transfert.')
  }
  return creerTransfert({ ...data, demandePar: demandeur.id, agenceSourceId: demandeur.agenceId })
}
export async function obtenirTransferts(params: PaginationParams & { statut?: StatutTransfert; agenceId?: number }) {
  return listerTransferts(params)
}
export async function approuver(id: number, validePar: number) {
  return approuverTransfert(id, validePar)
}
export async function rejeter(id: number, validePar: number) {
  return rejeterTransfert(id, validePar)
}
