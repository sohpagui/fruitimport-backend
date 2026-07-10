"use strict";
// ============================================================
// FICHIER : src/repositories/dashboard.repository.ts
// Rôle : Requêtes de statistiques pour le dashboard PDG.
//        Ces requêtes agrègent les données des deux agences
//        pour donner une vue globale à la direction.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsGlobales = statsGlobales;
exports.ventesSetDernierJours = ventesSetDernierJours;
exports.ventesParFruit = ventesParFruit;
exports.statsParAgence = statsParAgence;
exports.genererSynthese = genererSynthese;
exports.beneficesReels = beneficesReels;
const prisma_1 = __importDefault(require("../lib/prisma"));
// ── Stats globales du jour pour les deux agences
async function statsGlobales() {
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    const demain = new Date(aujourd_hui);
    demain.setDate(demain.getDate() + 1);
    // Ventes du jour (commandes livrées ou confirmées aujourd'hui)
    const ventesJour = await prisma_1.default.commande.aggregate({
        where: {
            date: { gte: aujourd_hui, lt: demain },
            statut: { in: ['CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE'] },
        },
        _sum: { montantTotal: true },
        _count: { id: true },
    });
    // Ventes par agence aujourd'hui
    const ventesParAgence = await prisma_1.default.commande.groupBy({
        by: ['agenceId'],
        where: {
            date: { gte: aujourd_hui, lt: demain },
            statut: { in: ['CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE'] },
        },
        _sum: { montantTotal: true },
        _count: { id: true },
    });
    // Stock total par agence
    const stockParAgence = await prisma_1.default.stock.groupBy({
        by: ['agenceId'],
        _sum: { quantiteCartons: true },
    });
    // Pertes du jour
    const pertesJour = await prisma_1.default.perte.aggregate({
        where: { date: { gte: aujourd_hui, lt: demain } },
        _sum: { valeurPerdue: true, quantite: true },
    });
    // Créances totales (crédits utilisés non remboursés)
    const creances = await prisma_1.default.client.aggregate({
        _sum: { creditUtilise: true },
    });
    // Clients en retard
    const clientsEnRetard = await prisma_1.default.client.count({
        where: { statutCredit: 'EN_RETARD' },
    });
    // Clients à relancer
    const clientsARelancer = await prisma_1.default.client.count({
        where: { statutCredit: 'A_RELANCER' },
    });
    // Transferts en attente
    const transfertsEnAttente = await prisma_1.default.transfert.count({
        where: { statut: 'EN_ATTENTE' },
    });
    // Commandes en attente de validation
    const commandesEnAttente = await prisma_1.default.commande.count({
        where: { statut: 'EN_ATTENTE' },
    });
    // Alertes stock bas (moins de 5 cartons)
    const alertesStock = await prisma_1.default.stock.count({
        where: { quantiteCartons: { lte: 5 } },
    });
    return {
        ventesJour: {
            montant: Number(ventesJour._sum.montantTotal) || 0,
            nbCommandes: ventesJour._count.id,
        },
        ventesParAgence,
        stockParAgence,
        pertesJour: {
            valeur: Number(pertesJour._sum.valeurPerdue) || 0,
            quantite: pertesJour._sum.quantite || 0,
        },
        creances: Number(creances._sum.creditUtilise) || 0,
        alertes: {
            clientsEnRetard,
            clientsARelancer,
            transfertsEnAttente,
            commandesEnAttente,
            stockBas: alertesStock,
        },
    };
}
// ── Ventes des 7 derniers jours par agence (pour le graphique)
async function ventesSetDernierJours() {
    const il_y_a_7_jours = new Date();
    il_y_a_7_jours.setDate(il_y_a_7_jours.getDate() - 7);
    il_y_a_7_jours.setHours(0, 0, 0, 0);
    const ventes = await prisma_1.default.commande.findMany({
        where: {
            date: { gte: il_y_a_7_jours },
            statut: { in: ['CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE'] },
        },
        select: {
            date: true,
            montantTotal: true,
            agenceId: true,
        },
        orderBy: { date: 'asc' },
    });
    // Grouper par jour et agence
    const groupes = {};
    for (const vente of ventes) {
        const jour = vente.date.toISOString().split('T')[0];
        if (!groupes[jour])
            groupes[jour] = {};
        if (!groupes[jour][vente.agenceId])
            groupes[jour][vente.agenceId] = 0;
        groupes[jour][vente.agenceId] += Number(vente.montantTotal);
    }
    return groupes;
}
// ── Répartition des ventes par fruit (top 5)
async function ventesParFruit(agenceId) {
    const where = {
        commande: {
            statut: { in: ['CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE'] },
        },
    };
    if (agenceId)
        where.commande.agenceId = agenceId;
    const lignes = await prisma_1.default.ligneCommande.groupBy({
        by: ['fruitId'],
        where,
        _sum: { sousTotal: true, quantite: true },
        orderBy: { _sum: { sousTotal: 'desc' } },
        take: 5,
    });
    // Récupérer les noms des fruits
    const fruitsIds = lignes.map(l => l.fruitId);
    const fruits = await prisma_1.default.fruit.findMany({
        where: { id: { in: fruitsIds } },
        select: { id: true, nom: true },
    });
    return lignes.map(l => ({
        fruit: fruits.find(f => f.id === l.fruitId),
        montant: Number(l._sum.sousTotal) || 0,
        quantite: l._sum.quantite || 0,
    }));
}
// ── Stats détaillées par agence
async function statsParAgence(agenceId) {
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    const demain = new Date(aujourd_hui);
    demain.setDate(demain.getDate() + 1);
    const [ventesJour, stockTotal, nbClients, nbEmployes, pertesMois] = await Promise.all([
        // Ventes du jour
        prisma_1.default.commande.aggregate({
            where: {
                agenceId,
                date: { gte: aujourd_hui, lt: demain },
                statut: { in: ['CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE'] },
            },
            _sum: { montantTotal: true },
            _count: { id: true },
        }),
        // Stock total
        prisma_1.default.stock.aggregate({
            where: { agenceId },
            _sum: { quantiteCartons: true },
        }),
        // Nombre de clients
        prisma_1.default.client.count({ where: { agenceId, actif: true } }),
        // Nombre d'employés actifs
        prisma_1.default.user.count({ where: { agenceId, actif: true } }),
        // Pertes du mois
        prisma_1.default.perte.aggregate({
            where: {
                agenceId,
                date: {
                    gte: new Date(aujourd_hui.getFullYear(), aujourd_hui.getMonth(), 1),
                },
            },
            _sum: { valeurPerdue: true },
        }),
    ]);
    // Top fruits vendus dans cette agence
    const topFruits = await ventesParFruit(agenceId);
    // Livraisons en cours
    const livraisonsEnCours = await prisma_1.default.livraison.count({
        where: {
            statut: { in: ['PREPARE', 'EN_ROUTE'] },
            commande: { agenceId },
        },
    });
    return {
        agenceId,
        ventesJour: {
            montant: Number(ventesJour._sum.montantTotal) || 0,
            nbCommandes: ventesJour._count.id,
        },
        stockTotal: stockTotal._sum.quantiteCartons || 0,
        nbClients,
        nbEmployes,
        perteMois: Number(pertesMois._sum.valeurPerdue) || 0,
        livraisonsEnCours,
        topFruits,
    };
}
// ── Génère des phrases de synthèse automatiques
async function genererSynthese(agenceId1, agenceId2) {
    const [stats1, stats2, alertes] = await Promise.all([
        statsParAgence(agenceId1),
        statsParAgence(agenceId2),
        prisma_1.default.stock.findMany({
            where: { quantiteCartons: { lte: 5 } },
            include: {
                fruit: { select: { nom: true } },
                agence: { select: { nom: true } },
            },
        }),
    ]);
    const phrases = [];
    // Comparaison des agences
    if (stats1.ventesJour.montant > stats2.ventesJour.montant) {
        phrases.push(`Douala est la meilleure agence du jour avec ${stats1.ventesJour.montant.toLocaleString()} FCFA de ventes.`);
    }
    else if (stats2.ventesJour.montant > stats1.ventesJour.montant) {
        phrases.push(`Yaoundé est la meilleure agence du jour avec ${stats2.ventesJour.montant.toLocaleString()} FCFA de ventes.`);
    }
    // Alertes stock
    for (const alerte of alertes) {
        phrases.push(`Le stock de ${alerte.fruit.nom} à ${alerte.agence.nom} est descendu sous le seuil critique (${alerte.quantiteCartons} cartons).`);
    }
    // Top fruit
    if (stats1.topFruits.length > 0 && stats1.topFruits[0].fruit) {
        phrases.push(`${stats1.topFruits[0].fruit.nom} est le fruit le plus vendu à Douala cette période.`);
    }
    return phrases;
}
// ── Bénéfices réels (prix vente - prix achat) par période
async function beneficesReels(periode) {
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    const debut = new Date(aujourd_hui);
    if (periode === 'semaine')
        debut.setDate(debut.getDate() - 7);
    else if (periode === 'mois')
        debut.setDate(1);
    // Récupérer toutes les lignes de commandes validées avec prix achat et vente
    const lignes = await prisma_1.default.ligneCommande.findMany({
        where: {
            commande: {
                date: { gte: debut },
                statut: { in: ['CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE'] },
            },
        },
        include: {
            calibre: { select: { prixAchat: true, prixVente: true } },
            fruit: { select: { id: true, nom: true } },
            commande: { select: { agenceId: true, date: true } },
        },
    });
    // Calculer bénéfice par ligne
    let beneficeBrut = 0;
    let coutAchat = 0;
    let chiffreAffaires = 0;
    const parFruit = {};
    for (const ligne of lignes) {
        const prixVente = Number(ligne.prixUnitaire);
        const prixAchat = Number(ligne.calibre?.prixAchat || 0);
        const qte = ligne.quantite;
        const ca = prixVente * qte;
        const cout = prixAchat * qte;
        const benefice = ca - cout;
        chiffreAffaires += ca;
        coutAchat += cout;
        beneficeBrut += benefice;
        const fruitId = ligne.fruitId.toString();
        if (!parFruit[fruitId])
            parFruit[fruitId] = { nom: ligne.fruit?.nom || '', benefice: 0, quantite: 0 };
        parFruit[fruitId].benefice += benefice;
        parFruit[fruitId].quantite += qte;
    }
    // Pertes de la même période
    const pertes = await prisma_1.default.perte.aggregate({
        where: { date: { gte: debut } },
        _sum: { valeurPerdue: true, quantite: true },
    });
    const valeurPertes = Number(pertes._sum.valeurPerdue) || 0;
    return {
        periode,
        chiffreAffaires,
        coutAchat,
        beneficeBrut,
        valeurPertes,
        beneficeNet: beneficeBrut - valeurPertes,
        margePercent: chiffreAffaires > 0 ? ((beneficeBrut / chiffreAffaires) * 100).toFixed(1) : '0',
        parFruit: Object.values(parFruit).sort((a, b) => b.benefice - a.benefice).slice(0, 5),
    };
}
//# sourceMappingURL=dashboard.repository.js.map