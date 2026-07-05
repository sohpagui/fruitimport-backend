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
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// GET /parametres — Recuperer tous les parametres
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
exports.default = router;
//# sourceMappingURL=parametres.routes.js.map