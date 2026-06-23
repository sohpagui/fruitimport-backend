"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commande_controller_1 = require("../controllers/commande.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Créer une commande (secrétaire ou client)
router.post('/', auth_middleware_1.authentifier, commande_controller_1.creerCommande);
// Lister (PDG, secrétaire, magasinier)
router.get('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE, client_1.Role.MAGASINIER), commande_controller_1.listerCommandes);
router.get('/:id', auth_middleware_1.authentifier, commande_controller_1.detailCommande);
// Changer le statut (secrétaire, magasinier)
router.patch('/:id/statut', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE, client_1.Role.MAGASINIER), commande_controller_1.changerStatut);
exports.default = router;
//# sourceMappingURL=commande.routes.js.map