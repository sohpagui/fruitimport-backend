// ============================================================
// FICHIER : src/controllers/dashboard.controller.ts
// Rôle : Endpoints du dashboard.
// ============================================================

import { Request, Response } from 'express'
import { obtenirDashboardPDG, obtenirDashboardAgence, obtenirBenefices } from '../services/dashboard.service'
import { repondreSucces, repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

// GET /dashboard/pdg — Dashboard global (PDG uniquement)
export async function dashboardPDG(req: Request, res: Response) {
  try {
    const data = await obtenirDashboardPDG()
    return repondreSucces(res, data)
  } catch (e: any) {
    return repondreErreur(res, e.message, 500)
  }
}

// GET /dashboard/agence/:id — Dashboard d'une agence
export async function dashboardAgence(req: Request, res: Response) {
  try {
    const agenceId = parseInt(req.params.id)

    // Un employé ne peut voir que son agence, sauf le PDG
    if (req.user!.role !== Role.PDG && req.user!.agenceId !== agenceId) {
      return repondreErreur(res, 'Acces refuse a cette agence.', 403)
    }

    const data = await obtenirDashboardAgence(agenceId)
    return repondreSucces(res, data)
  } catch (e: any) {
    return repondreErreur(res, e.message, 500)
  }
}

export async function beneficesPDG(req: Request, res: Response) {
  try {
    const periode = (req.query.periode as string) || 'jour'
    const data = await obtenirBenefices(periode)
    return repondreSucces(res, data)
  } catch (e: any) {
    return repondreErreur(res, e.message, 500)
  }
}
