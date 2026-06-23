"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listerClients = listerClients;
exports.detailClient = detailClient;
exports.modifierLimiteCredit = modifierLimiteCredit;
exports.ajouterPaiement = ajouterPaiement;
const zod_1 = require("zod");
const client_service_1 = require("../services/client.service");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
async function listerClients(req, res) {
    try {
        const pagination = (0, pagination_1.getPagination)(req);
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const statutCredit = req.query.statut_credit;
        const { clients, total } = await (0, client_service_1.obtenirClients)({ ...pagination, agenceId, statutCredit });
        return (0, response_1.repondreSucces)(res, { clients, pagination: (0, pagination_1.formatPagination)(total, pagination) });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
async function detailClient(req, res) {
    try {
        const client = await (0, client_service_1.obtenirClient)(parseInt(req.params.id));
        return (0, response_1.repondreSucces)(res, client);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 404);
    }
}
async function modifierLimiteCredit(req, res) {
    try {
        const { limiteCredit } = zod_1.z.object({ limiteCredit: zod_1.z.number().min(0) }).parse(req.body);
        const client = await (0, client_service_1.mettreAJourLimiteCredit)(parseInt(req.params.id), limiteCredit, req.user.id);
        return (0, response_1.repondreSucces)(res, client, 'Limite de credit mise a jour.');
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function ajouterPaiement(req, res) {
    try {
        const { montant, commandeId } = zod_1.z.object({ montant: zod_1.z.number().positive(), commandeId: zod_1.z.number().int().positive().optional() }).parse(req.body);
        const paiement = await (0, client_service_1.enregistrerPaiement)({ clientId: parseInt(req.params.id), montant, commandeId, enregistrePar: req.user.id });
        return (0, response_1.repondreSucces)(res, paiement, 'Paiement enregistre.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
//# sourceMappingURL=client.controller.js.map