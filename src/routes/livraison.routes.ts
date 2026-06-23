import { Router } from 'express'
import { creerLivraison, listerLivraisons, mettreAJourStatut } from '../controllers/livraison.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

router.post('/', authentifier, autoriser(Role.SECRETAIRE, Role.PDG), creerLivraison)
router.get('/', authentifier, listerLivraisons)
router.patch('/:id/statut', authentifier, autoriser(Role.LIVREUR, Role.SECRETAIRE, Role.PDG), mettreAJourStatut)

export default router
