"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listerStocks = listerStocks;
exports.alertesStock = alertesStock;
exports.receptionMarchandise = receptionMarchandise;
exports.perteStock = perteStock;
exports.catalogue = catalogue;
const zod_1 = require("zod");
const stock_service_1 = require("../services/stock.service");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
async function listerStocks(req, res) {
    try {
        const pagination = (0, pagination_1.getPagination)(req);
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const fruitId = req.query.fruit_id ? parseInt(req.query.fruit_id) : undefined;
        const { stocks, total } = await (0, stock_service_1.obtenirStocks)({ ...pagination, agenceId, fruitId });
        return (0, response_1.repondreSucces)(res, { stocks, pagination: (0, pagination_1.formatPagination)(total, pagination) });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
async function alertesStock(req, res) {
    try {
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const alertes = await (0, stock_service_1.obtenirAlertes)(agenceId);
        return (0, response_1.repondreSucces)(res, alertes);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
async function receptionMarchandise(req, res) {
    try {
        const schema = zod_1.z.object({
            agenceId: zod_1.z.number().int().positive(),
            fruitId: zod_1.z.number().int().positive(),
            calibreId: zod_1.z.number().int().positive(),
            origine: zod_1.z.enum(['MAROC', 'AFRIQUE_DU_SUD', 'ITALIE', 'AUTRE']),
            cartonsNormal: zod_1.z.number().int().min(0),
            cartonsSolde: zod_1.z.number().int().min(0).default(0),
            prixNormal: zod_1.z.number().positive(),
            prixSolde: zod_1.z.number().positive().optional(),
        });
        const data = schema.parse(req.body);
        const reception = await (0, stock_service_1.recevoirMarchandise)({ ...data, recuParId: req.user.id });
        return (0, response_1.repondreSucces)(res, reception, 'Marchandise receptionnee.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function perteStock(req, res) {
    try {
        const schema = zod_1.z.object({
            agenceId: zod_1.z.number().int().positive(),
            fruitId: zod_1.z.number().int().positive(),
            calibreId: zod_1.z.number().int().positive(),
            origine: zod_1.z.enum(['MAROC', 'AFRIQUE_DU_SUD', 'ITALIE', 'AUTRE']),
            categorie: zod_1.z.enum(['NORMAL', 'SOLDE']),
            quantite: zod_1.z.number().int().positive(),
            raison: zod_1.z.enum(['JAUNISSEMENT', 'POURRISSEMENT', 'CHOC', 'AUTRE']),
        });
        const data = schema.parse(req.body);
        const perte = await (0, stock_service_1.declarerUnePerte)({ ...data, declarePar: req.user.id });
        return (0, response_1.repondreSucces)(res, perte, 'Perte declaree.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function catalogue(req, res) {
    try {
        const agenceId = parseInt(req.query.agence_id);
        if (!agenceId)
            return (0, response_1.repondreErreur)(res, 'agence_id requis.', 400);
        const items = await (0, stock_service_1.obtenirCatalogueAgence)(agenceId);
        return (0, response_1.repondreSucces)(res, items);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
//# sourceMappingURL=stock.controller.js.map