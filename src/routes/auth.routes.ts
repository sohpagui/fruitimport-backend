// ============================================================
// FICHIER : src/routes/auth.routes.ts
// Rôle : Définit les URLs de l'authentification.
//        Chaque ligne connecte une URL à un controller.
// ============================================================

import { Router } from 'express'
import { login, refreshToken, logout, registerClient, me, changerPassword, historiqueConnexions } from '../controllers/auth.controller'
import { authentifier } from '../middlewares/auth.middleware'

const router = Router()

// Routes publiques (pas besoin d'être connecté)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.post('/register-client', registerClient)

// Routes protégées (token requis)
router.post('/logout', authentifier, logout)
router.get('/me', authentifier, me)

router.patch('/changer-mot-de-passe', authentifier, changerPassword)
router.get('/historique-connexions', authentifier, historiqueConnexions)
export default router

import { upload } from '../middlewares/upload.middleware'
import prisma from '../lib/prisma'
import { repondreSucces, repondreErreur } from '../utils/response'
import cloudinary from '../lib/cloudinary'

router.post('/photo-profil', authentifier, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return repondreErreur(res, 'Aucun fichier reçu.', 400)
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'fruitimport/profils',
      public_id: `user_${req.user!.id}`,
      overwrite: true,
      transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
    })
    await prisma.user.update({ where: { id: req.user!.id }, data: { photoUrl: result.secure_url } })
    return repondreSucces(res, { photoUrl: result.secure_url }, 'Photo mise à jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})
