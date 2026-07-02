"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const response_1 = require("../utils/response");
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
exports.default = router;
//# sourceMappingURL=fruit.routes.js.map