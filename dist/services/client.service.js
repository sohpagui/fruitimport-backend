"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenirClients = obtenirClients;
exports.obtenirClient = obtenirClient;
exports.mettreAJourLimiteCredit = mettreAJourLimiteCredit;
exports.enregistrerPaiement = enregistrerPaiement;
const client_repository_1 = require("../repositories/client.repository");
async function obtenirClients(params) {
    return (0, client_repository_1.listerClients)(params);
}
async function obtenirClient(id) {
    const client = await (0, client_repository_1.trouverClientParId)(id);
    if (!client)
        throw new Error('Client introuvable.');
    return client;
}
async function mettreAJourLimiteCredit(clientId, limiteCredit, modifiePar) {
    if (limiteCredit < 0)
        throw new Error('La limite de credit ne peut pas etre negative.');
    return (0, client_repository_1.modifierLimiteCredit)(clientId, limiteCredit, modifiePar);
}
async function enregistrerPaiement(data) {
    if (data.montant <= 0)
        throw new Error('Le montant doit etre positif.');
    return (0, client_repository_1.enregistrerPaiementCredit)(data);
}
//# sourceMappingURL=client.service.js.map