"use strict";
// ============================================================
// FICHIER : src/controllers/dashboard.controller.ts
// Rôle : Endpoints du dashboard.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardPDG = dashboardPDG;
exports.dashboardAgence = dashboardAgence;
const dashboard_service_1 = require("../services/dashboard.service");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
// GET /dashboard/pdg — Dashboard global (PDG uniquement)
async function dashboardPDG(req, res) {
    try {
        const data = await (0, dashboard_service_1.obtenirDashboardPDG)();
        return (0, response_1.repondreSucces)(res, data);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
// GET /dashboard/agence/:id — Dashboard d'une agence
async function dashboardAgence(req, res) {
    try {
        const agenceId = parseInt(req.params.id);
        // Un employé ne peut voir que son agence, sauf le PDG
        if (req.user.role !== client_1.Role.PDG && req.user.agenceId !== agenceId) {
            return (0, response_1.repondreErreur)(res, 'Acces refuse a cette agence.', 403);
        }
        const data = await (0, dashboard_service_1.obtenirDashboardAgence)(agenceId);
        return (0, response_1.repondreSucces)(res, data);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
//# sourceMappingURL=dashboard.controller.js.map