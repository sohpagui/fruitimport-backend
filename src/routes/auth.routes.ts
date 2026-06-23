// ============================================================
// FICHIER : src/routes/auth.routes.ts
// Rôle : Définit les URLs de l'authentification.
//        Chaque ligne connecte une URL à un controller.
// ============================================================

import { Router } from 'express'
import { login, refreshToken, logout, registerClient, me } from '../controllers/auth.controller'
import { authentifier } from '../middlewares/auth.middleware'

const router = Router()

// Routes publiques (pas besoin d'être connecté)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.post('/register-client', registerClient)

// Routes protégées (token requis)
router.post('/logout', authentifier, logout)
router.get('/me', authentifier, me)

export default router
