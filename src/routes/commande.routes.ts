import { Router } from 'express'
import { creerCommande, listerCommandes, detailCommande, changerStatut } from '../controllers/commande.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

// Créer une commande (secrétaire ou client)
router.post('/', authentifier, creerCommande)

// Lister (PDG, secrétaire, magasinier)
router.get('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), listerCommandes)
router.get('/:id', authentifier, detailCommande)

// Changer le statut (secrétaire, magasinier)
router.patch('/:id/statut', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), changerStatut)

export default router
