"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genererBonCommande = genererBonCommande;
const pdfkit_1 = __importDefault(require("pdfkit"));
async function genererBonCommande(commande, res) {
    const doc = new pdfkit_1.default({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=BC-${commande.numero}.pdf`);
    doc.pipe(res);
    // En-tête
    doc.fontSize(20).font('Helvetica-Bold').text('FRUITIMPORT CAMEROUN', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Importateur de fruits - Douala & Yaoundé', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    // Titre
    doc.fontSize(16).font('Helvetica-Bold').text('BON DE COMMANDE', { align: 'center' });
    doc.moveDown();
    // Infos commande
    doc.fontSize(10).font('Helvetica');
    doc.text(`Numéro : ${commande.numero}`, 50);
    doc.text(`Date : ${new Date(commande.date).toLocaleDateString('fr-FR')}`);
    doc.text(`Agence : ${commande.agence?.nom || ''}`);
    doc.text(`Mode de paiement : ${commande.modePaiement === 'ESPECES' ? 'Espèces' : 'Crédit'}`);
    doc.moveDown();
    // Infos client
    doc.font('Helvetica-Bold').text('CLIENT :');
    doc.font('Helvetica');
    doc.text(`Nom : ${commande.client?.nom || ''}`);
    doc.text(`Téléphone : ${commande.client?.telephone || ''}`);
    if (commande.adresseLivraison)
        doc.text(`Adresse livraison : ${commande.adresseLivraison}`);
    doc.moveDown();
    // Tableau des articles
    doc.font('Helvetica-Bold').text('ARTICLES COMMANDÉS :');
    doc.moveDown(0.5);
    // En-tête tableau
    const colX = [50, 200, 320, 400, 480];
    doc.font('Helvetica-Bold').fontSize(9);
    doc.text('Fruit', colX[0], doc.y, { width: 140 });
    doc.text('Calibre', colX[1], doc.y - 12, { width: 110 });
    doc.text('Qté', colX[2], doc.y - 12, { width: 70 });
    doc.text('Prix unit.', colX[3], doc.y - 12, { width: 80 });
    doc.text('Sous-total', colX[4], doc.y - 12, { width: 80 });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    // Lignes
    doc.font('Helvetica').fontSize(9);
    for (const ligne of commande.lignes || []) {
        const y = doc.y;
        doc.text(ligne.fruit?.nom || '', colX[0], y, { width: 140 });
        doc.text(ligne.calibre?.valeur || '', colX[1], y, { width: 110 });
        doc.text(`${ligne.quantite}`, colX[2], y, { width: 70 });
        doc.text(`${Number(ligne.prixUnitaire).toLocaleString()} FCFA`, colX[3], y, { width: 80 });
        doc.text(`${Number(ligne.sousTotal).toLocaleString()} FCFA`, colX[4], y, { width: 80 });
        doc.moveDown();
    }
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    // Total
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`MONTANT TOTAL : ${Number(commande.montantTotal).toLocaleString()} FCFA`, { align: 'right' });
    doc.moveDown(2);
    // Signatures
    doc.fontSize(10).font('Helvetica');
    doc.text('Signature Client :', 50, doc.y);
    doc.text('Signature Secrétaire :', 350, doc.y - 12);
    doc.moveDown(3);
    doc.moveTo(50, doc.y).lineTo(200, doc.y).stroke();
    doc.moveTo(350, doc.y).lineTo(500, doc.y).stroke();
    doc.end();
}
//# sourceMappingURL=pdf.service.js.map