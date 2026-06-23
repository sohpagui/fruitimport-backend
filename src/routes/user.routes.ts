// ============================================================
// FICHIER : src/routes/user.routes.ts
// Rôle : URLs pour la gestion des employés.
//        Toutes ces routes nécessitent le rôle PDG.
// ============================================================

import { Router } from 'express'
import { creerUser, listerUsers, obtenirUser, modifierUser } from '../controllers/user.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

// Toutes les routes admin nécessitent d'être connecté ET d'être PDG
router.use(authentifier, autoriser(Role.PDG))

router.post('/', creerUser)        // POST   /admin/users
router.get('/', listerUsers)       // GET    /admin/users
router.get('/:id', obtenirUser)    // GET    /admin/users/:id
router.patch('/:id', modifierUser) // PATCH  /admin/users/:id

export default router
