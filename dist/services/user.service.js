"use strict";
// ============================================================
// FICHIER : src/services/user.service.ts
// Rôle : Logique métier pour la gestion des employés.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerCompteEmploye = creerCompteEmploye;
exports.listerEmployes = listerEmployes;
exports.modifierEmploye = modifierEmploye;
exports.obtenirEmploye = obtenirEmploye;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const user_repository_1 = require("../repositories/user.repository");
const auth_repository_1 = require("../repositories/auth.repository");
// Rôles qui ne peuvent pas être créés par le PDG
// (les clients s'auto-inscrivent séparément)
const ROLES_EMPLOYES = [
    client_1.Role.SECRETAIRE,
    client_1.Role.MAGASINIER,
    client_1.Role.LIVREUR,
];
// ── Créer un compte employé (PDG uniquement)
async function creerCompteEmploye(data, creePar) {
    // 1. Vérifie que le rôle est un rôle d'employé
    if (!ROLES_EMPLOYES.includes(data.role)) {
        throw new Error('Rôle invalide. Seuls SECRETAIRE, MAGASINIER et LIVREUR sont autorisés.');
    }
    // 2. Les secrétaires, magasiniers et livreurs doivent avoir une agence
    if (!data.agenceId) {
        throw new Error('Une agence est requise pour ce rôle.');
    }
    // 3. Vérifie l'unicité du téléphone
    const telExiste = await (0, auth_repository_1.telephoneExiste)(data.telephone);
    if (telExiste) {
        throw new Error('Ce numéro de téléphone est déjà utilisé.');
    }
    // 4. Vérifie l'unicité de l'email
    if (data.email) {
        const mailExiste = await (0, auth_repository_1.emailExiste)(data.email);
        if (mailExiste) {
            throw new Error('Cette adresse email est déjà utilisée.');
        }
    }
    // 5. Hashe le mot de passe (le PDG définit le mdp, l'employé ne peut pas le changer)
    const motDePasseHash = await bcryptjs_1.default.hash(data.motDePasse, 12);
    // 6. Crée le compte
    const { motDePasse, ...donneesSansMdp } = data;
    const user = await (0, user_repository_1.creerUser)({
        ...donneesSansMdp,
        motDePasseHash,
        creePar,
    });
    // 7. Log l'action
    await (0, user_repository_1.loggerAction)({
        userId: creePar,
        action: 'CREATION_COMPTE',
        details: JSON.stringify({ userId: user.id, role: user.role, nom: user.nom }),
    });
    return user;
}
// ── Lister les employés
async function listerEmployes(params) {
    return (0, user_repository_1.listerUsers)({
        agenceId: params.agenceId,
        role: params.role,
        skip: params.skip,
        limit: params.limit,
    });
}
// ── Modifier un employé
async function modifierEmploye(id, data, modifiePar) {
    const user = await (0, user_repository_1.trouverUserParId)(id);
    if (!user) {
        throw new Error('Employé introuvable.');
    }
    // Vérifier les unicités si téléphone ou email changent
    if (data.telephone && data.telephone !== user.telephone) {
        const telExiste = await (0, auth_repository_1.telephoneExiste)(data.telephone);
        if (telExiste)
            throw new Error('Ce téléphone est déjà utilisé.');
    }
    const miseAJour = {};
    if (data.nom)
        miseAJour.nom = data.nom;
    if (data.telephone)
        miseAJour.telephone = data.telephone;
    if (data.email)
        miseAJour.email = data.email;
    if (data.agenceId)
        miseAJour.agenceId = data.agenceId;
    if (typeof data.actif === 'boolean')
        miseAJour.actif = data.actif;
    // Seul le PDG peut changer le mot de passe
    if (data.motDePasse && modifiePar.role === client_1.Role.PDG) {
        miseAJour.motDePasseHash = await bcryptjs_1.default.hash(data.motDePasse, 12);
    }
    else if (data.motDePasse && modifiePar.role !== client_1.Role.PDG) {
        throw new Error('Seul le PDG peut modifier le mot de passe d\'un employé.');
    }
    const userMisAJour = await (0, user_repository_1.mettreAJourUser)(id, miseAJour);
    // Log si c'est une modification importante
    if (data.motDePasse || typeof data.actif === 'boolean') {
        await (0, user_repository_1.loggerAction)({
            userId: modifiePar.id,
            action: 'MODIFICATION_COMPTE',
            details: JSON.stringify({ userId: id, champs: Object.keys(miseAJour) }),
        });
    }
    return userMisAJour;
}
// ── Obtenir un employé par ID
async function obtenirEmploye(id) {
    const user = await (0, user_repository_1.trouverUserParId)(id);
    if (!user)
        throw new Error('Employé introuvable.');
    return user;
}
//# sourceMappingURL=user.service.js.map