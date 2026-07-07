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
router.post('/reception', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.MAGASINIER, client_1.Role.SECRETAIRE), stock_controller_1.receptionMarchandise);
// Pertes (magasinier uniquement)
router.post('/pertes', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.MAGASINIER, client_1.Role.SECRETAIRE), stock_controller_1.perteStock);
router.get('/pertes', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE, client_1.Role.MAGASINIER), async (req, res) => {
    const prisma = (await Promise.resolve().then(() => __importStar(require('../lib/prisma')))).default;
    const { repondreSucces, repondreErreur } = await Promise.resolve().then(() => __importStar(require('../utils/response')));
    try {
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const pertes = await prisma.perte.findMany({
            where: agenceId ? { agenceId } : {},
            include: { fruit: true, agence: true, calibre: true },
            orderBy: { date: 'desc' },
            take: 50
        });
        return repondreSucces(res, { pertes });
    }
    catch (e) {
        return repondreErreur(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=stock.routes.js.map