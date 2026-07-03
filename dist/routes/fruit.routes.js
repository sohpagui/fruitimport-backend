"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// GET /fruits — Liste tous les fruits avec leurs calibres
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
// POST /fruits/:id/image — Upload image d'un fruit (PDG ou Secrétaire)
router.post('/:id/image', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), upload_middleware_1.upload.single('image'), async (req, res) => {
    try {
        if (!req.file)
            return (0, response_1.repondreErreur)(res, 'Aucun fichier reçu.', 400);
        const baseUrl = process.env.BASE_URL || `https://fruitimport-backend.onrender.com`;
        const imageUrl = `${baseUrl}/uploads/fruits/${req.file.filename}`;
        const fruit = await prisma_1.default.fruit.update({
            where: { id: parseInt(req.params.id) },
            data: { imageUrl },
        });
        return (0, response_1.repondreSucces)(res, fruit, 'Image mise à jour.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=fruit.routes.js.map