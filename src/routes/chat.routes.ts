import { Router } from 'express'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'
import { authentifier } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/upload.middleware'
import { repondreSucces, repondreErreur } from '../utils/response'

const router = Router()

// GET /chat/utilisateurs — Liste tous les utilisateurs pour demarrer une conversation
router.get('/utilisateurs', authentifier, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { actif: true, id: { not: req.user!.id } },
      select: { id: true, nom: true, role: true, photoUrl: true, agence: { select: { nom: true } } },
      orderBy: { nom: 'asc' }
    })
    return repondreSucces(res, users)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// GET /chat/conversations — Liste toutes les conversations de l utilisateur
router.get('/conversations', authentifier, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: req.user!.id } } },
      include: {
        participants: { include: { user: { select: { id: true, nom: true, photoUrl: true, role: true } } } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    })
    return repondreSucces(res, conversations)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /chat/conversations — Creer ou obtenir une conversation privee
router.post('/conversations', authentifier, async (req, res) => {
  try {
    const { userId } = req.body
    const myId = req.user!.id

    // Chercher conversation existante entre ces 2 utilisateurs
    const existing = await prisma.conversation.findFirst({
      where: {
        type: 'PRIVE',
        participants: { every: { userId: { in: [myId, userId] } } }
      },
      include: { participants: { include: { user: { select: { id: true, nom: true, photoUrl: true, role: true } } } } }
    })

    if (existing) return repondreSucces(res, existing)

    // Creer nouvelle conversation
    const conv = await prisma.conversation.create({
      data: {
        type: 'PRIVE',
        participants: { create: [{ userId: myId }, { userId }] }
      },
      include: { participants: { include: { user: { select: { id: true, nom: true, photoUrl: true, role: true } } } } }
    })
    return repondreSucces(res, conv, 'Conversation créée.', 201)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// GET /chat/conversations/:id/messages — Messages d une conversation
router.get('/conversations/:id/messages', authentifier, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: parseInt(req.params.id) },
      include: { sender: { select: { id: true, nom: true, photoUrl: true } } },
      orderBy: { createdAt: 'asc' },
      take: 50
    })
    // Marquer comme lus
    await prisma.message.updateMany({
      where: { conversationId: parseInt(req.params.id), senderId: { not: req.user!.id }, lu: false },
      data: { lu: true }
    })
    return repondreSucces(res, messages)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

// POST /chat/conversations/:id/messages — Envoyer un message
router.post('/conversations/:id/messages', authentifier, upload.single('image'), async (req, res) => {
  try {
    let imageUrl: string | undefined
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      const dataURI = `data:${req.file.mimetype};base64,${b64}`
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'fruitimport/chat' })
      imageUrl = result.secure_url
    }
    const message = await prisma.message.create({
      data: {
        conversationId: parseInt(req.params.id),
        senderId: req.user!.id,
        contenu: req.body.contenu || '',
        type: imageUrl ? 'IMAGE' : 'TEXTE',
        imageUrl
      },
      include: { sender: { select: { id: true, nom: true, photoUrl: true } } }
    })
    return repondreSucces(res, message, 'Message envoyé.', 201)
  } catch (e: any) { return repondreErreur(res, e.message, 500) }
})

export default router
