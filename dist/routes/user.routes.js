"use strict";
// ============================================================
// FICHIER : src/routes/user.routes.ts
// Rôle : URLs pour la gestion des employés.
//        Toutes ces routes nécessitent le rôle PDG.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Toutes les routes admin nécessitent d'être connecté ET d'être PDG
router.use(auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG));
router.post('/', user_controller_1.creerUser); // POST   /admin/users
router.get('/', user_controller_1.listerUsers); // GET    /admin/users
router.get('/:id', user_controller_1.obtenirUser); // GET    /admin/users/:id
router.patch('/:id', user_controller_1.modifierUser); // PATCH  /admin/users/:id
exports.default = router;
//# sourceMappingURL=user.routes.js.map