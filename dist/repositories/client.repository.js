"use strict";
// ============================================================
// FICHIER : src/repositories/client.repository.ts
// Rôle : Accès BD pour les clients et leurs crédits.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.listerClients = listerClients;
exports.trouverClientParId = trouverClientParId;
exports.modifierLimiteCredit = modifierLimiteCredit;
exports.enregistrerPaiementCredit = enregistrerPaiementCredit;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ── Lister les clients
async function listerClients(params) {
    const where = { actif: true };
    if (params.agenceId)
        where.agenceId = params.agenceId;
    if (params.statutCredit)
        where.statutCredit = params.statutCredit;
    const [clients, total] = await Promise.all([
        prisma.client.findMany({
            where,
            skip: params.skip,
            take: params.limit,
            select: {
                id: true,
                nom: true,
                type: true,
                telephone: true,
                email: true,
                adresse: true,
                limiteCredit: true,
                creditUtilise: true,
                statutCredit: true,
                createdAt: true,
                agence: { select: { id: true, nom: true } },
            },
            orderBy: { nom: 'asc' },
        }),
        prisma.client.count({ where }),
    ]);
    return { clients, total };
}
// ── Trouver un client par ID
async function trouverClientParId(id) {
    return prisma.client.findUnique({
        where: { id },
        include: {
            agence: { select: { id: true, nom: true } },
            commandes: {
                orderBy: { date: 'desc' },
                take: 5,
                select: {
                    id: true, numero: true, montantTotal: true,
                    statut: true, modePaiement: true, date: true,
                },
            },
            paiementsCredit: {
                orderBy: { date: 'desc' },
                take: 10,
            },
        },
    });
}
// ── Modifier la limite de crédit (PDG uniquement)
async function modifierLimiteCredit(clientId, limiteCredit, modifiePar) {
    const client = await prisma.client.update({
        where: { id: clientId },
        data: { limiteCredit },
    });
    // Recalculer le statut crédit
    await recalculerStatutCredit(clientId);
    return client;
}
// ── Enregistrer un paiement de crédit
async function enregistrerPaiementCredit(data) {
    return prisma.$transaction(async (tx) => {
        const client = await tx.client.findUnique({ where: { id: data.clientId } });
        if (!client)
            throw new Error('Client introuvable.');
        const montantReel = Math.min(data.montant, Number(client.creditUtilise));
        // Enregistrer le paiement
        const paiement = await tx.paiementCredit.create({
            data: {
                clientId: data.clientId,
                commandeId: data.commandeId,
                montant: montantReel,
                enregistrePar: data.enregistrePar,
            },
        });
        // Réduire le crédit utilisé
        await tx.client.update({
            where: { id: data.clientId },
            data: { creditUtilise: { decrement: montantReel } },
        });
        // Recalculer le statut
        await recalculerStatutCredit(data.clientId);
        return paiement;
    });
}
// ── Recalcule le statut crédit d'un client
async function recalculerStatutCredit(clientId) {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client)
        return;
    const creditUtilise = Number(client.creditUtilise);
    const limiteCredit = Number(client.limiteCredit);
    let nouveauStatut = 'EN_REGLE';
    if (limiteCredit > 0) {
        const tauxUtilisation = creditUtilise / limiteCredit;
        if (tauxUtilisation >= 1) {
            nouveauStatut = 'EN_RETARD';
        }
        else if (tauxUtilisation >= 0.7) {
            nouveauStatut = 'A_RELANCER';
        }
    }
    await prisma.client.update({
        where: { id: clientId },
        data: { statutCredit: nouveauStatut },
    });
}
//# sourceMappingURL=client.repository.js.map