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

// POST /clients — Creer un nouveau client (Secretaire ou PDG)
router.post('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  const { z } = await import('zod')
  const { repondreSucces, repondreErreur } = await import('../utils/response')
  const prisma = (await import('../lib/prisma')).default
  try {
    const data = z.object({
      nom: z.string().min(2),
      telephone: z.string().min(8),
      type: z.enum(['PARTICULIER', 'SUPERMARCHE']),
      agenceId: z.number().int().positive(),
      email: z.string().email().optional(),
      adresse: z.string().optional(),
      limiteCredit: z.number().default(0),
    }).parse(req.body)
    const client = await prisma.client.create({
      data: { ...data, motDePasseHash: await (await import('bcryptjs')).default.hash('Client2024!', 10) } as any,
      include: { agence: true }
    })
    return repondreSucces(res, client, 'Client cree.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return (await import('../utils/response')).repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return (await import('../utils/response')).repondreErreur(res, e.message, 500)
  }
})

// PATCH /clients/:id — Modifier un client
router.patch('/:id', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  const { z } = await import('zod')
  const prisma = (await import('../lib/prisma')).default
  const { repondreSucces, repondreErreur } = await import('../utils/response')
  try {
    const data = z.object({
      nom: z.string().min(2).optional(),
      telephone: z.string().min(8).optional(),
      email: z.string().email().optional(),
      adresse: z.string().optional(),
    }).parse(req.body)
    const client = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { agence: true }
    })
    return repondreSucces(res, client, 'Client modifie.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /clients — Creer un nouveau client (Secretaire ou PDG)
router.post('/', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  const { z } = await import('zod')
  const { repondreSucces, repondreErreur } = await import('../utils/response')
  const prisma = (await import('../lib/prisma')).default
  try {
    const data = z.object({
      nom: z.string().min(2),
      telephone: z.string().min(8),
      type: z.enum(['PARTICULIER', 'SUPERMARCHE']),
      agenceId: z.number().int().positive(),
      email: z.string().email().optional(),
      adresse: z.string().optional(),
      limiteCredit: z.number().default(0),
    }).parse(req.body)
    const client = await prisma.client.create({
      data: { ...data, motDePasseHash: await (await import('bcryptjs')).default.hash('Client2024!', 10) } as any,
      include: { agence: true }
    })
    return repondreSucces(res, client, 'Client cree.', 201)
  } catch (e: any) {
    if (e.name === 'ZodError') return (await import('../utils/response')).repondreErreur(res, 'Donnees invalides.', 400, e.errors)
    return (await import('../utils/response')).repondreErreur(res, e.message, 500)
  }
})

// PATCH /clients/:id — Modifier un client
router.patch('/:id', authentifier, autoriser(Role.PDG, Role.SECRETAIRE), async (req, res) => {
  const { z } = await import('zod')
  const prisma = (await import('../lib/prisma')).default
  const { repondreSucces, repondreErreur } = await import('../utils/response')
  try {
    const data = z.object({
      nom: z.string().min(2).optional(),
      telephone: z.string().min(8).optional(),
      email: z.string().email().optional(),
      adresse: z.string().optional(),
    }).parse(req.body)
    const client = await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { agence: true }
    })
    return repondreSucces(res, client, 'Client modifie.')
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
