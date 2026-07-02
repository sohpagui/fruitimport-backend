import { Router } from 'express'
import { } from '@prisma/client'
import prisma from '../lib/prisma'
import { authentifier } from '../middlewares/auth.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'

const router = Router()

// GET /fruits — Liste tous les fruits avec leurs calibres
router.get('/', authentifier, async (req, res) => {
  try {
    const fruits = await prisma.fruit.findMany({
      include: { calibres: { orderBy: { ordreAffichage: 'asc' } } },
      orderBy: { nom: 'asc' },
    })
    return repondreSucces(res, fruits)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
