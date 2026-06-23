"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passerCommande = passerCommande;
exports.obtenirCommandes = obtenirCommandes;
exports.obtenirCommande = obtenirCommande;
exports.mettreAJourStatutCommande = mettreAJourStatutCommande;
const commande_repository_1 = require("../repositories/commande.repository");
async function passerCommande(data) {
    return (0, commande_repository_1.creerCommande)(data);
}
async function obtenirCommandes(params) {
    return (0, commande_repository_1.listerCommandes)(params);
}
async function obtenirCommande(id) {
    const commande = await (0, commande_repository_1.trouverCommandeParId)(id);
    if (!commande)
        throw new Error('Commande introuvable.');
    return commande;
}
async function mettreAJourStatutCommande(id, statut) {
    const commande = await (0, commande_repository_1.trouverCommandeParId)(id);
    if (!commande)
        throw new Error('Commande introuvable.');
    const transitionsValides = {
        EN_ATTENTE: ['CONFIRMEE', 'ANNULEE'],
        CONFIRMEE: ['PREPAREE', 'ANNULEE'],
        PREPAREE: ['EN_LIVRAISON', 'ANNULEE'],
        EN_LIVRAISON: ['LIVREE'],
        LIVREE: [],
        ANNULEE: [],
    };
    if (!transitionsValides[commande.statut]?.includes(statut)) {
        throw new Error(`Transition invalide : ${commande.statut} -> ${statut}.`);
    }
    return (0, commande_repository_1.changerStatutCommande)(id, statut);
}
//# sourceMappingURL=commande.service.js.map