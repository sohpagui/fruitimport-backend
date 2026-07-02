"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerCommande = creerCommande;
exports.listerCommandes = listerCommandes;
exports.detailCommande = detailCommande;
exports.changerStatut = changerStatut;
const zod_1 = require("zod");
const commande_service_1 = require("../services/commande.service");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
async function creerCommande(req, res) {
    try {
        const schema = zod_1.z.object({
            agenceId: zod_1.z.number().int().positive(),
            clientId: zod_1.z.number().int().positive(),
            modePaiement: zod_1.z.enum(['ESPECES', 'CREDIT']),
            adresseLivraison: zod_1.z.string().max(255).optional(),
            note: zod_1.z.string().optional(),
            lignes: zod_1.z.array(zod_1.z.object({
                fruitId: zod_1.z.number().int().positive(),
                calibreId: zod_1.z.number().int().positive(),
                categorie: zod_1.z.enum(['NORMAL', 'SOLDE']),
                quantite: zod_1.z.number().int().positive(),
                prixUnitaire: zod_1.z.number().positive(),
            })).min(1),
        });
        const data = schema.parse(req.body);
        const commande = await (0, commande_service_1.passerCommande)({ ...data, creeParId: req.user.isClient ? undefined : req.user.id });
        return (0, response_1.repondreSucces)(res, commande, 'Commande creee.', 201);
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Donnees invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
async function listerCommandes(req, res) {
    try {
        const pagination = (0, pagination_1.getPagination)(req);
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const statut = req.query.statut;
        // Si c est un client, il ne voit que ses propres commandes
        let clientId = req.query.client_id ? parseInt(req.query.client_id) : undefined;
        if (req.user.isClient)
            clientId = req.user.id;
        const { commandes, total } = await (0, commande_service_1.obtenirCommandes)({ ...pagination, agenceId, clientId, statut });
        return (0, response_1.repondreSucces)(res, { commandes, pagination: (0, pagination_1.formatPagination)(total, pagination) });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
async function detailCommande(req, res) {
    try {
        const commande = await (0, commande_service_1.obtenirCommande)(parseInt(req.params.id));
        return (0, response_1.repondreSucces)(res, commande);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 404);
    }
}
async function changerStatut(req, res) {
    try {
        const { statut } = zod_1.z.object({ statut: zod_1.z.enum(['EN_ATTENTE', 'CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE', 'ANNULEE']) }).parse(req.body);
        const commande = await (0, commande_service_1.mettreAJourStatutCommande)(parseInt(req.params.id), statut);
        return (0, response_1.repondreSucces)(res, commande, 'Statut mis a jour.');
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Statut invalide.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 400);
    }
}
//# sourceMappingURL=commande.controller.js.map