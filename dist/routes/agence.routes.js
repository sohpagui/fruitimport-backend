"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /agences — Liste des agences
router.get('/', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const agences = await prisma.agence.findMany();
        return (0, response_1.repondreSucces)(res, agences);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /agences/:id — Détail d'une agence
router.get('/:id', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const agence = await prisma.agence.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!agence)
            return (0, response_1.repondreErreur)(res, 'Agence introuvable.', 404);
        return (0, response_1.repondreSucces)(res, agence);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=agence.routes.js.map