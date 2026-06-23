"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignerLivraison = assignerLivraison;
exports.obtenirLivraisons = obtenirLivraisons;
exports.mettreAJourLivraison = mettreAJourLivraison;
const livraison_repository_1 = require("../repositories/livraison.repository");
async function assignerLivraison(data) {
    return (0, livraison_repository_1.creerLivraison)(data);
}
async function obtenirLivraisons(params) {
    return (0, livraison_repository_1.listerLivraisons)(params);
}
async function mettreAJourLivraison(id, statut, noteProbleme) {
    return (0, livraison_repository_1.mettreAJourStatutLivraison)(id, statut, noteProbleme);
}
//# sourceMappingURL=livraison.service.js.map