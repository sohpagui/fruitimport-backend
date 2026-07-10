import { Router, Request, Response } from 'express'
import { authentifier } from '../middlewares/auth.middleware'
import { autoriser } from '../middlewares/auth.middleware'
import { Role } from '@prisma/client'
import prisma from '../lib/prisma'
import { repondreSucces, repondreErreur } from '../utils/response'

const router = Router()

// GET /comptoir - Infos comptoir Yaounde
router.get('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE, Role.MAGASINIER), async (req: Request, res: Response) => {
  try {
    const comptoir = await prisma.comptoir.findFirst({
      where: { agenceId: 2 },
      include: {
        gerantActuel: { select: { id: true, nom: true, telephone: true, photoUrl: true } },
        stockComptoir: {
          include: {
            fruit: { select: { id: true, nom: true, imageUrl: true } },
            calibre: { select: { id: true, valeur: true } }
          }
        }
      }
    })
    return repondreSucces(res, comptoir)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// PATCH /comptoir/gerant - Changer gerant du jour
router.patch('/gerant', authentifier, autoriser(Role.SECRETAIRE, Role.PDG), async (req: Request, res: Response) => {
  try {
    const { gerantId } = req.body
    const comptoir = await prisma.comptoir.update({
      where: { id: 1 },
      data: { gerantActuelId: gerantId },
      include: { gerantActuel: { select: { id: true, nom: true } } }
    })
    return repondreSucces(res, comptoir, 'Gerant mis a jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /comptoir/approvisionner - Ajouter stock au comptoir
router.post('/approvisionner', authentifier, autoriser(Role.SECRETAIRE), async (req: Request, res: Response) => {
  try {
    const { fruitId, calibreId, quantite, prixDetail } = req.body
    // Enregistrer l'approvisionnement
    const appro = await prisma.approvisionnementComptoir.create({
      data: { comptoirId: 1, fruitId, calibreId, quantite, gerantId: req.user!.id },
      include: { fruit: { select: { nom: true } }, calibre: { select: { valeur: true } } }
    })
    // Mettre a jour le stock comptoir
    await prisma.stockComptoir.upsert({
      where: { comptoirId_fruitId_calibreId: { comptoirId: 1, fruitId, calibreId } },
      update: { quantite: { increment: quantite }, prixDetail },
      create: { comptoirId: 1, fruitId, calibreId, quantite, prixDetail }
    })
    return repondreSucces(res, appro, 'Comptoir approvisionne.', 201)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /comptoir/versement - Versement du soir
router.post('/versement', authentifier, autoriser(Role.SECRETAIRE), async (req: Request, res: Response) => {
  try {
    const { montant, note } = req.body
    const comptoir = await prisma.comptoir.findFirst({ where: { agenceId: 2 } })
    if (!comptoir?.gerantActuelId) return repondreErreur(res, 'Aucun gerant actif.', 400)
    const versement = await prisma.versementComptoir.create({
      data: { comptoirId: 1, montant, gerantId: comptoir.gerantActuelId, note },
      include: { gerant: { select: { nom: true } } }
    })
    return repondreSucces(res, versement, 'Versement enregistre.', 201)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /comptoir/perte - Declarer perte comptoir
router.post('/perte', authentifier, autoriser(Role.SECRETAIRE), async (req: Request, res: Response) => {
  try {
    const { fruitId, calibreId, quantite, raison } = req.body
    const comptoir = await prisma.comptoir.findFirst({ where: { agenceId: 2 } })
    if (!comptoir?.gerantActuelId) return repondreErreur(res, 'Aucun gerant actif.', 400)
    const perte = await prisma.perteComptoir.create({
      data: { comptoirId: 1, fruitId, calibreId, quantite, raison, gerantId: comptoir.gerantActuelId },
      include: { fruit: { select: { nom: true } } }
    })
    // Diminuer le stock comptoir
    await prisma.stockComptoir.updateMany({
      where: { comptoirId: 1, fruitId, calibreId },
      data: { quantite: { decrement: quantite } }
    })
    return repondreSucces(res, perte, 'Perte declaree.', 201)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// GET /comptoir/versements - Historique versements
router.get('/versements', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req: Request, res: Response) => {
  try {
    const versements = await prisma.versementComptoir.findMany({
      where: { comptoirId: 1 },
      include: { gerant: { select: { nom: true } } },
      orderBy: { date: 'desc' },
      take: 30
    })
    return repondreSucces(res, versements)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// GET /comptoir/stats - Stats du comptoir pour PDG
router.get('/stats', authentifier, autoriser(Role.PDG), async (req: Request, res: Response) => {
  try {
    const aujourd_hui = new Date(); aujourd_hui.setHours(0, 0, 0, 0)
    const demain = new Date(aujourd_hui); demain.setDate(demain.getDate() + 1)
    const [versementsJour, versementsMois, pertesJour, stock] = await Promise.all([
      prisma.versementComptoir.aggregate({ where: { comptoirId: 1, date: { gte: aujourd_hui, lt: demain } }, _sum: { montant: true }, _count: { id: true } }),
      prisma.versementComptoir.aggregate({ where: { comptoirId: 1, date: { gte: new Date(aujourd_hui.getFullYear(), aujourd_hui.getMonth(), 1) } }, _sum: { montant: true } }),
      prisma.perteComptoir.aggregate({ where: { comptoirId: 1, date: { gte: aujourd_hui, lt: demain } }, _sum: { quantite: true }, _count: { id: true } }),
      prisma.stockComptoir.findMany({ where: { comptoirId: 1 }, include: { fruit: { select: { nom: true } }, calibre: { select: { valeur: true } } } })
    ])
    return repondreSucces(res, {
      versementsJour: { montant: Number(versementsJour._sum.montant) || 0, nb: versementsJour._count.id },
      versementsMois: Number(versementsMois._sum.montant) || 0,
      pertesJour: { quantite: pertesJour._sum.quantite || 0, nb: pertesJour._count.id },
      stock
    })
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// PATCH /comptoir/prix - Modifier prix detail (PDG)
router.patch('/prix', authentifier, autoriser(Role.PDG), async (req: Request, res: Response) => {
  try {
    const { fruitId, calibreId, prixDetail } = req.body
    const stock = await prisma.stockComptoir.updateMany({
      where: { comptoirId: 1, fruitId, calibreId },
      data: { prixDetail }
    })
    return repondreSucces(res, stock, 'Prix mis a jour.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
