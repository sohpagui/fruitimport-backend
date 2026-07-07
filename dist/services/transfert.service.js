"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demanderTransfert = demanderTransfert;
exports.obtenirTransferts = obtenirTransferts;
exports.approuver = approuver;
exports.rejeter = rejeter;
const client_1 = require("@prisma/client");
const transfert_repository_1 = require("../repositories/transfert.repository");
async function demanderTransfert(data, demandeur) {
    if (demandeur.role !== client_1.Role.MAGASINIER && demandeur.role !== client_1.Role.SECRETAIRE) {
        throw new Error('Seul un magasinier ou secretaire peut initier un transfert.');
    }
    return (0, transfert_repository_1.creerTransfert)({ ...data, demandePar: demandeur.id, agenceSourceId: demandeur.agenceId });
}
async function obtenirTransferts(params) {
    return (0, transfert_repository_1.listerTransferts)(params);
}
async function approuver(id, validePar) {
    return (0, transfert_repository_1.approuverTransfert)(id, validePar);
}
async function rejeter(id, validePar) {
    return (0, transfert_repository_1.rejeterTransfert)(id, validePar);
}
//# sourceMappingURL=transfert.service.js.map