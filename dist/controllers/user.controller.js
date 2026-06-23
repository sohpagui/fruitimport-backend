"use strict";
// ============================================================
// FICHIER : src/controllers/user.controller.ts
// Rôle : Gère les requêtes HTTP pour la gestion des employés.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerUser = creerUser;
exports.listerUsers = listerUsers;
exports.obtenirUser = obtenirUser;
exports.modifierUser = modifierUser;
const zod_1 = require("zod");
const user_service_1 = require("../services/user.service");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
const schemaCreerUser = zod_1.z.object({
    nom: zod_1.z.string().min(2).max(100),
    telephone: zod_1.z.string().min(8).max(20),
    email: zod_1.z.string().email().optional(),
    motDePasse: zod_1.z.string().min(6),
    role: zod_1.z.enum(['SECRETAIRE', 'MAGASINIER', 'LIVREUR']),
    agenceId: zod_1.z.number().int().positive(),
});
const schemaMettreAJour = zod_1.z.object({
    nom: zod_1.z.string().min(2).max(100).optional(),
    telephone: zod_1.z.string().min(8).max(20).optional(),
    email: zod_1.z.string().email().optional(),
    motDePasse: zod_1.z.string().min(6).optional(),
    actif: zod_1.z.boolean().optional(),
    agenceId: zod_1.z.number().int().positive().optional(),
});
// POST /admin/users — Créer un employé (PDG uniquement)
async function creerUser(req, res) {
    try {
        const data = schemaCreerUser.parse(req.body);
        const user = await (0, user_service_1.creerCompteEmploye)({ ...data, role: data.role }, req.user.id);
        return (0, response_1.repondreSucces)(res, user, 'Compte employé créé avec succès.', 201);
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, error.errors);
        }
        return (0, response_1.repondreErreur)(res, error.message, 400);
    }
}
// GET /admin/users — Lister les employés
async function listerUsers(req, res) {
    try {
        const pagination = (0, pagination_1.getPagination)(req);
        const agenceId = req.query.agence_id ? parseInt(req.query.agence_id) : undefined;
        const role = req.query.role;
        const { users, total } = await (0, user_service_1.listerEmployes)({
            ...pagination,
            agenceId,
            role,
        });
        return (0, response_1.repondreSucces)(res, {
            users,
            pagination: (0, pagination_1.formatPagination)(total, pagination),
        });
    }
    catch (error) {
        return (0, response_1.repondreErreur)(res, error.message, 500);
    }
}
// GET /admin/users/:id — Détails d'un employé
async function obtenirUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        const user = await (0, user_service_1.obtenirEmploye)(id);
        return (0, response_1.repondreSucces)(res, user);
    }
    catch (error) {
        return (0, response_1.repondreErreur)(res, error.message, 404);
    }
}
// PATCH /admin/users/:id — Modifier un employé
async function modifierUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        const data = schemaMettreAJour.parse(req.body);
        const user = await (0, user_service_1.modifierEmploye)(id, data, {
            id: req.user.id,
            role: req.user.role,
        });
        return (0, response_1.repondreSucces)(res, user, 'Employé mis à jour.');
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return (0, response_1.repondreErreur)(res, 'Données invalides.', 400, error.errors);
        }
        return (0, response_1.repondreErreur)(res, error.message, 400);
    }
}
//# sourceMappingURL=user.controller.js.map