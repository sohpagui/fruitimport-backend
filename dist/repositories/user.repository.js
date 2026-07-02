"use strict";
// ============================================================
// FICHIER : src/repositories/user.repository.ts
// Rôle : Accès BD pour la gestion des utilisateurs (employés).
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listerUsers = listerUsers;
exports.trouverUserParId = trouverUserParId;
exports.creerUser = creerUser;
exports.mettreAJourUser = mettreAJourUser;
exports.desactiverUser = desactiverUser;
exports.loggerAction = loggerAction;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Liste tous les employés (avec filtres optionnels)
async function listerUsers(params) {
    const where = { actif: true };
    if (params.agenceId)
        where.agenceId = params.agenceId;
    if (params.role)
        where.role = params.role;
    const [users, total] = await Promise.all([
        prisma_1.default.user.findMany({
            where,
            skip: params.skip,
            take: params.limit,
            select: {
                id: true,
                nom: true,
                telephone: true,
                email: true,
                role: true,
                actif: true,
                createdAt: true,
                agence: { select: { id: true, nom: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma_1.default.user.count({ where }),
    ]);
    return { users, total };
}
// Trouve un employé par ID
async function trouverUserParId(id) {
    return prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            nom: true,
            telephone: true,
            email: true,
            role: true,
            agenceId: true,
            actif: true,
            createdAt: true,
            agence: { select: { id: true, nom: true } },
        },
    });
}
// Crée un compte employé (PDG uniquement)
async function creerUser(data) {
    return prisma_1.default.user.create({
        data,
        select: {
            id: true,
            nom: true,
            telephone: true,
            email: true,
            role: true,
            agenceId: true,
            createdAt: true,
            agence: { select: { id: true, nom: true } },
        },
    });
}
// Met à jour les infos d'un employé
async function mettreAJourUser(id, data) {
    return prisma_1.default.user.update({
        where: { id },
        data,
        select: {
            id: true,
            nom: true,
            telephone: true,
            email: true,
            role: true,
            agenceId: true,
            actif: true,
        },
    });
}
// Désactive un compte employé (soft delete)
async function desactiverUser(id) {
    return prisma_1.default.user.update({
        where: { id },
        data: { actif: false },
    });
}
// Enregistre une action dans les logs
async function loggerAction(data) {
    return prisma_1.default.logAction.create({ data });
}
//# sourceMappingURL=user.repository.js.map