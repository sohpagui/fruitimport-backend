import { Router } from 'express'
import { listerStocks, alertesStock, receptionMarchandise, perteStock, catalogue } from '../controllers/stock.controller'
import { authentifier, autoriser, verifierAgence } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

// Catalogue public (clients et employés)
router.get('/catalogue', authentifier, catalogue)

// Stock — voir (PDG, secrétaire, magasinier)
router.get('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), listerStocks)
router.get('/alertes', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), alertesStock)

// Réception (magasinier uniquement)
router.post('/reception', authentifier, autoriser(Role.MAGASINIER, Role.SECRETAIRE), receptionMarchandise)

// Pertes (magasinier uniquement)
router.post('/pertes', authentifier, autoriser(Role.MAGASINIER, Role.SECRETAIRE), perteStock)

export default router
