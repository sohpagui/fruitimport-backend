"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transfert_controller_1 = require("../controllers/transfert.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.MAGASINIER), transfert_controller_1.creerTransfert);
router.get('/', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.MAGASINIER, client_1.Role.SECRETAIRE), transfert_controller_1.listerTransferts);
router.patch('/:id/approuver', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), transfert_controller_1.approuverTransfert);
router.patch('/:id/rejeter', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), transfert_controller_1.rejeterTransfert);
exports.default = router;
//# sourceMappingURL=transfert.routes.js.map