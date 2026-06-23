// ============================================================
// FICHIER : src/routes/dashboard.routes.ts
// Rôle : Routes du dashboard.
// ============================================================

import { Router } from 'express'
import { dashboardPDG, dashboardAgence } from '../controllers/dashboard.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

// Dashboard PDG (PDG uniquement)
router.get('/pdg', authentifier, autoriser(Role.PDG), dashboardPDG)

// Dashboard agence (PDG + employés de l'agence)
router.get('/agence/:id', authentifier, dashboardAgence)

export default router
