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
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// GET /parametres — Recuperer tous les parametres
// Route publique - pas besoin de token
router.get('/', async (req, res) => {
    try {
        const params = await prisma_1.default.parametreSysteme.findMany();
        const result = {};
        params.forEach(p => result[p.cle] = p.valeur);
        return (0, response_1.repondreSucces)(res, result);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /parametres/logo — Upload logo entreprise (PDG uniquement)
router.post('/logo', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), upload_middleware_1.upload.single('logo'), async (req, res) => {
    try {
        if (!req.file)
            return (0, response_1.repondreErreur)(res, 'Aucun fichier recu.', 400);
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: 'fruitimport/logo',
            public_id: 'logo_entreprise',
            overwrite: true,
        });
        await prisma_1.default.parametreSysteme.upsert({
            where: { cle: 'logo_url' },
            update: { valeur: result.secure_url },
            create: { cle: 'logo_url', valeur: result.secure_url }
        });
        return (0, response_1.repondreSucces)(res, { logoUrl: result.secure_url }, 'Logo mis a jour.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /parametres/rapport — Telecharger le dernier rapport
router.get('/rapport', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), async (req, res) => {
    try {
        const param = await prisma_1.default.parametreSysteme.findUnique({ where: { cle: 'dernier_rapport_url' } });
        const date = await prisma_1.default.parametreSysteme.findUnique({ where: { cle: 'dernier_rapport_date' } });
        return (0, response_1.repondreSucces)(res, { url: param.valeur, date: date?.valeur });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /parametres/rapport/generer — Generer et telecharger le rapport
router.post('/rapport/generer', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), async (req, res) => {
    try {
        const { genererRapportJournalierBuffer } = await Promise.resolve().then(() => __importStar(require('../services/rapport.service')));
        const { buffer, dateStr } = await genererRapportJournalierBuffer();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader("Content-Disposition", "attachment; filename=rapport.pdf");
        res.send(buffer);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=parametres.routes.js.map