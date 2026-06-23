"use strict";
// ============================================================
// FICHIER : src/routes/auth.routes.ts
// Rôle : Définit les URLs de l'authentification.
//        Chaque ligne connecte une URL à un controller.
// ============================================================
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
exports.default = router;
//# sourceMappingURL=auth.routes.js.map