"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// POST /retours — Enregistrer un retour
router.post('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.SECRETAIRE, client_1.Role.PDG), async (req, res) => {
    try {
        const data = zod_1.z.object({
            livraisonId: zod_1.z.number().int().positive(),
            fruitId: zod_1.z.number().int().positive(),
            calibreId: zod_1.z.number().int().positive(),
            quantite: zod_1.z.number().int().positive(),
            raison: zod_1.z.string().min(3),
        }).parse(req.body);
        // Créer le retour
        const retour = await prisma_1.default.retourMarchandise.create({
            data: { ...data, enregistrePar: req.user.id },
            include: {
                fruit: { select: { id: true, nom: true } },
                livraison: { select: { id: true, commandeId: true } }
            }
        });
        // Réincrémenter le stock
        await prisma_1.default.stock.updateMany({
            where: { fruitId: data.fruitId, calibreId: data.calibreId },
            data: { quantiteCartons: { increment: data.quantite } }
        });
        return (0, response_1.repondreSucces)(res, retour, 'Retour enregistré et stock mis à jour.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /retours — Lister les retours
router.get('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const retours = await prisma_1.default.retourMarchandise.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                fruit: { select: { id: true, nom: true } },
                livraison: { select: { id: true, commandeId: true } },
                employe: { select: { id: true, nom: true } }
            }
        });
        return (0, response_1.repondreSucces)(res, retours);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=retour.routes.js.map