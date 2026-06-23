"use strict";
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
exports.default = router;
//# sourceMappingURL=client.routes.js.map