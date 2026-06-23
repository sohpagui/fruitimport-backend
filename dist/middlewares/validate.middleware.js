"use strict";
// ============================================================
// FICHIER : src/middlewares/validate.middleware.ts
// Rôle : Valide les données envoyées par le client
//        avec les schémas Zod avant d'appeler le controller.
//
// Zod est une librairie de validation. On définit la forme
// attendue des données et Zod vérifie automatiquement.
// Si une donnée est invalide → erreur 400 avec détails.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.valider = valider;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
function valider(schema) {
    return (req, res, next) => {
        try {
            // Parse et valide le body de la requête
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Formate les erreurs Zod pour les rendre lisibles
                const erreurs = error.errors.map((e) => ({
                    champ: e.path.join('.'),
                    message: e.message,
                }));
                return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, erreurs);
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map