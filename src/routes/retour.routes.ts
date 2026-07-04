import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { authentifier, autoriser } from '../middlewares/auth.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

const router = Router()

// POST /retours — Enregistrer un retour
router.post('/', authentifier, autoriser(Role.SECRETAIRE, Role.PDG), async (req, res) => {
  try {
    const data = z.object({
      livraisonId: z.number().int().positive(),
      fruitId: z.number().int().positive(),
      calibreId: z.number().int().positive(),
      quantite: z.number().int().positive(),
      raison: z.string().min(3),
    }).parse(req.body)

    // Créer le retour
    const retour = await prisma.retourMarchandise.create({
      data: { ...data, enregistrePar: req.user!.id } as any,
      include: {
        fruit: { select: { id: true, nom: true } },
        livraison: { select: { id: true, commandeId: true } }
      }
    })

    // Réincrémenter le stock
    await prisma.stock.updateMany({
      where: { fruitId: data.fruitId, calibreId: data.calibreId },
      data: { quantiteCartons: { increment: data.quantite } }
    })

    return repondreSucces(res, retour, 'Retour enregistré et stock mis à jour.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return repondreErreur(res, 'Données invalides.', 400, e.errors)
    return repondreErreur(res, e.message, 500)
  }
})

// GET /retours — Lister les retours
router.get('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  try {
    const retours = await prisma.retourMarchandise.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        fruit: { select: { id: true, nom: true } },
        livraison: { select: { id: true, commandeId: true } },
        employe: { select: { id: true, nom: true } }
      }
    })
    return repondreSucces(res, retours)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
