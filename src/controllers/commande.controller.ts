import { Request, Response } from 'express'
import { z } from 'zod'
import { passerCommande, obtenirCommandes, obtenirCommande, mettreAJourStatutCommande } from '../services/commande.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { getPagination, formatPagination } from '../utils/pagination'

export async function creerCommande(req: Request, res: Response) {
  try {
    const schema = z.object({
      agenceId: z.number().int().positive(),
      clientId: z.number().int().positive(),
      modePaiement: z.enum(['ESPECES','CREDIT']),
      adresseLivraison: z.string().max(255).optional(),
      note: z.string().optional(),
      lignes: z.array(z.object({
        fruitId: z.number().int().positive(),
        calibreId: z.number().int().positive(),
        categorie: z.enum(['NORMAL','SOLDE']),
        quantite: z.number().int().positive(),
        prixUnitaire: z.number().positive(),
      })).min(1),
    })
    const data = schema.parse(req.body)
    const commande = await passerCommande({ ...data, creeParId: req.user!.isClient ? undefined : req.user!.id })
    return repondreSucces(res, commande, 'Commande creee.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}

export async function listerCommandes(req: Request, res: Response) {
  try {
    const pagination = getPagination(req)
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const statut = req.query.statut as any
    // Si c est un client, il ne voit que ses propres commandes
    let clientId = req.query.client_id ? parseInt(req.query.client_id as string) : undefined
    const { commandes, total } = await obtenirCommandes({ ...pagination, agenceId, clientId, statut })
    return repondreSucces(res, { commandes, pagination: formatPagination(total, pagination) })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}

export async function detailCommande(req: Request, res: Response) {
  try {
    const commande = await obtenirCommande(parseInt(req.params.id))
    return repondreSucces(res, commande)
  } catch (e: any) { return repondreErreur(res, e.message, 404) }
}

export async function changerStatut(req: Request, res: Response) {
  try {
    const { statut } = z.object({ statut: z.enum(['EN_ATTENTE','CONFIRMEE','PREPAREE','EN_LIVRAISON','LIVREE','ANNULEE']) }).parse(req.body)
    const commande = await mettreAJourStatutCommande(parseInt(req.params.id), statut as any)
    return repondreSucces(res, commande, 'Statut mis a jour.')
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Statut invalide.', 400, e.errors)
    return repondreErreur(res, e.message, 400)
  }
}
