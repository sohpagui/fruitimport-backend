import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/upload.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

const router = Router()

router.get('/', authentifier, async (req, res) => {
  try {
    const fruits = await prisma.fruit.findMany({
      include: { calibres: { orderBy: { ordreAffichage: 'asc' } } },
      orderBy: { nom: 'asc' },
    })
    return repondreSucces(res, fruits)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

router.post('/:id/image', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return repondreErreur(res, 'Aucun fichier reçu.', 400)

    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'fruitimport/fruits',
      public_id: `fruit_${req.params.id}`,
      overwrite: true,
    })

    const fruit = await prisma.fruit.update({
      where: { id: parseInt(req.params.id) },
      data: { imageUrl: result.secure_url },
    })
    return repondreSucces(res, fruit, 'Image mise à jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
