"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenirStocks = obtenirStocks;
exports.obtenirAlertes = obtenirAlertes;
exports.recevoirMarchandise = recevoirMarchandise;
exports.declarerUnePerte = declarerUnePerte;
exports.obtenirCatalogueAgence = obtenirCatalogueAgence;
const stock_repository_1 = require("../repositories/stock.repository");
async function obtenirStocks(params) {
    return (0, stock_repository_1.listerStocks)(params);
}
async function obtenirAlertes(agenceId) {
    return (0, stock_repository_1.obtenirAlertesStock)(agenceId);
}
async function recevoirMarchandise(data) {
    return (0, stock_repository_1.receptionnerMarchandise)(data);
}
async function declarerUnePerte(data) {
    return (0, stock_repository_1.declarerPerte)(data);
}
async function obtenirCatalogueAgence(agenceId) {
    return (0, stock_repository_1.obtenirCatalogue)(agenceId);
}
//# sourceMappingURL=stock.service.js.map