import { Router } from 'express'
import { listerClients, detailClient, modifierLimiteCredit, ajouterPaiement } from '../controllers/client.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

router.get('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), listerClients)
router.get('/:id', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), detailClient)
router.patch('/:id/credit-limite', authentifier, autoriser(Role.PDG), modifierLimiteCredit)
router.post('/:id/paiements', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), ajouterPaiement)

export default router
