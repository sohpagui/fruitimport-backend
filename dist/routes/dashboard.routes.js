"use strict";
// ============================================================
// FICHIER : src/routes/dashboard.routes.ts
// Rôle : Routes du dashboard.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Dashboard PDG (PDG uniquement)
router.get('/pdg', auth_middleware_1.authentifier, (0, auth_middleware_1.autoriser)(client_1.Role.PDG), dashboard_controller_1.dashboardPDG);
// Dashboard agence (PDG + employés de l'agence)
router.get('/agence/:id', auth_middleware_1.authentifier, dashboard_controller_1.dashboardAgence);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map