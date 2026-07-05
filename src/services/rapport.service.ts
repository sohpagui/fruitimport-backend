import PDFDocument from 'pdfkit'
import prisma from '../lib/prisma'
import cloudinary from '../lib/cloudinary'

export async function genererRapportJournalier(): Promise<string> {
  const aujourd_hui = new Date()
  aujourd_hui.setHours(0, 0, 0, 0)
  const demain = new Date(aujourd_hui)
  demain.setDate(demain.getDate() + 1)

  // Recuperer toutes les donnees des 2 agences
  const [agences, commandesJour, livraisonsJour, pertes, alertesStock, clientsRetard] = await Promise.all([
    prisma.agence.findMany(),
    prisma.commande.findMany({
      where: { date: { gte: aujourd_hui, lt: demain } },
      include: { client: true, agence: true, lignes: { include: { fruit: true } } }
    }),
    prisma.livraison.findMany({
      where: { dateAssignation: { gte: aujourd_hui, lt: demain } },
      include: { commande: { include: { client: true } }, livreur: true }
    }),
    prisma.perte.findMany({
      where: { date: { gte: aujourd_hui, lt: demain } },
      include: { fruit: true, agence: true }
    }),
    prisma.stock.findMany({
      where: { quantiteCartons: { lte: 5 } },
      include: { fruit: true, agence: true, calibre: true }
    }),
    prisma.client.findMany({
      where: { statutCredit: 'EN_RETARD' },
      include: { agence: true }
    })
  ])

  const totalVentes = commandesJour.reduce((sum, c) => sum + Number(c.montantTotal), 0)
  const totalPertes = pertes.reduce((sum, p) => sum + Number(p.valeurPerdue), 0)

  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks)
        const b64 = buffer.toString('base64')
        const dataURI = `data:application/pdf;base64,${b64}`
        const dateStr = aujourd_hui.toISOString().split('T')[0]
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'fruitimport/rapports',
          public_id: `rapport_${dateStr}`,
          overwrite: true,
          resource_type: 'raw'
        })
        // Sauvegarder l URL dans les parametres
        await prisma.parametreSysteme.upsert({
          where: { cle: 'dernier_rapport_url' },
          update: { valeur: result.secure_url },
          create: { cle: 'dernier_rapport_url', valeur: result.secure_url }
        })
        await prisma.parametreSysteme.upsert({
          where: { cle: 'dernier_rapport_date' },
          update: { valeur: dateStr },
          create: { cle: 'dernier_rapport_date', valeur: dateStr }
        })
        resolve(result.secure_url)
      } catch (e) { reject(e) }
    })

    // En-tete
    doc.fontSize(20).font('Helvetica-Bold').text('EST. RENE - FRUITIMPORT CAMEROUN', { align: 'center' })
    doc.fontSize(14).font('Helvetica').text(`RAPPORT JOURNALIER DU ${aujourd_hui.toLocaleDateString('fr-FR')}`, { align: 'center' })
    doc.moveDown()
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Résumé exécutif
    doc.fontSize(14).font('Helvetica-Bold').text('RÉSUMÉ EXÉCUTIF')
    doc.moveDown(0.5)
    doc.fontSize(11).font('Helvetica')
    doc.text(`Total des ventes du jour : ${totalVentes.toLocaleString()} FCFA`)
    doc.text(`Nombre de commandes : ${commandesJour.length}`)
    doc.text(`Nombre de livraisons : ${livraisonsJour.length}`)
    doc.text(`Total des pertes : ${totalPertes.toLocaleString()} FCFA`)
    doc.text(`Clients en retard : ${clientsRetard.length}`)
    doc.text(`Stocks bas : ${alertesStock.length}`)
    doc.moveDown()

    // Commandes par agence
    doc.fontSize(14).font('Helvetica-Bold').text('COMMANDES DU JOUR')
    doc.moveDown(0.5)
    agences.forEach(agence => {
      const cmdsAgence = commandesJour.filter(c => c.agenceId === agence.id)
      const totalAgence = cmdsAgence.reduce((sum, c) => sum + Number(c.montantTotal), 0)
      doc.fontSize(12).font('Helvetica-Bold').text(`${agence.nom} (${agence.ville}) - ${cmdsAgence.length} commandes - ${totalAgence.toLocaleString()} FCFA`)
      doc.fontSize(10).font('Helvetica')
      cmdsAgence.forEach(cmd => {
        doc.text(`  • ${cmd.numero} - ${cmd.client?.nom || ''} - ${Number(cmd.montantTotal).toLocaleString()} FCFA - ${cmd.statut}`)
      })
      if (cmdsAgence.length === 0) doc.text('  Aucune commande aujourd hui.')
      doc.moveDown(0.5)
    })

    // Livraisons
    doc.addPage()
    doc.fontSize(14).font('Helvetica-Bold').text('LIVRAISONS DU JOUR')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')
    livraisonsJour.forEach(liv => {
      doc.text(`• Livraison #${liv.id} - ${liv.commande?.client?.nom || ''} - Livreur: ${liv.livreur?.nom || ''} - ${liv.statut}`)
    })
    if (livraisonsJour.length === 0) doc.text('Aucune livraison aujourd hui.')
    doc.moveDown()

    // Pertes
    doc.fontSize(14).font('Helvetica-Bold').text('PERTES ENREGISTREES')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')
    pertes.forEach(p => {
      doc.text(`• ${p.fruit?.nom || ''} - ${p.agence?.nom || ''} - ${p.quantite} cartons - ${Number(p.valeurPerdue).toLocaleString()} FCFA `)
    })
    if (pertes.length === 0) doc.text('Aucune perte enregistree aujourd hui.')
    doc.moveDown()

    // Stocks bas
    doc.fontSize(14).font('Helvetica-Bold').text('ALERTES STOCK BAS')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')
    alertesStock.forEach(s => {
      doc.text(`• ${s.fruit?.nom || ''} - Calibre ${s.calibre?.valeur || ''} - ${s.agence?.nom || ''} - ${s.quantiteCartons} cartons restants`)
    })
    if (alertesStock.length === 0) doc.text('Aucun stock bas.')
    doc.moveDown()

    // Clients en retard
    doc.fontSize(14).font('Helvetica-Bold').text('CLIENTS EN RETARD DE PAIEMENT')
    doc.moveDown(0.5)
    doc.fontSize(10).font('Helvetica')
    clientsRetard.forEach(c => {
      doc.text(`• ${c.nom} - ${c.agence?.nom || ''} - Dette: ${Number(c.creditUtilise).toLocaleString()} FCFA / Limite: ${Number(c.limiteCredit).toLocaleString()} FCFA`)
    })
    if (clientsRetard.length === 0) doc.text('Aucun client en retard.')
    doc.moveDown()

    doc.fontSize(10).font('Helvetica').fillColor('gray')
    doc.text(`Rapport genere automatiquement le ${new Date().toLocaleString('fr-FR')}`, { align: 'center' })

    doc.end()
  })
}
