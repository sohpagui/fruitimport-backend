"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// GET /fruits — Liste tous les fruits
router.get('/', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const fruits = await prisma_1.default.fruit.findMany({
            include: { calibres: { orderBy: { ordreAffichage: 'asc' } } },
            orderBy: { nom: 'asc' },
        });
        return (0, response_1.repondreSucces)(res, fruits);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /fruits — Creer un nouveau fruit
router.post('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const data = zod_1.z.object({
            nom: zod_1.z.string().min(2),
            uniteMesure: zod_1.z.enum(['carton', 'kg'])
        }).parse(req.body);
        const fruit = await prisma_1.default.fruit.create({ data: data, include: { calibres: true } });
        return (0, response_1.repondreSucces)(res, fruit, 'Fruit cree avec succes.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// PATCH /fruits/:id — Modifier un fruit
router.patch('/:id', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const data = zod_1.z.object({
            nom: zod_1.z.string().min(2).optional(),
            uniteMesure: zod_1.z.enum(['carton', 'kg']).optional()
        }).parse(req.body);
        const fruit = await prisma_1.default.fruit.update({
            where: { id: parseInt(req.params.id) },
            data,
            include: { calibres: true }
        });
        return (0, response_1.repondreSucces)(res, fruit, 'Fruit modifie.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /fruits/:id/calibres — Ajouter un calibre
router.post('/:id/calibres', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const data = zod_1.z.object({
            valeur: zod_1.z.string().min(1),
            prixAchat: zod_1.z.number().positive(),
            prixVente: zod_1.z.number().positive(),
            ordreAffichage: zod_1.z.number().int().default(0)
        }).parse(req.body);
        const calibre = await prisma_1.default.calibre.create({
            data: { ...data, fruitId: parseInt(req.params.id) }
        });
        return (0, response_1.repondreSucces)(res, calibre, 'Calibre ajoute.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// PATCH /fruits/calibres/:calibreId — Modifier un calibre
router.patch('/calibres/:calibreId', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const data = zod_1.z.object({
            valeur: zod_1.z.string().min(1).optional(),
            prixAchat: zod_1.z.number().positive().optional(),
            prixVente: zod_1.z.number().positive().optional(),
        }).parse(req.body);
        const calibre = await prisma_1.default.calibre.update({
            where: { id: parseInt(req.params.calibreId) },
            data
        });
        return (0, response_1.repondreSucces)(res, calibre, 'Calibre modifie.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /fruits/:id/image — Upload image
router.post('/:id/image', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), upload_middleware_1.upload.single('image'), async (req, res) => {
    try {
        if (!req.file)
            return (0, response_1.repondreErreur)(res, 'Aucun fichier recu.', 400);
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: 'fruitimport/fruits',
            public_id: `fruit_${req.params.id}`,
            overwrite: true,
        });
        const fruit = await prisma_1.default.fruit.update({
            where: { id: parseInt(req.params.id) },
            data: { imageUrl: result.secure_url },
        });
        return (0, response_1.repondreSucces)(res, fruit, 'Image mise a jour.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=fruit.routes.js.map