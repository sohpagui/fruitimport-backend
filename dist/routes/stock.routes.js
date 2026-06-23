"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../controllers/stock.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Catalogue public (clients et employés)
router.get('/catalogue', auth_middleware_1.authentifier, stock_controller_1.catalogue);
// Stock — voir (PDG, secrétaire, magasinier)
router.get('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE, client_1.Role.MAGASINIER), stock_controller_1.listerStocks);
router.get('/alertes', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE, client_1.Role.MAGASINIER), stock_controller_1.alertesStock);
// Réception (magasinier uniquement)
router.post('/reception', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.MAGASINIER), stock_controller_1.receptionMarchandise);
// Pertes (magasinier uniquement)
router.post('/pertes', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.MAGASINIER), stock_controller_1.perteStock);
exports.default = router;
//# sourceMappingURL=stock.routes.js.map