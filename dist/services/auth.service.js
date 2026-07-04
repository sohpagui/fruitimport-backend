"use strict";
// ============================================================
// FICHIER : src/services/auth.service.ts
// Rôle : Contient la logique métier de l'authentification.
//        Le service orchestre les appels au repository
//        et applique les règles de l'entreprise.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connexion = connexion;
exports.rafraichirToken = rafraichirToken;
exports.inscrireClient = inscrireClient;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("../repositories/auth.repository");
const jwt_1 = require("../utils/jwt");
// ── Connexion (employé ou client)
async function connexion(identifiant, motDePasse) {
    // 1. Cherche d'abord dans les employés
    let utilisateur = await (0, auth_repository_1.trouverUserParIdentifiant)(identifiant);
    let isClient = false;
    // 2. Si pas trouvé comme employé, cherche dans les clients
    if (!utilisateur) {
        const client = await (0, auth_repository_1.trouverClientParIdentifiant)(identifiant);
        if (!client) {
            throw new Error('Identifiant ou mot de passe incorrect.');
        }
        // @ts-ignore
        utilisateur = client;
        isClient = true;
    }
    // 3. Vérifie si le compte est bloqué (seulement pour les employés)
    if (!isClient) {
        const bloque = await (0, auth_repository_1.estBloque)(utilisateur.id);
        if (bloque) {
            throw new Error('Compte bloqué temporairement. Réessayez dans 30 minutes.');
        }
    }
    // 4. Vérifie le mot de passe
    const mdpValide = await bcryptjs_1.default.compare(motDePasse, utilisateur.motDePasseHash);
    if (!mdpValide) {
        if (!isClient) {
            await (0, auth_repository_1.enregistrerConnexion)(utilisateur.id, false);
        }
        throw new Error('Identifiant ou mot de passe incorrect.');
    }
    // 5. Enregistrer connexion réussie
    if (!isClient) {
        await (0, auth_repository_1.enregistrerConnexion)(utilisateur.id, true);
    }
    // 6. Génère les tokens JWT
    const payload = {
        id: utilisateur.id,
        role: utilisateur.role,
        agenceId: utilisateur.agenceId ?? null,
        isClient,
    };
    const accessToken = (0, jwt_1.genererAccessToken)(payload);
    const refreshToken = (0, jwt_1.genererRefreshToken)(payload);
    // 5. Retourne les tokens et les infos utilisateur (sans le mot de passe)
    const { motDePasseHash, ...userSansMotDePasse } = utilisateur;
    return {
        accessToken,
        refreshToken,
        utilisateur: {
            ...userSansMotDePasse,
            isClient,
        },
    };
}
// ── Renouvellement du token d'accès via le refresh token
async function rafraichirToken(refreshToken) {
    try {
        const payload = (0, jwt_1.verifierRefreshToken)(refreshToken);
        const nouveauPayload = {
            id: payload.id,
            role: payload.role,
            agenceId: payload.agenceId,
            isClient: payload.isClient,
        };
        const accessToken = (0, jwt_1.genererAccessToken)(nouveauPayload);
        return { accessToken };
    }
    catch {
        throw new Error('Refresh token invalide ou expiré.');
    }
}
// ── Inscription d'un nouveau client (auto-inscription)
async function inscrireClient(data) {
    // 1. Vérifie que le téléphone n'est pas déjà utilisé
    const telExiste = await (0, auth_repository_1.telephoneExiste)(data.telephone);
    if (telExiste) {
        throw new Error('Ce numéro de téléphone est déjà utilisé.');
    }
    // 2. Vérifie l'email si fourni
    if (data.email) {
        const mailExiste = await (0, auth_repository_1.emailExiste)(data.email);
        if (mailExiste) {
            throw new Error('Cette adresse email est déjà utilisée.');
        }
    }
    // 3. Hashe le mot de passe
    const motDePasseHash = await bcryptjs_1.default.hash(data.motDePasse, 12);
    // 4. Crée le client
    const { motDePasse, ...donneesSansMdp } = data;
    const client = await (0, auth_repository_1.creerClient)({
        ...donneesSansMdp,
        motDePasseHash,
    });
    return client;
}
//# sourceMappingURL=auth.service.js.map