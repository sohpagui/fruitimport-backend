"use strict";
// ============================================================
// FICHIER : src/routes/auth.routes.ts
// Rôle : Définit les URLs de l'authentification.
//        Chaque ligne connecte une URL à un controller.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Routes publiques (pas besoin d'être connecté)
router.post('/login', auth_controller_1.login);
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/register-client', auth_controller_1.registerClient);
// Routes protégées (token requis)
router.post('/logout', auth_middleware_1.authentifier, auth_controller_1.logout);
router.get('/me', auth_middleware_1.authentifier, auth_controller_1.me);
router.patch('/changer-mot-de-passe', auth_middleware_1.authentifier, auth_controller_1.changerPassword);
router.get('/historique-connexions', auth_middleware_1.authentifier, auth_controller_1.historiqueConnexions);
exports.default = router;
const upload_middleware_1 = require("../middlewares/upload.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const response_1 = require("../utils/response");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
router.post('/photo-profil', auth_middleware_1.authentifier, upload_middleware_1.upload.single('photo'), async (req, res) => {
    try {
        if (!req.file)
            return (0, response_1.repondreErreur)(res, 'Aucun fichier reçu.', 400);
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: 'fruitimport/profils',
            public_id: `user_${req.user.id}`,
            overwrite: true,
            transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
        });
        await prisma_1.default.user.update({ where: { id: req.user.id }, data: { photoUrl: result.secure_url } });
        return (0, response_1.repondreSucces)(res, { photoUrl: result.secure_url }, 'Photo mise à jour.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
//# sourceMappingURL=auth.routes.js.map