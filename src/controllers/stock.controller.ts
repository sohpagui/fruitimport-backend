import { Request, Response } from 'express'
import { z } from 'zod'
import { obtenirStocks, obtenirAlertes, recevoirMarchandise, declarerUnePerte, obtenirCatalogueAgence } from '../services/stock.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { getPagination, formatPagination } from '../utils/pagination'

export async function listerStocks(req: Request, res: Response) {
  try {
    const pagination = getPagination(req)
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const fruitId = req.query.fruit_id ? parseInt(req.query.fruit_id as string) : undefined
    const { stocks, total } = await obtenirStocks({ ...pagination, agenceId, fruitId })
    return repondreSucces(res, { stocks, pagination: formatPagination(total, pagination) })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function alertesStock(req: Request, res: Response) {
  try {
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const alertes = await obtenirAlertes(agenceId)
    return repondreSucces(res, alertes)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function receptionMarchandise(req: Request, res: Response) {
  try {
    const schema = z.object({
      agenceId: z.number().int().positive(),
      fruitId: z.number().int().positive(),
      calibreId: z.number().int().positive(),
      origine: z.enum(['MAROC','AFRIQUE_DU_SUD','ITALIE','AUTRE']),
      cartonsNormal: z.number().int().min(0),
      cartonsSolde: z.number().int().min(0).default(0),
      prixNormal: z.number().positive(),
      prixSolde: z.number().positive().optional(),
    })
    const data = schema.parse(req.body)
    const reception = await recevoirMarchandise({ ...data, recuParId: req.user!.id })
    return repondreSucces(res, reception, 'Marchandise receptionnee.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function perteStock(req: Request, res: Response) {
  try {
    const schema = z.object({
      agenceId: z.number().int().positive(),
      fruitId: z.number().int().positive(),
      calibreId: z.number().int().positive(),
      origine: z.enum(['MAROC','AFRIQUE_DU_SUD','ITALIE','AUTRE']),
      categorie: z.enum(['NORMAL','SOLDE']),
      quantite: z.number().int().positive(),
      raison: z.enum(['JAUNISSEMENT','POURRISSEMENT','CHOC','AUTRE']),
    })
    const data = schema.parse(req.body)
    const perte = await declarerUnePerte({ ...data, declarePar: req.user!.id })
    return repondreSucces(res, perte, 'Perte declaree.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function catalogue(req: Request, res: Response) {
  try {
    const agenceId = parseInt(req.query.agence_id as string)
    if (!agenceId) return repondreErreur(res, 'agence_id requis.', 400)
    const items = await obtenirCatalogueAgence(agenceId)
    return repondreSucces(res, items)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}
