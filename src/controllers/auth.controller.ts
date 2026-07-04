// ============================================================
// FICHIER : src/controllers/auth.controller.ts
// Rôle : Reçoit les requêtes HTTP, appelle le service,
//        et retourne la réponse JSON.
//        Le controller ne contient PAS de logique métier —
//        il délègue tout au service.
// ============================================================

import { Request, Response } from 'express'
import { z } from 'zod'
import { connexion, rafraichirToken, inscrireClient } from '../services/auth.service'
import { changerMotDePasse, obtenirHistoriqueConnexions } from '../repositories/auth.repository'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'
import { repondreSucces, repondreErreur } from '../utils/response'

// Schémas de validation Zod
const schemaConnexion = z.object({
  identifiant: z.string().min(1, 'Identifiant requis'),
  motDePasse: z.string().min(1, 'Mot de passe requis'),
})

const schemaInscriptionClient = z.object({
  nom: z.string().min(2, 'Nom trop court').max(150),
  type: z.enum(['PARTICULIER', 'SUPERMARCHE']),
  agenceId: z.number().int().positive(),
  telephone: z.string().min(8).max(20),
  email: z.string().email().optional(),
  adresse: z.string().max(255).optional(),
  motDePasse: z.string().min(6, 'Mot de passe : 6 caractères minimum'),
})

// POST /auth/login
export async function login(req: Request, res: Response) {
  try {
    const { identifiant, motDePasse } = schemaConnexion.parse(req.body)
    const resultat = await connexion(identifiant, motDePasse)
    return repondreSucces(res, resultat, 'Connexion réussie.')
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return repondreErreur(res, 'Données invalides.', 400, error.errors)
    }
    return repondreErreur(res, error.message, 401)
  }
}

// POST /auth/refresh-token
export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return repondreErreur(res, 'Refresh token manquant.', 400)
    }
    const resultat = await rafraichirToken(refreshToken)
    return repondreSucces(res, resultat)
  } catch (error: any) {
    return repondreErreur(res, error.message, 401)
  }
}

// POST /auth/logout
export async function logout(req: Request, res: Response) {
  // Côté serveur, on ne peut pas invalider un JWT (stateless).
  // Le client doit supprimer le token de son stockage local.
  // En production, on utiliserait une blacklist Redis.
  return repondreSucces(res, null, 'Déconnexion réussie. Supprimez le token côté client.')
}

// POST /auth/register-client
export async function registerClient(req: Request, res: Response) {
  try {
    const data: any = schemaInscriptionClient.parse(req.body)
    const client = await inscrireClient(data)
    return repondreSucces(res, client, 'Compte client créé avec succès.', 201)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return repondreErreur(res, 'Données invalides.', 400, error.errors)
    }
    return repondreErreur(res, error.message, 400)
  }
}

// GET /auth/me — Infos de l'utilisateur connecté
export async function me(req: Request, res: Response) {
  return repondreSucces(res, req.user)
}

// PATCH /auth/changer-mot-de-passe
export async function changerPassword(req: Request, res: Response) {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = z.object({
      ancienMotDePasse: z.string().min(6),
      nouveauMotDePasse: z.string().min(6),
    }).parse(req.body)

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) return repondreErreur(res, 'Utilisateur introuvable.', 404)

    const valide = await bcrypt.compare(ancienMotDePasse, user.motDePasseHash)
    if (!valide) return repondreErreur(res, 'Ancien mot de passe incorrect.', 400)

    const hash = await bcrypt.hash(nouveauMotDePasse, 12)
    await changerMotDePasse(req.user!.id, hash)
    return repondreSucces(res, null, 'Mot de passe changé avec succès.')
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Données invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 500)
  }
}

// GET /auth/historique-connexions
export async function historiqueConnexions(req: Request, res: Response) {
  try {
    const historique = await obtenirHistoriqueConnexions(req.user!.id)
    return repondreSucces(res, historique)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
}
