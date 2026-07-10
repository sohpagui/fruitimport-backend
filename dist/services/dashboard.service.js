"use strict";
// ============================================================
// FICHIER : src/services/dashboard.service.ts
// Rôle : Logique métier du dashboard.
//        Orchestre les appels au repository et formate
//        les données pour le controller.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenirDashboardPDG = obtenirDashboardPDG;
exports.obtenirDashboardAgence = obtenirDashboardAgence;
exports.obtenirBenefices = obtenirBenefices;
const dashboard_repository_1 = require("../repositories/dashboard.repository");
// ── Dashboard PDG : vue globale des deux agences
async function obtenirDashboardPDG() {
    const [stats, ventesGraphique, topFruits, syntheseDouala, syntheseYaounde, phrases] = await Promise.all([
        (0, dashboard_repository_1.statsGlobales)(),
        (0, dashboard_repository_1.ventesSetDernierJours)(),
        (0, dashboard_repository_1.ventesParFruit)(),
        (0, dashboard_repository_1.statsParAgence)(1), // Douala
        (0, dashboard_repository_1.statsParAgence)(2), // Yaoundé
        (0, dashboard_repository_1.genererSynthese)(1, 2),
    ]);
    // Déterminer la meilleure agence du jour
    const meilleureAgence = syntheseDouala.ventesJour.montant >= syntheseYaounde.ventesJour.montant
        ? 'DOUALA'
        : 'YAOUNDE';
    return {
        kpis: {
            ventesTotalesJour: stats.ventesJour.montant,
            nbCommandesJour: stats.ventesJour.nbCommandes,
            pertesJour: stats.pertesJour,
            creancesTotales: stats.creances,
        },
        comparaison: {
            douala: syntheseDouala,
            yaounde: syntheseYaounde,
            meilleureAgence,
        },
        graphiqueVentes: ventesGraphique,
        topFruits,
        alertes: stats.alertes,
        synthese: phrases,
    };
}
// ── Dashboard par agence (secrétaire, magasinier)
async function obtenirDashboardAgence(agenceId) {
    return (0, dashboard_repository_1.statsParAgence)(agenceId);
}
// ── Bénéfices réels pour le PDG
async function obtenirBenefices(periode) {
    const p = (periode === 'semaine' || periode === 'mois') ? periode : 'jour';
    return (0, dashboard_repository_1.beneficesReels)(p);
}
//# sourceMappingURL=dashboard.service.js.map