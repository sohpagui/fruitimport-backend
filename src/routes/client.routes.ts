import { Router } from 'express'
import { listerClients, detailClient, modifierLimiteCredit, ajouterPaiement, fixerEcheance, ajouterVersement, historiqueVersements, lancerJobInterets } from '../controllers/client.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

router.get('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), listerClients)
router.get('/:id', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), detailClient)
router.patch('/:id/credit-limite', authentifier, autoriser(Role.PDG), modifierLimiteCredit)
router.post('/:id/paiements', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), ajouterPaiement)

router.patch('/:id/echeance', authentifier, autoriser(Role.PDG), fixerEcheance)
router.post('/:id/versements', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), ajouterVersement)
router.get('/:id/versements', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), historiqueVersements)
router.post('/jobs/interets', authentifier, autoriser(Role.PDG), lancerJobInterets)

export default router
