"use strict";
// ============================================================
// FICHIER : src/controllers/auth.controller.ts
// Rôle : Reçoit les requêtes HTTP, appelle le service,
//        et retourne la réponse JSON.
//        Le controller ne contient PAS de logique métier —
//        il délègue tout au service.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.registerClient = registerClient;
exports.me = me;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
// Schémas de validation Zod
const schemaConnexion = zod_1.z.object({
    identifiant: zod_1.z.string().min(1, 'Identifiant requis'),
    motDePasse: zod_1.z.string().min(1, 'Mot de passe requis'),
});
const schemaInscriptionClient = zod_1.z.object({
    nom: zod_1.z.string().min(2, 'Nom trop court').max(150),
    type: zod_1.z.enum(['PARTICULIER', 'SUPERMARCHE']),
    agenceId: zod_1.z.number().int().positive(),
    telephone: zod_1.z.string().min(8).max(20),
    email: zod_1.z.string().email().optional(),
    adresse: zod_1.z.string().max(255).optional(),
    motDePasse: zod_1.z.string().min(6, 'Mot de passe : 6 caractères minimum'),
});
// POST /auth/login
async function login(req, res) {
    try {
        const { identifiant, motDePasse } = schemaConnexion.parse(req.body);
        const resultat = await (0, auth_service_1.connexion)(identifiant, motDePasse);
        return (0, response_1.repondreSucces)(res, resultat, 'Connexion réussie.');
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, error.errors);
        }
        return (0, response_1.repondreErreur)(res, error.message, 401);
    }
}
// POST /auth/refresh-token
async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return (0, response_1.repondreErreur)(res, 'Refresh token manquant.', 400);
        }
        const resultat = await (0, auth_service_1.rafraichirToken)(refreshToken);
        return (0, response_1.repondreSucces)(res, resultat);
    }
    catch (error) {
        return (0, response_1.repondreErreur)(res, error.message, 401);
    }
}
// POST /auth/logout
async function logout(req, res) {
    // Côté serveur, on ne peut pas invalider un JWT (stateless).
    // Le client doit supprimer le token de son stockage local.
    // En production, on utiliserait une blacklist Redis.
    return (0, response_1.repondreSucces)(res, null, 'Déconnexion réussie. Supprimez le token côté client.');
}
// POST /auth/register-client
async function registerClient(req, res) {
    try {
        const data = schemaInscriptionClient.parse(req.body);
        const client = await (0, auth_service_1.inscrireClient)(data);
        return (0, response_1.repondreSucces)(res, client, 'Compte client créé avec succès.', 201);
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, error.errors);
        }
        return (0, response_1.repondreErreur)(res, error.message, 400);
    }
}
// GET /auth/me — Infos de l'utilisateur connecté
async function me(req, res) {
    return (0, response_1.repondreSucces)(res, req.user);
}
//# sourceMappingURL=auth.controller.js.map