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
exports.enregistrerConnexion = enregistrerConnexion;
exports.estBloque = estBloque;
exports.changerMotDePasse = changerMotDePasse;
exports.obtenirHistoriqueConnexions = obtenirHistoriqueConnexions;
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
// ── Enregistrer une tentative de connexion
async function enregistrerConnexion(userId, succes, ip, userAgent) {
    await prisma_1.default.historiqueConnexion.create({
        data: { userId, succes, ipAddress: ip, userAgent }
    });
    if (succes) {
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { tentativesEchouees: 0, bloqueJusquA: null, derniereCo: new Date() }
        });
    }
    else {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const tentatives = user.tentativesEchouees + 1;
        const bloque = tentatives >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null;
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { tentativesEchouees: tentatives, bloqueJusquA: bloque }
        });
    }
}
// ── Vérifier si un compte est bloqué
async function estBloque(userId) {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user || !user.bloqueJusquA)
        return false;
    if (user.bloqueJusquA > new Date())
        return true;
    await prisma_1.default.user.update({ where: { id: userId }, data: { bloqueJusquA: null, tentativesEchouees: 0 } });
    return false;
}
// ── Changer le mot de passe
async function changerMotDePasse(userId, nouveauHash) {
    return prisma_1.default.user.update({
        where: { id: userId },
        data: { motDePasseHash: nouveauHash }
    });
}
// ── Historique des connexions d'un utilisateur
async function obtenirHistoriqueConnexions(userId) {
    return prisma_1.default.historiqueConnexion.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
}
//# sourceMappingURL=auth.repository.js.map