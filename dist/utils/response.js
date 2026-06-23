"use strict";
// ============================================================
// FICHIER : src/utils/response.ts
// Rôle : Fonctions utilitaires pour envoyer des réponses
//        HTTP standardisées depuis tous les controllers.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.repondreSucces = repondreSucces;
exports.repondreErreur = repondreErreur;
// Réponse de succès (200 ou 201)
function repondreSucces(res, data, message, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
// Réponse d'erreur
function repondreErreur(res, message, statusCode = 400, details) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: details,
    });
}
//# sourceMappingURL=response.js.map