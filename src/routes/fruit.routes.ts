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

    // Upload vers Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'fruitimport/fruits', public_id: `fruit_${req.params.id}`, overwrite: true },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(req.file!.buffer)
    })

    const imageUrl = result.secure_url
    const fruit = await prisma.fruit.update({
      where: { id: parseInt(req.params.id) },
      data: { imageUrl },
    })
    return repondreSucces(res, fruit, 'Image mise à jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
