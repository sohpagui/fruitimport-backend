import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/upload.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

const router = Router()

// GET /fruits — Liste tous les fruits
router.get('/', authentifier, async (req, res) => {
  try {
    const fruits = await prisma.fruit.findMany({
      include: { calibres: { orderBy: { ordreAffichage: 'asc' } } },
      orderBy: { nom: 'asc' },
    })
    return repondreSucces(res, fruits)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /fruits — Creer un nouveau fruit
router.post('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  try {
    const data = z.object({
      nom: z.string().min(2),
      uniteMesure: z.enum(['carton', 'kg'])
    }).parse(req.body)
    const fruit = await prisma.fruit.create({ data: data as any, include: { calibres: true } })
    return repondreSucces(res, fruit, 'Fruit cree avec succes.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 500)
  }
})

// PATCH /fruits/:id — Modifier un fruit
router.patch('/:id', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  try {
    const data = z.object({
      nom: z.string().min(2).optional(),
      uniteMesure: z.enum(['carton', 'kg']).optional()
    }).parse(req.body)
    const fruit = await prisma.fruit.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { calibres: true }
    })
    return repondreSucces(res, fruit, 'Fruit modifie.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /fruits/:id/calibres — Ajouter un calibre
router.post('/:id/calibres', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  try {
    const data = z.object({
      valeur: z.string().min(1),
      prixAchat: z.number().positive(),
      prixVente: z.number().positive(),
      ordreAffichage: z.number().int().default(0)
    }).parse(req.body)
    const calibre = await prisma.calibre.create({
      data: { ...data, fruitId: parseInt(req.params.id) } as any
    })
    return repondreSucces(res, calibre, 'Calibre ajoute.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 500)
  }
})

// PATCH /fruits/calibres/:calibreId — Modifier un calibre
router.patch('/calibres/:calibreId', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  try {
    const data = z.object({
      valeur: z.string().min(1).optional(),
      prixAchat: z.number().positive().optional(),
      prixVente: z.number().positive().optional(),
    }).parse(req.body)
    const calibre = await prisma.calibre.update({
      where: { id: parseInt(req.params.calibreId) },
      data
    })
    return repondreSucces(res, calibre, 'Calibre modifie.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /fruits/:id/image — Upload image
router.post('/:id/image', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return repondreErreur(res, 'Aucun fichier recu.', 400)
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
    return repondreSucces(res, fruit, 'Image mise a jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
