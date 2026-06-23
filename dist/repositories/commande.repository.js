"use strict";
// ============================================================
// FICHIER : src/repositories/commande.repository.ts
// Rôle : Accès BD pour les commandes.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerCommande = creerCommande;
exports.listerCommandes = listerCommandes;
exports.trouverCommandeParId = trouverCommandeParId;
exports.changerStatutCommande = changerStatutCommande;
const client_1 = require("@prisma/client");
const stock_repository_1 = require("./stock.repository");
const prisma = new client_1.PrismaClient();
// Génère un numéro de commande unique : BC-2026-000001
async function genererNumeroCommande() {
    const annee = new Date().getFullYear();
    const count = await prisma.commande.count();
    const numero = String(count + 1).padStart(6, '0');
    return `BC-${annee}-${numero}`;
}
// ── Créer une commande (transaction atomique)
async function creerCommande(data) {
    return prisma.$transaction(async (tx) => {
        // 1. Calculer le montant total
        let montantTotal = 0;
        for (const ligne of data.lignes) {
            montantTotal += ligne.quantite * ligne.prixUnitaire;
        }
        // 2. Vérifier la limite de crédit si paiement par crédit
        if (data.modePaiement === 'CREDIT') {
            const client = await tx.client.findUnique({ where: { id: data.clientId } });
            if (!client)
                throw new Error('Client introuvable.');
            const creditDisponible = Number(client.limiteCredit) - Number(client.creditUtilise);
            if (montantTotal > creditDisponible) {
                throw new Error(`Limite de crédit insuffisante. Disponible : ${creditDisponible} FCFA, Commande : ${montantTotal} FCFA.`);
            }
        }
        // 3. Générer le numéro de commande
        const numero = await genererNumeroCommande();
        // 4. Créer la commande
        const commande = await tx.commande.create({
            data: {
                numero,
                agenceId: data.agenceId,
                clientId: data.clientId,
                creeParId: data.creeParId,
                modePaiement: data.modePaiement,
                montantTotal,
                adresseLivraison: data.adresseLivraison,
                note: data.note,
                statut: 'EN_ATTENTE',
                lignes: {
                    create: data.lignes.map((l) => ({
                        fruitId: l.fruitId,
                        calibreId: l.calibreId,
                        categorie: l.categorie,
                        quantite: l.quantite,
                        prixUnitaire: l.prixUnitaire,
                        sousTotal: l.quantite * l.prixUnitaire,
                    })),
                },
            },
            include: {
                lignes: {
                    include: {
                        fruit: { select: { id: true, nom: true } },
                        calibre: { select: { id: true, valeur: true } },
                    },
                },
                client: { select: { id: true, nom: true, telephone: true } },
            },
        });
        // 5. Déduire du stock pour chaque ligne
        for (const ligne of data.lignes) {
            await (0, stock_repository_1.deduireStock)(tx, data.agenceId, ligne.fruitId, ligne.calibreId, ligne.categorie, ligne.quantite);
        }
        // 6. Mettre à jour le crédit utilisé si paiement par crédit
        if (data.modePaiement === 'CREDIT') {
            await tx.client.update({
                where: { id: data.clientId },
                data: { creditUtilise: { increment: montantTotal } },
            });
        }
        return commande;
    });
}
// ── Lister les commandes avec filtres
async function listerCommandes(params) {
    const where = {};
    if (params.agenceId)
        where.agenceId = params.agenceId;
    if (params.clientId)
        where.clientId = params.clientId;
    if (params.statut)
        where.statut = params.statut;
    const [commandes, total] = await Promise.all([
        prisma.commande.findMany({
            where,
            skip: params.skip,
            take: params.limit,
            include: {
                client: { select: { id: true, nom: true, telephone: true, type: true } },
                agence: { select: { id: true, nom: true } },
                creePar: { select: { id: true, nom: true, role: true } },
                lignes: {
                    include: {
                        fruit: { select: { id: true, nom: true } },
                        calibre: { select: { id: true, valeur: true } },
                    },
                },
                livraison: true,
            },
            orderBy: { date: 'desc' },
        }),
        prisma.commande.count({ where }),
    ]);
    return { commandes, total };
}
// ── Trouver une commande par ID
async function trouverCommandeParId(id) {
    return prisma.commande.findUnique({
        where: { id },
        include: {
            client: true,
            agence: { select: { id: true, nom: true } },
            creePar: { select: { id: true, nom: true, role: true } },
            lignes: {
                include: {
                    fruit: { select: { id: true, nom: true, uniteMesure: true } },
                    calibre: { select: { id: true, valeur: true } },
                },
            },
            livraison: {
                include: { livreur: { select: { id: true, nom: true, telephone: true } } },
            },
        },
    });
}
// ── Changer le statut d'une commande
async function changerStatutCommande(id, statut) {
    return prisma.commande.update({
        where: { id },
        data: { statut },
    });
}
//# sourceMappingURL=commande.repository.js.map