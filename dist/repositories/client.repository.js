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
exports.fixerEcheanceEtTaux = fixerEcheanceEtTaux;
exports.enregistrerVersementCredit = enregistrerVersementCredit;
exports.listerVersementsClient = listerVersementsClient;
exports.appliquerInteretsRetard = appliquerInteretsRetard;
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
// ── Fixer la date d'échéance et le taux d'intérêt d'un client (PDG uniquement)
async function fixerEcheanceEtTaux(clientId, dateEcheance, tauxInteretMensuel) {
    return prisma.client.update({
        where: { id: clientId },
        data: { dateEcheance, tauxInteretMensuel },
    });
}
// ── Enregistrer un versement de crédit (avec historique avant/apres)
async function enregistrerVersementCredit(data) {
    return prisma.$transaction(async (tx) => {
        const client = await tx.client.findUnique({ where: { id: data.clientId } });
        if (!client)
            throw new Error('Client introuvable.');
        const soldeAvant = Number(client.creditUtilise);
        const montantReel = Math.min(data.montant, soldeAvant);
        const soldeApres = soldeAvant - montantReel;
        const versement = await tx.versementCredit.create({
            data: {
                clientId: data.clientId,
                montant: montantReel,
                soldeAvant,
                soldeApres,
                enregistreParId: data.enregistreParId,
            },
        });
        const updateData = { creditUtilise: soldeApres };
        if (soldeApres <= 0) {
            updateData.dateEcheance = null;
            updateData.statutCredit = 'EN_REGLE';
        }
        await tx.client.update({
            where: { id: data.clientId },
            data: updateData,
        });
        return versement;
    });
}
// ── Historique des versements d'un client
async function listerVersementsClient(clientId) {
    return prisma.versementCredit.findMany({
        where: { clientId },
        orderBy: { date: 'desc' },
        include: {
            enregistrePar: { select: { id: true, nom: true } },
        },
    });
}
// ── Applique les intérêts de retard sur tous les clients en échéance dépassée
async function appliquerInteretsRetard() {
    const maintenant = new Date();
    const clientsEnRetard = await prisma.client.findMany({
        where: {
            dateEcheance: { lt: maintenant },
            creditUtilise: { gt: 0 },
        },
    });
    const resultats = [];
    for (const client of clientsEnRetard) {
        const taux = Number(client.tauxInteretMensuel);
        if (taux <= 0)
            continue;
        const soldeAvant = Number(client.creditUtilise);
        const interet = soldeAvant * (taux / 100);
        const soldeApres = soldeAvant + interet;
        await prisma.client.update({
            where: { id: client.id },
            data: {
                creditUtilise: soldeApres,
                statutCredit: 'EN_RETARD',
                dateEcheance: new Date(client.dateEcheance.getTime() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        resultats.push({ clientId: client.id, nom: client.nom, interetApplique: interet, nouveauSolde: soldeApres });
    }
    return resultats;
}
//# sourceMappingURL=client.repository.js.map