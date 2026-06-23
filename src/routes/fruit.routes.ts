import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authentifier } from '../middlewares/auth.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'

const router = Router()
const prisma = new PrismaClient()

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
