import { Router } from 'express'
import { creerCommande, listerCommandes, detailCommande, changerStatut, bonCommandePDF } from '../controllers/commande.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'
const router = Router()
router.post('/', authentifier, creerCommande)
router.get('/', authentifier, listerCommandes)
router.get('/:id', authentifier, detailCommande)
router.patch('/:id/statut', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), changerStatut)
router.get('/:id/bon-pdf', authentifier, bonCommandePDF)
export default router
