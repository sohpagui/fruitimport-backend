import { Router } from 'express'
import path from 'path'
import prisma from '../lib/prisma'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/upload.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

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

// POST /fruits/:id/image — Upload image d'un fruit (PDG ou Secrétaire)
router.post('/:id/image', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return repondreErreur(res, 'Aucun fichier reçu.', 400)
    const baseUrl = process.env.BASE_URL || `https://fruitimport-backend.onrender.com`
    const imageUrl = `${baseUrl}/uploads/fruits/${req.file.filename}`
    const fruit = await prisma.fruit.update({
      where: { id: parseInt(req.params.id) },
      data: { imageUrl },
    })
    return repondreSucces(res, fruit, 'Image mise à jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
