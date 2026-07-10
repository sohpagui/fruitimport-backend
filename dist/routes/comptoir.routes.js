"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_middleware_2 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// GET /comptoir - Infos comptoir Yaounde
router.get('/', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE, client_1.Role.MAGASINIER), async (req, res) => {
    try {
        const comptoir = await prisma_1.default.comptoir.findFirst({
            where: { agenceId: 2 },
            include: {
                gerantActuel: { select: { id: true, nom: true, telephone: true, photoUrl: true } },
                stockComptoir: {
                    include: {
                        fruit: { select: { id: true, nom: true, imageUrl: true } },
                        calibre: { select: { id: true, valeur: true } }
                    }
                }
            }
        });
        return (0, response_1.repondreSucces)(res, comptoir);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// PATCH /comptoir/gerant - Changer gerant du jour
router.patch('/gerant', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.SECRETAIRE, client_1.Role.PDG), async (req, res) => {
    try {
        const { gerantId } = req.body;
        const comptoir = await prisma_1.default.comptoir.update({
            where: { id: 1 },
            data: { gerantActuelId: gerantId },
            include: { gerantActuel: { select: { id: true, nom: true } } }
        });
        return (0, response_1.repondreSucces)(res, comptoir, 'Gerant mis a jour.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /comptoir/approvisionner - Ajouter stock au comptoir
router.post('/approvisionner', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const { fruitId, calibreId, quantite, prixDetail } = req.body;
        // Enregistrer l'approvisionnement
        const appro = await prisma_1.default.approvisionnementComptoir.create({
            data: { comptoirId: 1, fruitId, calibreId, quantite, gerantId: req.user.id },
            include: { fruit: { select: { nom: true } }, calibre: { select: { valeur: true } } }
        });
        // Mettre a jour le stock comptoir
        await prisma_1.default.stockComptoir.upsert({
            where: { comptoirId_fruitId_calibreId: { comptoirId: 1, fruitId, calibreId } },
            update: { quantite: { increment: quantite }, prixDetail },
            create: { comptoirId: 1, fruitId, calibreId, quantite, prixDetail }
        });
        return (0, response_1.repondreSucces)(res, appro, 'Comptoir approvisionne.', 201);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /comptoir/versement - Versement du soir
router.post('/versement', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const { montant, note } = req.body;
        const comptoir = await prisma_1.default.comptoir.findFirst({ where: { agenceId: 2 } });
        if (!comptoir?.gerantActuelId)
            return (0, response_1.repondreErreur)(res, 'Aucun gerant actif.', 400);
        const versement = await prisma_1.default.versementComptoir.create({
            data: { comptoirId: 1, montant, gerantId: comptoir.gerantActuelId, note },
            include: { gerant: { select: { nom: true } } }
        });
        return (0, response_1.repondreSucces)(res, versement, 'Versement enregistre.', 201);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// POST /comptoir/perte - Declarer perte comptoir
router.post('/perte', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const { fruitId, calibreId, quantite, raison } = req.body;
        const comptoir = await prisma_1.default.comptoir.findFirst({ where: { agenceId: 2 } });
        if (!comptoir?.gerantActuelId)
            return (0, response_1.repondreErreur)(res, 'Aucun gerant actif.', 400);
        const perte = await prisma_1.default.perteComptoir.create({
            data: { comptoirId: 1, fruitId, calibreId, quantite, raison, gerantId: comptoir.gerantActuelId },
            include: { fruit: { select: { nom: true } } }
        });
        // Diminuer le stock comptoir
        await prisma_1.default.stockComptoir.updateMany({
            where: { comptoirId: 1, fruitId, calibreId },
            data: { quantite: { decrement: quantite } }
        });
        return (0, response_1.repondreSucces)(res, perte, 'Perte declaree.', 201);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /comptoir/versements - Historique versements
router.get('/versements', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.PDG, client_1.Role.SECRETAIRE), async (req, res) => {
    try {
        const versements = await prisma_1.default.versementComptoir.findMany({
            where: { comptoirId: 1 },
            include: { gerant: { select: { nom: true } } },
            orderBy: { date: 'desc' },
            take: 30
        });
        return (0, response_1.repondreSucces)(res, versements);
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// GET /comptoir/stats - Stats du comptoir pour PDG
router.get('/stats', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.PDG), async (req, res) => {
    try {
        const aujourd_hui = new Date();
        aujourd_hui.setHours(0, 0, 0, 0);
        const demain = new Date(aujourd_hui);
        demain.setDate(demain.getDate() + 1);
        const [versementsJour, versementsMois, pertesJour, stock] = await Promise.all([
            prisma_1.default.versementComptoir.aggregate({ where: { comptoirId: 1, date: { gte: aujourd_hui, lt: demain } }, _sum: { montant: true }, _count: { id: true } }),
            prisma_1.default.versementComptoir.aggregate({ where: { comptoirId: 1, date: { gte: new Date(aujourd_hui.getFullYear(), aujourd_hui.getMonth(), 1) } }, _sum: { montant: true } }),
            prisma_1.default.perteComptoir.aggregate({ where: { comptoirId: 1, date: { gte: aujourd_hui, lt: demain } }, _sum: { quantite: true }, _count: { id: true } }),
            prisma_1.default.stockComptoir.findMany({ where: { comptoirId: 1 }, include: { fruit: { select: { nom: true } }, calibre: { select: { valeur: true } } } })
        ]);
        return (0, response_1.repondreSucces)(res, {
            versementsJour: { montant: Number(versementsJour._sum.montant) || 0, nb: versementsJour._count.id },
            versementsMois: Number(versementsMois._sum.montant) || 0,
            pertesJour: { quantite: pertesJour._sum.quantite || 0, nb: pertesJour._count.id },
            stock
        });
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
// PATCH /comptoir/prix - Modifier prix detail (PDG)
router.patch('/prix', auth_middleware_1.authentifier, (0, auth_middleware_2.autoriser)(client_1.Role.PDG), async (req, res) => {
    try {
        const { fruitId, calibreId, prixDetail } = req.body;
        const stock = await prisma_1.default.stockComptoir.updateMany({
            where: { comptoirId: 1, fruitId, calibreId },
            data: { prixDetail }
        });
        return (0, response_1.repondreSucces)(res, stock, 'Prix mis a jour.');
    }
    catch (e) {
        return (0, response_1.repondreErreur)(res, e.message, 500);
    }
});
exports.default = router;
//# sourceMappingURL=comptoir.routes.js.map