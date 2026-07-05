"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// GET /chat/utilisateurs — Liste tous les utilisateurs pour demarrer une conversation
router.get('/utilisateurs', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            where: { actif: true, id: { not: req.user.id } },
            select: { id: true, nom: true, role: true, photoUrl: true, agence: { select: { nom: true } } },
            orderBy: { nom: 'asc' }
        });
        return (0, response_1.repondreSucces)(res, users);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /chat/conversations — Liste toutes les conversations de l utilisateur
router.get('/conversations', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const conversations = await prisma_1.default.conversation.findMany({
            where: { participants: { some: { userId: req.user.id } } },
            include: {
                participants: { include: { user: { select: { id: true, nom: true, photoUrl: true, role: true } } } },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            },
            orderBy: { createdAt: 'desc' }
        });
        return (0, response_1.repondreSucces)(res, conversations);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /chat/conversations — Creer ou obtenir une conversation privee
router.post('/conversations', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const { userId } = req.body;
        const myId = req.user.id;
        // Chercher conversation existante entre ces 2 utilisateurs
        const existing = await prisma_1.default.conversation.findFirst({
            where: {
                type: 'PRIVE',
                participants: { every: { userId: { in: [myId, userId] } } }
            },
            include: { participants: { include: { user: { select: { id: true, nom: true, photoUrl: true, role: true } } } } }
        });
        if (existing)
            return (0, response_1.repondreSucces)(res, existing);
        // Creer nouvelle conversation
        const conv = await prisma_1.default.conversation.create({
            data: {
                type: 'PRIVE',
                participants: { create: [{ userId: myId }, { userId }] }
            },
            include: { participants: { include: { user: { select: { id: true, nom: true, photoUrl: true, role: true } } } } }
        });
        return (0, response_1.repondreSucces)(res, conv, 'Conversation créée.', 201);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /chat/conversations/:id/messages — Messages d une conversation
router.get('/conversations/:id/messages', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const messages = await prisma_1.default.message.findMany({
            where: { conversationId: parseInt(req.params.id) },
            include: { sender: { select: { id: true, nom: true, photoUrl: true } } },
            orderBy: { createdAt: 'asc' },
            take: 50
        });
        // Marquer comme lus
        await prisma_1.default.message.updateMany({
            where: { conversationId: parseInt(req.params.id), senderId: { not: req.user.id }, lu: false },
            data: { lu: true }
        });
        return (0, response_1.repondreSucces)(res, messages);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /chat/conversations/:id/messages — Envoyer un message
router.post('/conversations/:id/messages', auth_middleware_1.authentifier, upload_middleware_1.upload.single('image'), async (req, res) => {
    try {
        let imageUrl;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = await cloudinary_1.default.uploader.upload(dataURI, { folder: 'fruitimport/chat' });
            imageUrl = result.secure_url;
        }
        const message = await prisma_1.default.message.create({
            data: {
                conversationId: parseInt(req.params.id),
                senderId: req.user.id,
                contenu: req.body.contenu || '',
                type: imageUrl ? 'IMAGE' : 'TEXTE',
                imageUrl
            },
            include: { sender: { select: { id: true, nom: true, photoUrl: true } } }
        });
        return (0, response_1.repondreSucces)(res, message, 'Message envoyé.', 201);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /chat/non-lus — Nombre de messages non lus
router.get('/non-lus', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const count = await prisma_1.default.message.count({
            where: {
                lu: false
            }
        });
        return (0, response_1.repondreSucces)(res, { count });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=chat.routes.js.map