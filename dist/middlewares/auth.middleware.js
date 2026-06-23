"use strict";
// ============================================================
// FICHIER : src/middlewares/auth.middleware.ts
// Rôle : Middleware d'authentification.
//
// C'est quoi un middleware ?
// C'est une fonction qui s'exécute AVANT le controller.
// Elle vérifie le token JWT dans le header de la requête.
// Si le token est valide → req.user est rempli → on continue.
// Sinon → on retourne une erreur 401.
//
// Usage dans les routes :
// router.get('/commandes', authentifier, controller.lister)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentifier = authentifier;
exports.autoriser = autoriser;
exports.verifierAgence = verifierAgence;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
// Vérifie que l'utilisateur est connecté (token valide)
function authentifier(req, res, next) {
    // Le token est envoyé dans le header : Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_1.repondreErreur)(res, 'Token manquant. Veuillez vous connecter.', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifierAccessToken)(token);
        req.user = payload; // On attache l'utilisateur à la requête
        next(); // On passe au controller suivant
    }
    catch (error) {
        return (0, response_1.repondreErreur)(res, 'Token invalide ou expiré.', 401);
    }
}
// Vérifie que l'utilisateur a un des rôles autorisés
// Usage : autoriser(Role.PDG, Role.SECRETAIRE)
function autoriser(...rolesAutorises) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.repondreErreur)(res, 'Non authentifié.', 401);
        }
        if (!rolesAutorises.includes(req.user.role)) {
            return (0, response_1.repondreErreur)(res, `Accès refusé. Rôle requis : ${rolesAutorises.join(' ou ')}.`, 403);
        }
        next();
    };
}
// Vérifie que l'employé accède uniquement à son agence
// Le PDG peut accéder à toutes les agences
function verifierAgence(req, res, next) {
    if (!req.user) {
        return (0, response_1.repondreErreur)(res, 'Non authentifié.', 401);
    }
    // Le PDG n'a pas de restriction d'agence
    if (req.user.role === client_1.Role.PDG) {
        return next();
    }
    // Pour les autres rôles, vérifier que l'agence_id dans la requête
    // correspond à celle de l'employé connecté
    const agenceIdDemandee = parseInt((req.query.agence_id || req.params.agenceId || req.body.agenceId));
    if (agenceIdDemandee && agenceIdDemandee !== req.user.agenceId) {
        return (0, response_1.repondreErreur)(res, 'Vous ne pouvez accéder qu\'aux données de votre agence.', 403);
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map