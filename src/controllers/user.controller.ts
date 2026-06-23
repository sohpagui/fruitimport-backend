// ============================================================
// FICHIER : src/controllers/user.controller.ts
// Rôle : Gère les requêtes HTTP pour la gestion des employés.
// ============================================================

import { Request, Response } from 'express'
import { z } from 'zod'
import { Role } from '@prisma/client'
import {
  creerCompteEmploye,
  listerEmployes,
  modifierEmploye,
  obtenirEmploye,
} from '../services/user.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { getPagination, formatPagination } from '../utils/pagination'

const schemaCreerUser = z.object({
  nom: z.string().min(2).max(100),
  telephone: z.string().min(8).max(20),
  email: z.string().email().optional(),
  motDePasse: z.string().min(6),
  role: z.enum(['SECRETAIRE', 'MAGASINIER', 'LIVREUR']),
  agenceId: z.number().int().positive(),
})

const schemaMettreAJour = z.object({
  nom: z.string().min(2).max(100).optional(),
  telephone: z.string().min(8).max(20).optional(),
  email: z.string().email().optional(),
  motDePasse: z.string().min(6).optional(),
  actif: z.boolean().optional(),
  agenceId: z.number().int().positive().optional(),
})

// POST /admin/users — Créer un employé (PDG uniquement)
export async function creerUser(req: Request, res: Response) {
  try {
    const data = schemaCreerUser.parse(req.body)
    const user = await creerCompteEmploye(
      { ...data, role: data.role as Role },
      req.user!.id
    )
    return repondreSucces(res, user, 'Compte employé créé avec succès.', 201)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return repondreErreur(res, 'Données invalides.', 400, error.errors)
    }
    return repondreErreur(res, error.message, 400)
  }
}

// GET /admin/users — Lister les employés
export async function listerUsers(req: Request, res: Response) {
  try {
    const pagination = getPagination(req)
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const role = req.query.role as Role | undefined

    const { users, total } = await listerEmployes({
      ...pagination,
      agenceId,
      role,
    })

    return repondreSucces(res, {
      users,
      pagination: formatPagination(total, pagination),
    })
  } catch (error: any) {
    return repondreErreur(res, error.message, 500)
  }
}

// GET /admin/users/:id — Détails d'un employé
export async function obtenirUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    const user = await obtenirEmploye(id)
    return repondreSucces(res, user)
  } catch (error: any) {
    return repondreErreur(res, error.message, 404)
  }
}

// PATCH /admin/users/:id — Modifier un employé
export async function modifierUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    const data = schemaMettreAJour.parse(req.body)
    const user = await modifierEmploye(id, data, {
      id: req.user!.id,
      role: req.user!.role as Role,
    })
    return repondreSucces(res, user, 'Employé mis à jour.')
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return repondreErreur(res, 'Données invalides.', 400, error.errors)
    }
    return repondreErreur(res, error.message, 400)
  }
}
