import { Request, Response } from 'express'
import { z } from 'zod'
import { obtenirClients, obtenirClient, mettreAJourLimiteCredit, enregistrerPaiement } from '../services/client.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { getPagination, formatPagination } from '../utils/pagination'

export async function listerClients(req: Request, res: Response) {
  try {
    const pagination = getPagination(req)
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const statutCredit = req.query.statut_credit as any
    const { clients, total } = await obtenirClients({ ...pagination, agenceId, statutCredit })
    return repondreSucces(res, { clients, pagination: formatPagination(total, pagination) })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function detailClient(req: Request, res: Response) {
  try {
    const client = await obtenirClient(parseInt(req.params.id))
    return repondreSucces(res, client)
  } catch (e: any) { return repondreErreur(res, e.message, 404) }
}

export async function modifierLimiteCredit(req: Request, res: Response) {
  try {
    const { limiteCredit } = z.object({ limiteCredit: z.number().min(0) }).parse(req.body)
    const client = await mettreAJourLimiteCredit(parseInt(req.params.id), limiteCredit, req.user!.id)
    return repondreSucces(res, client, 'Limite de credit mise a jour.')
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function ajouterPaiement(req: Request, res: Response) {
  try {
    const { montant, commandeId } = z.object({ montant: z.number().positive(), commandeId: z.number().int().positive().optional() }).parse(req.body)
    const paiement = await enregistrerPaiement({ clientId: parseInt(req.params.id), montant, commandeId, enregistrePar: req.user!.id })
    return repondreSucces(res, paiement, 'Paiement enregistre.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

import { definirEcheanceEtTaux, faireVersement, obtenirHistoriqueVersements, executerJobInterets } from '../services/client.service'

export async function fixerEcheance(req: Request, res: Response) {
  try {
    const { dateEcheance, tauxInteretMensuel } = z.object({
      dateEcheance: z.string(),
      tauxInteretMensuel: z.number().min(0),
    }).parse(req.body)
    const client = await definirEcheanceEtTaux(parseInt(req.params.id), new Date(dateEcheance), tauxInteretMensuel)
    return repondreSucces(res, client, 'Echeance et taux fixes.')
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function ajouterVersement(req: Request, res: Response) {
  try {
    const { montant } = z.object({ montant: z.number().positive() }).parse(req.body)
    const versement = await faireVersement({ clientId: parseInt(req.params.id), montant, enregistreParId: req.user!.id })
    return repondreSucces(res, versement, 'Versement enregistre.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function historiqueVersements(req: Request, res: Response) {
  try {
    const versements = await obtenirHistoriqueVersements(parseInt(req.params.id))
    return repondreSucces(res, versements)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function lancerJobInterets(req: Request, res: Response) {
  try {
    const resultats = await executerJobInterets()
    return repondreSucces(res, resultats, 'Interets appliques.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}
