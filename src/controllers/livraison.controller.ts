import { Request, Response } from 'express'
import { z } from 'zod'
import { assignerLivraison, obtenirLivraisons, mettreAJourLivraison } from '../services/livraison.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { getPagination, formatPagination } from '../utils/pagination'

export async function creerLivraison(req: Request, res: Response) {
  try {
    const { commandeId, livreurId } = z.object({ commandeId: z.number().int().positive(), livreurId: z.number().int().positive() }).parse(req.body)
    const livraison = await assignerLivraison({ commandeId, livreurId })
    return repondreSucces(res, livraison, 'Livraison assignee.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function listerLivraisons(req: Request, res: Response) {
  try {
    const pagination = getPagination(req)
    const livreurId = req.query.livreur_id ? parseInt(req.query.livreur_id as string) : undefined
    const statut = req.query.statut as any
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const { livraisons, total } = await obtenirLivraisons({ ...pagination, livreurId, statut, agenceId })
    return repondreSucces(res, { livraisons, pagination: formatPagination(total, pagination) })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function mettreAJourStatut(req: Request, res: Response) {
  try {
    const { statut, noteProbleme } = z.object({
      statut: z.enum(['PREPARE','EN_ROUTE','LIVRE','PROBLEME']),
      noteProbleme: z.string().optional(),
    }).parse(req.body)
    const livraison = await mettreAJourLivraison(parseInt(req.params.id), statut as any, noteProbleme)
    return repondreSucces(res, livraison, 'Statut mis a jour.')
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}
