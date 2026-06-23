"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerTransfert = creerTransfert;
exports.listerTransferts = listerTransferts;
exports.approuverTransfert = approuverTransfert;
exports.rejeterTransfert = rejeterTransfert;
const zod_1 = require("zod");
const transfert_service_1 = require("../services/transfert.service");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
async function creerTransfert(req, res) {
    try {
        const data = zod_1.z.object({
            agenceDestinationId: zod_1.z.number().int().positive(),
            fruitId: zod_1.z.number().int().positive(),
            calibreId: zod_1.z.number().int().positive(),
            quantite: zod_1.z.number().int().positive(),
            note: zod_1.z.string().optional(),
        }).parse(req.body);
        const transfert = await (0, transfert_service_1.demanderTransfert)(data, { id: req.user.id, agenceId: req.user.agenceId, role: req.user.role });
        return (0, response_1.repondreSucces)(res, transfert, 'Transfert demande.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function listerTransferts(req, res) {
    try {
        const pagination = (0, pagination_1.getPagination)(req);
        const statut = req.query.statut;
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const { transferts, total } = await (0, transfert_service_1.obtenirTransferts)({ ...pagination, statut, agenceId });
        return (0, response_1.repondreSucces)(res, { transferts, pagination: (0, pagination_1.formatPagination)(total, pagination) });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
async function approuverTransfert(req, res) {
    try {
        const transfert = await (0, transfert_service_1.approuver)(parseInt(req.params.id), req.user.id);
        return (0, response_1.repondreSucces)(res, transfert, 'Transfert approuve.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function rejeterTransfert(req, res) {
    try {
        const transfert = await (0, transfert_service_1.rejeter)(parseInt(req.params.id), req.user.id);
        return (0, response_1.repondreSucces)(res, transfert, 'Transfert rejete.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
//# sourceMappingURL=transfert.controller.js.map