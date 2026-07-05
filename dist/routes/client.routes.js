"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), client_controller_1.listerClients);
router.get('/:id', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), client_controller_1.detailClient);
router.patch('/:id/credit-limite', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), client_controller_1.modifierLimiteCredit);
router.post('/:id/paiements', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), client_controller_1.ajouterPaiement);
router.patch('/:id/echeance', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), client_controller_1.fixerEcheance);
router.post('/:id/versements', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), client_controller_1.ajouterVersement);
router.get('/:id/versements', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), client_controller_1.historiqueVersements);
router.post('/jobs/interets', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), client_controller_1.lancerJobInterets);
// POST /clients — Creer un nouveau client (Secretaire ou PDG)
router.post('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    const { z } = await Promise.resolve().then(() => __importStar(require('zod')));
    const { repondreSucces, repondreErreur } = await Promise.resolve().then(() => __importStar(require('../utils/response')));
    const prisma = (await Promise.resolve().then(() => __importStar(require('../lib/prisma')))).default;
    try {
        const data = z.object({
            nom: z.string().min(2),
            telephone: z.string().min(8),
            type: z.enum(['PARTICULIER', 'SUPERMARCHE']),
            agenceId: z.number().int().positive(),
            email: z.string().email().optional(),
            adresse: z.string().optional(),
            limiteCredit: z.number().default(0),
        }).parse(req.body);
        const client = await prisma.client.create({
            data: { ...data, motDePasseHash: await (await Promise.resolve().then(() => __importStar(require('bcryptjs')))).default.hash('Client2024!', 10) },
            include: { agence: true }
        });
        return repondreSucces(res, client, 'Client cree.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (await Promise.resolve().then(() => __importStar(require('../utils/response')))).repondreErreur(res, 'Donnees invalides.', 400, e.errors);
        return (await Promise.resolve().then(() => __importStar(require('../utils/response')))).repondreErreur(res, e.message, 500);
    }
});
// PATCH /clients/:id — Modifier un client
router.patch('/:id', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    const { z } = await Promise.resolve().then(() => __importStar(require('zod')));
    const prisma = (await Promise.resolve().then(() => __importStar(require('../lib/prisma')))).default;
    const { repondreSucces, repondreErreur } = await Promise.resolve().then(() => __importStar(require('../utils/response')));
    try {
        const data = z.object({
            nom: z.string().min(2).optional(),
            telephone: z.string().min(8).optional(),
            email: z.string().email().optional(),
            adresse: z.string().optional(),
        }).parse(req.body);
        const client = await prisma.client.update({
            where: { id: parseInt(req.params.id) },
            data,
            include: { agence: true }
        });
        return repondreSucces(res, client, 'Client modifie.');
    }
    catch (e) {
        return repondreErreur(res, e.message, 500);
    }
});
// POST /clients — Creer un nouveau client (Secretaire ou PDG)
router.post('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    const { z } = await Promise.resolve().then(() => __importStar(require('zod')));
    const { repondreSucces, repondreErreur } = await Promise.resolve().then(() => __importStar(require('../utils/response')));
    const prisma = (await Promise.resolve().then(() => __importStar(require('../lib/prisma')))).default;
    try {
        const data = z.object({
            nom: z.string().min(2),
            telephone: z.string().min(8),
            type: z.enum(['PARTICULIER', 'SUPERMARCHE']),
            agenceId: z.number().int().positive(),
            email: z.string().email().optional(),
            adresse: z.string().optional(),
            limiteCredit: z.number().default(0),
        }).parse(req.body);
        const client = await prisma.client.create({
            data: { ...data, motDePasseHash: await (await Promise.resolve().then(() => __importStar(require('bcryptjs')))).default.hash('Client2024!', 10) },
            include: { agence: true }
        });
        return repondreSucces(res, client, 'Client cree.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (await Promise.resolve().then(() => __importStar(require('../utils/response')))).repondreErreur(res, 'Donnees invalides.', 400, e.errors);
        return (await Promise.resolve().then(() => __importStar(require('../utils/response')))).repondreErreur(res, e.message, 500);
    }
});
// PATCH /clients/:id — Modifier un client
router.patch('/:id', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    const { z } = await Promise.resolve().then(() => __importStar(require('zod')));
    const prisma = (await Promise.resolve().then(() => __importStar(require('../lib/prisma')))).default;
    const { repondreSucces, repondreErreur } = await Promise.resolve().then(() => __importStar(require('../utils/response')));
    try {
        const data = z.object({
            nom: z.string().min(2).optional(),
            telephone: z.string().min(8).optional(),
            email: z.string().email().optional(),
            adresse: z.string().optional(),
        }).parse(req.body);
        const client = await prisma.client.update({
            where: { id: parseInt(req.params.id) },
            data,
            include: { agence: true }
        });
        return repondreSucces(res, client, 'Client modifie.');
    }
    catch (e) {
        return repondreErreur(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=client.routes.js.map