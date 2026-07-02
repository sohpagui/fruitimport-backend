"use strict";
// ============================================================
// FICHIER : src/repositories/transfert.repository.ts
// Rôle : Accès BD pour les transferts inter-agences.
//        Seul le magasinier de Douala peut initier un transfert.
//        Seul le PDG peut approuver ou rejeter.
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creerTransfert = creerTransfert;
exports.listerTransferts = listerTransferts;
exports.approuverTransfert = approuverTransfert;
exports.rejeterTransfert = rejeterTransfert;
const prisma_1 = __importDefault(require("../lib/prisma"));
// ── Créer une demande de transfert
async function creerTransfert(data) {
    // Vérifier que le stock source est suffisant
    const stock = await prisma_1.default.stock.findFirst({
        where: {
            agenceId: data.agenceSourceId,
            fruitId: data.fruitId,
            calibreId: data.calibreId,
            quantiteCartons: { gte: data.quantite },
        },
    });
    if (!stock) {
        throw new Error('Stock insuffisant pour ce transfert.');
    }
    return prisma_1.default.transfert.create({
        data: {
            agenceSourceId: data.agenceSourceId,
            agenceDestinationId: data.agenceDestinationId,
            fruitId: data.fruitId,
            calibreId: data.calibreId,
            quantite: data.quantite,
            demandePar: data.demandePar,
            note: data.note,
            statut: 'EN_ATTENTE',
        },
        include: {
            agenceSource: { select: { id: true, nom: true } },
            agenceDestination: { select: { id: true, nom: true } },
            fruit: { select: { id: true, nom: true } },
            calibre: { select: { id: true, valeur: true } },
            demandeur: { select: { id: true, nom: true, role: true } },
        },
    });
}
// ── Lister les transferts
async function listerTransferts(params) {
    const where = {};
    if (params.statut)
        where.statut = params.statut;
    if (params.agenceId) {
        where.OR = [
            { agenceSourceId: params.agenceId },
            { agenceDestinationId: params.agenceId },
        ];
    }
    const [transferts, total] = await Promise.all([
        prisma_1.default.transfert.findMany({
            where,
            skip: params.skip,
            take: params.limit,
            include: {
                agenceSource: { select: { id: true, nom: true } },
                agenceDestination: { select: { id: true, nom: true } },
                fruit: { select: { id: true, nom: true } },
                calibre: { select: { id: true, valeur: true } },
                demandeur: { select: { id: true, nom: true } },
                validateur: { select: { id: true, nom: true } },
            },
            orderBy: { dateDemande: 'desc' },
        }),
        prisma_1.default.transfert.count({ where }),
    ]);
    return { transferts, total };
}
// ── Approuver un transfert (PDG uniquement) — transaction atomique
async function approuverTransfert(id, validePar) {
    return prisma_1.default.$transaction(async (tx) => {
        const transfert = await tx.transfert.findUnique({ where: { id } });
        if (!transfert)
            throw new Error('Transfert introuvable.');
        if (transfert.statut !== 'EN_ATTENTE') {
            throw new Error('Ce transfert a déjà été traité.');
        }
        // Vérifier le stock source
        const stockSource = await tx.stock.findFirst({
            where: {
                agenceId: transfert.agenceSourceId,
                fruitId: transfert.fruitId,
                calibreId: transfert.calibreId,
                quantiteCartons: { gte: transfert.quantite },
            },
        });
        if (!stockSource)
            throw new Error('Stock source insuffisant.');
        // Déduire du stock source
        await tx.stock.update({
            where: { id: stockSource.id },
            data: { quantiteCartons: { decrement: transfert.quantite } },
        });
        // Ajouter au stock destination
        await tx.stock.upsert({
            where: {
                agenceId_fruitId_calibreId_origine_categorie: {
                    agenceId: transfert.agenceDestinationId,
                    fruitId: transfert.fruitId,
                    calibreId: transfert.calibreId,
                    origine: stockSource.origine,
                    categorie: stockSource.categorie,
                },
            },
            update: { quantiteCartons: { increment: transfert.quantite } },
            create: {
                agenceId: transfert.agenceDestinationId,
                fruitId: transfert.fruitId,
                calibreId: transfert.calibreId,
                origine: stockSource.origine,
                categorie: stockSource.categorie,
                quantiteCartons: transfert.quantite,
                prixUnitaire: stockSource.prixUnitaire,
            },
        });
        // Marquer le transfert comme approuvé
        return tx.transfert.update({
            where: { id },
            data: {
                statut: 'APPROUVE',
                validePar,
                dateValidation: new Date(),
            },
        });
    });
}
// ── Rejeter un transfert
async function rejeterTransfert(id, validePar) {
    const transfert = await prisma_1.default.transfert.findUnique({ where: { id } });
    if (!transfert)
        throw new Error('Transfert introuvable.');
    if (transfert.statut !== 'EN_ATTENTE')
        throw new Error('Ce transfert a déjà été traité.');
    return prisma_1.default.transfert.update({
        where: { id },
        data: { statut: 'REJETE', validePar, dateValidation: new Date() },
    });
}
//# sourceMappingURL=transfert.repository.js.map