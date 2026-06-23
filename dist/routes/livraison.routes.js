"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const livraison_controller_1 = require("../controllers/livraison.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.SECRETAIRE, client_1.Role.PDG), livraison_controller_1.creerLivraison);
router.get('/', auth_middleware_1.authentifier, livraison_controller_1.listerLivraisons);
router.patch('/:id/statut', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.LIVREUR, client_1.Role.SECRETAIRE, client_1.Role.PDG), livraison_controller_1.mettreAJourStatut);
exports.default = router;
//# sourceMappingURL=livraison.routes.js.map