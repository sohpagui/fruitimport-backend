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
router.get('/pertes', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), async (req, res) => {
  const prisma = (await import('../lib/prisma')).default
  const { repondreSucces, repondreErreur } = await import('../utils/response')
  try {
    const agenceId = req.query.agence_id ? parseInt(req.query.agence_id as string) : undefined
    const pertes = await prisma.perte.findMany({
      where: agenceId ? { agenceId } : {},
      include: { fruit: true, agence: true, calibre: true },
      orderBy: { date: 'desc' },
      take: 50
    })
    return repondreSucces(res, { pertes })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
