import { Router } from 'express'
import { } from '@prisma/client'
import prisma from '../lib/prisma'
import { authentifier } from '../middlewares/auth.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'

const router = Router()

// GET /agences — Liste des agences
router.get('/', authentifier, async (req, res) => {
  try {
    const agences = await prisma.agence.findMany()
    return repondreSucces(res, agences)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// GET /agences/:id — Détail d'une agence
router.get('/:id', authentifier, async (req, res) => {
  try {
    const agence = await prisma.agence.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    if (!agence) return repondreErreur(res, 'Agence introuvable.', 404)
    return repondreSucces(res, agence)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
