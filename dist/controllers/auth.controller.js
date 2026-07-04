"use strict";
// ============================================================
// FICHIER : src/controllers/auth.controller.ts
// Rôle : Reçoit les requêtes HTTP, appelle le service,
//        et retourne la réponse JSON.
//        Le controller ne contient PAS de logique métier —
//        il délègue tout au service.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.registerClient = registerClient;
exports.me = me;
exports.changerPassword = changerPassword;
exports.historiqueConnexions = historiqueConnexions;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
const auth_repository_1 = require("../repositories/auth.repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
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
// PATCH /auth/changer-mot-de-passe
async function changerPassword(req, res) {
    try {
        const { ancienMotDePasse, nouveauMotDePasse } = zod_1.z.object({
            ancienMotDePasse: zod_1.z.string().min(6),
            nouveauMotDePasse: zod_1.z.string().min(6),
        }).parse(req.body);
        const user = await prisma_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return (0, response_1.repondreErreur)(res, 'Utilisateur introuvable.', 404);
        const valide = await bcryptjs_1.default.compare(ancienMotDePasse, user.motDePasseHash);
        if (!valide)
            return (0, response_1.repondreErreur)(res, 'Ancien mot de passe incorrect.', 400);
        const hash = await bcryptjs_1.default.hash(nouveauMotDePasse, 12);
        await (0, auth_repository_1.changerMotDePasse)(req.user.id, hash);
        return (0, response_1.repondreSucces)(res, null, 'Mot de passe changé avec succès.');
    }
    catch (e) {
        if (e.name === 'ZodError')
            return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, e.errors);
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
// GET /auth/historique-connexions
async function historiqueConnexions(req, res) {
    try {
        const historique = await (0, auth_repository_1.obtenirHistoriqueConnexions)(req.user.id);
        return (0, response_1.repondreSucces)(res, historique);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
}
//# sourceMappingURL=auth.controller.js.map