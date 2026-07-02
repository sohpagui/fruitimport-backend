"use strict";
// ============================================================
// FICHIER : src/repositories/auth.repository.ts
// Rôle : Accès à la base de données pour l'authentification.
//        Le repository est la SEULE couche qui parle à Prisma.
//        Les services appellent le repository, jamais Prisma directement.
//
// Architecture en couches :
// Route → Controller → Service → Repository → Prisma → MySQL
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trouverUserParIdentifiant = trouverUserParIdentifiant;
exports.trouverClientParIdentifiant = trouverClientParIdentifiant;
exports.creerClient = creerClient;
exports.telephoneExiste = telephoneExiste;
exports.emailExiste = emailExiste;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Trouve un employé par téléphone ou email
async function trouverUserParIdentifiant(identifiant) {
    return prisma_1.default.user.findFirst({
        where: {
            OR: [
                { telephone: identifiant },
                { email: identifiant },
            ],
            actif: true,
        },
        include: {
            agence: {
                select: { id: true, nom: true, ville: true },
            },
        },
    });
}
// Trouve un client par téléphone ou email
async function trouverClientParIdentifiant(identifiant) {
    return prisma_1.default.client.findFirst({
        where: {
            OR: [
                { telephone: identifiant },
                { email: identifiant },
            ],
            actif: true,
        },
        include: {
            agence: {
                select: { id: true, nom: true, ville: true },
            },
        },
    });
}
// Crée un nouveau compte client (auto-inscription)
async function creerClient(data) {
    return prisma_1.default.client.create({
        data,
        include: {
            agence: {
                select: { id: true, nom: true, ville: true },
            },
        },
    });
}
// Vérifie qu'un téléphone n'est pas déjà utilisé (user ou client)
async function telephoneExiste(telephone) {
    const user = await prisma_1.default.user.findUnique({ where: { telephone } });
    const client = await prisma_1.default.client.findUnique({ where: { telephone } });
    return !!(user || client);
}
// Vérifie qu'un email n'est pas déjà utilisé
async function emailExiste(email) {
    const user = await prisma_1.default.user.findFirst({ where: { email } });
    const client = await prisma_1.default.client.findFirst({ where: { email } });
    return !!(user || client);
}
//# sourceMappingURL=auth.repository.js.map