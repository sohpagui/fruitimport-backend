import { Router } from 'express'
import { creerTransfert, listerTransferts, approuverTransfert, rejeterTransfert } from '../controllers/transfert.controller'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

router.post('/', authentifier, autoriser(Role.MAGASINIER, Role.SECRETAIRE), creerTransfert)
router.get('/', authentifier, autoriser(Role.PDG, Role.MAGASINIER, Role.SECRETAIRE), listerTransferts)
router.patch('/:id/approuver', authentifier, autoriser(Role.PDG), approuverTransfert)
router.patch('/:id/rejeter', authentifier, autoriser(Role.PDG), rejeterTransfert)

export default router
