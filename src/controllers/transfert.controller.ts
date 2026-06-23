import { Request, Response } from 'express'
import { z } from 'zod'
import { demanderTransfert, obtenirTransferts, approuver, rejeter } from '../services/transfert.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { getPagination, formatPagination } from '../utils/pagination'

export async function creerTransfert(req: Request, res: Response) {
  try {
    const data = z.object({
      agenceDestinationId: z.number().int().positive(),
      fruitId: z.number().int().positive(),
      calibreId: z.number().int().positive(),
      quantite: z.number().int().positive(),
      note: z.string().optional(),
    }).parse(req.body)
    const transfert = await demanderTransfert(data, { id: req.user!.id, agenceId: req.user!.agenceId, role: req.user!.role })
    return repondreSucces(res, transfert, 'Transfert demande.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function listerTransferts(req: Request, res: Response) {
  try {
    const pagination = getPagination(req)
    const statut = req.query.statut as any
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const { transferts, total } = await obtenirTransferts({ ...pagination, statut, agenceId })
    return repondreSucces(res, { transferts, pagination: formatPagination(total, pagination) })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function approuverTransfert(req: Request, res: Response) {
  try {
    const transfert = await approuver(parseInt(req.params.id), req.user!.id)
    return repondreSucces(res, transfert, 'Transfert approuve.')
  } catch (e: any) { return repondreErreur(res, e.message, 400) }
}

export async function rejeterTransfert(req: Request, res: Response) {
  try {
    const transfert = await rejeter(parseInt(req.params.id), req.user!.id)
    return repondreSucces(res, transfert, 'Transfert rejete.')
  } catch (e: any) { return repondreErreur(res, e.message, 400) }
}
