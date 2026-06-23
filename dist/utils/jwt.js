"use strict";
// ============================================================
// FICHIER : src/utils/jwt.ts
// Rôle : Gère la création et vérification des tokens JWT.
//
// C'est quoi JWT ?
// JWT = JSON Web Token. C'est une chaîne de caractères
// signée qui prouve qu'un utilisateur est connecté.
// Ex: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.abc123"
//
// On utilise DEUX tokens :
// - Access token  : valide 15 minutes (pour les requêtes)
// - Refresh token : valide 7 jours (pour renouveler l'access token)
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genererAccessToken = genererAccessToken;
exports.genererRefreshToken = genererRefreshToken;
exports.verifierAccessToken = verifierAccessToken;
exports.verifierRefreshToken = verifierRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Récupère les secrets depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
// Génère un access token (courte durée)
function genererAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
// Génère un refresh token (longue durée)
function genererRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
}
// Vérifie et décode un access token
function verifierAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
// Vérifie et décode un refresh token
function verifierRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
}
//# sourceMappingURL=jwt.js.map