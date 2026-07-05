import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/upload.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

const router = Router()

// GET /parametres — Recuperer tous les parametres
// Route publique - pas besoin de token
router.get('/', async (req, res) => {
  try {
    const params = await prisma.parametreSysteme.findMany()
    const result: Record<string, string> = {}
    params.forEach(p => result[p.cle] = p.valeur)
    return repondreSucces(res, result)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /parametres/logo — Upload logo entreprise (PDG uniquement)
router.post('/logo', authentifier, autoriser(Role.PDG), upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return repondreErreur(res, 'Aucun fichier recu.', 400)
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'fruitimport/logo',
      public_id: 'logo_entreprise',
      overwrite: true,
    })
    await prisma.parametreSysteme.upsert({
      where: { cle: 'logo_url' },
      update: { valeur: result.secure_url },
      create: { cle: 'logo_url', valeur: result.secure_url }
    })
    return repondreSucces(res, { logoUrl: result.secure_url }, 'Logo mis a jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// GET /parametres/rapport — Telecharger le dernier rapport
router.get('/rapport', authentifier, autoriser(Role.PDG), async (req, res) => {
  try {
    const param = await prisma.parametreSysteme.findUnique({ where: { cle: 'dernier_rapport_url' } })
    const date = await prisma.parametreSysteme.findUnique({ where: { cle: 'dernier_rapport_date' } })
    return repondreSucces(res, { url: param.valeur, date: date?.valeur })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /parametres/rapport/generer — Generer et telecharger le rapport
router.post('/rapport/generer', authentifier, autoriser(Role.PDG), async (req, res) => {
  try {
    const { genererRapportJournalierBuffer } = await import('../services/rapport.service')
    const { buffer, dateStr } = await genererRapportJournalierBuffer()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader("Content-Disposition", "attachment; filename=rapport.pdf")
    res.send(buffer)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
