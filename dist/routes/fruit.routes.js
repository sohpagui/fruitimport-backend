"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET /fruits — Liste tous les fruits avec leurs calibres
router.get('/', auth_middleware_1.authentifier, async (req, res) => {
    try {
        const fruits = await prisma.fruit.findMany({
            include: { calibres: { orderBy: { ordreAffichage: 'asc' } } },
            orderBy: { nom: 'asc' },
        });
        return (0, response_1.repondreSucces)(res, fruits);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=fruit.routes.js.map