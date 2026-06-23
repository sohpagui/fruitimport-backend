"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerLivraison = creerLivraison;
exports.listerLivraisons = listerLivraisons;
exports.mettreAJourStatut = mettreAJourStatut;
const zod_1 = require("zod");
const livraison_service_1 = require("../services/livraison.service");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
async function creerLivraison(req, res) {
    try {
        const { commandeId, livreurId } = zod_1.z.object({ commandeId: zod_1.z.number().int().positive(), livreurId: zod_1.z.number().int().positive() }).parse(req.body);
        const livraison = await (0, livraison_service_1.assignerLivraison)({ commandeId, livreurId });
        return (0, response_1.repondreSucces)(res, livraison, 'Livraison assignee.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function listerLivraisons(req, res) {
    try {
        const pagination = (0, pagination_1.getPagination)(req);
        const livreurId = req.query.livreur_id ? parseInt(req.query.livreur_id) : undefined;
        const statut = req.query.statut;
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const { livraisons, total } = await (0, livraison_service_1.obtenirLivraisons)({ ...pagination, livreurId, statut, agenceId });
        return (0, response_1.repondreSucces)(res, { livraisons, pagination: (0, pagination_1.formatPagination)(total, pagination) });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
async function mettreAJourStatut(req, res) {
    try {
        const { statut, noteProbleme } = zod_1.z.object({
            statut: zod_1.z.enum(['PREPARE', 'EN_ROUTE', 'LIVRE', 'PROBLEME']),
            noteProbleme: zod_1.z.string().optional(),
        }).parse(req.body);
        const livraison = await (0, livraison_service_1.mettreAJourLivraison)(parseInt(req.params.id), statut, noteProbleme);
        return (0, response_1.repondreSucces)(res, livraison, 'Statut mis a jour.');
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
//# sourceMappingURL=livraison.controller.js.map