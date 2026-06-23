// ============================================================
// FICHIER : prisma/seed.ts
// Rôle : Insère les données de démonstration dans la BD.
//        Lance avec : npm run prisma:seed
// ============================================================

import { PrismaClient, Role, NomAgence, Origine, TypeClient, StatutCredit } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // ── 1. AGENCES
  console.log('📍 Création des agences...')
  const douala = await prisma.agence.upsert({
    where: { nom: NomAgence.DOUALA },
    update: {},
    create: {
      nom: NomAgence.DOUALA,
      ville: 'Douala',
      adresse: 'Rue de la Bonne Graine, Akwa, Douala',
      telephone: '+237 233 000 001',
    },
  })

  const yaounde = await prisma.agence.upsert({
    where: { nom: NomAgence.YAOUNDE },
    update: {},
    create: {
      nom: NomAgence.YAOUNDE,
      ville: 'Yaoundé',
      adresse: 'Avenue Kennedy, Bastos, Yaoundé',
      telephone: '+237 222 000 001',
    },
  })

  console.log(`  ✓ ${douala.nom} (id: ${douala.id})`)
  console.log(`  ✓ ${yaounde.nom} (id: ${yaounde.id})`)

  // ── 2. MOT DE PASSE PAR DÉFAUT
  // En production, chaque employé devra changer son mot de passe
  const mdpHash = await bcrypt.hash('FruitImport2024!', 12)
  const mdpClientHash = await bcrypt.hash('Client2024!', 12)

  // ── 3. PDG
  console.log('👤 Création du PDG...')
  const pdg = await prisma.user.upsert({
    where: { telephone: '+237 690 000 001' },
    update: {},
    create: {
      nom: 'François Nkeng',
      telephone: '+237 690 000 001',
      email: 'pdg@fruitimport-cm.com',
      motDePasseHash: mdpHash,
      role: Role.PDG,
      agenceId: null,  // Le PDG supervise les deux agences
    },
  })
  console.log(`  ✓ PDG : ${pdg.nom}`)

  // ── 4. EMPLOYÉS
  console.log('👥 Création des employés...')

  // Secrétaires
  const secretaireDouala = await prisma.user.upsert({
    where: { telephone: '+237 690 000 002' },
    update: {},
    create: {
      nom: 'Marie Bello',
      telephone: '+237 690 000 002',
      email: 'secretaire.douala@fruitimport-cm.com',
      motDePasseHash: mdpHash,
      role: Role.SECRETAIRE,
      agenceId: douala.id,
      creePar: pdg.id,
    },
  })

  const secretaireYaounde = await prisma.user.upsert({
    where: { telephone: '+237 690 000 003' },
    update: {},
    create: {
      nom: 'Célestine Mvondo',
      telephone: '+237 690 000 003',
      email: 'secretaire.yaounde@fruitimport-cm.com',
      motDePasseHash: mdpHash,
      role: Role.SECRETAIRE,
      agenceId: yaounde.id,
      creePar: pdg.id,
    },
  })

  // Magasiniers
  const magasinierDouala = await prisma.user.upsert({
    where: { telephone: '+237 690 000 004' },
    update: {},
    create: {
      nom: 'Jean-Pierre Fouda',
      telephone: '+237 690 000 004',
      motDePasseHash: mdpHash,
      role: Role.MAGASINIER,
      agenceId: douala.id,
      creePar: pdg.id,
    },
  })

  const magasinierYaounde = await prisma.user.upsert({
    where: { telephone: '+237 690 000 005' },
    update: {},
    create: {
      nom: 'Paul Essama',
      telephone: '+237 690 000 005',
      motDePasseHash: mdpHash,
      role: Role.MAGASINIER,
      agenceId: yaounde.id,
      creePar: pdg.id,
    },
  })

  // Livreurs
  const livreurDouala = await prisma.user.upsert({
    where: { telephone: '+237 690 000 006' },
    update: {},
    create: {
      nom: 'Serge Mbida',
      telephone: '+237 690 000 006',
      motDePasseHash: mdpHash,
      role: Role.LIVREUR,
      agenceId: douala.id,
      creePar: pdg.id,
    },
  })

  const livreurYaounde = await prisma.user.upsert({
    where: { telephone: '+237 690 000 007' },
    update: {},
    create: {
      nom: 'André Owona',
      telephone: '+237 690 000 007',
      motDePasseHash: mdpHash,
      role: Role.LIVREUR,
      agenceId: yaounde.id,
      creePar: pdg.id,
    },
  })

  console.log('  ✓ 2 secrétaires, 2 magasiniers, 2 livreurs créés')

  // ── 5. FRUITS ET CALIBRES
  console.log('🍎 Création des fruits et calibres...')

  const fruits = [
    {
      nom: 'Pomme Rouge',
      uniteMesure: 'carton',
      calibres: ['100', '113', '125', '138'],
    },
    {
      nom: 'Pomme Verte',
      uniteMesure: 'carton',
      calibres: ['100', '113', '125'],
    },
    {
      nom: 'Raisin Rouge',
      uniteMesure: 'carton',
      calibres: ['4.5kg', '8.5kg'],
    },
    {
      nom: 'Raisin Blanc',
      uniteMesure: 'carton',
      calibres: ['4.5kg', '8.5kg'],
    },
    {
      nom: 'Clémentine',
      uniteMesure: 'carton',
      calibres: ['cal.1', 'cal.2', 'cal.3', 'cal.4'],
    },
    {
      nom: 'Poire',
      uniteMesure: 'carton',
      calibres: ['60/65', '65/70', '70/75'],
    },
    {
      nom: 'Kiwi',
      uniteMesure: 'carton',
      calibres: ['cal.25', 'cal.30', 'cal.36'],
    },
    {
      nom: 'Orange',
      uniteMesure: 'carton',
      calibres: ['cal.72', 'cal.88', 'cal.100'],
    },
  ]

  const fruitsCreees: Record<string, any> = {}

  for (const fruitData of fruits) {
    const fruit = await prisma.fruit.upsert({
      where: { nom: fruitData.nom },
      update: {},
      create: {
        nom: fruitData.nom,
        uniteMesure: fruitData.uniteMesure,
        calibres: {
          create: fruitData.calibres.map((valeur, index) => ({
            valeur,
            ordreAffichage: index,
          })),
        },
      },
      include: { calibres: true },
    })
    fruitsCreees[fruitData.nom] = fruit
    console.log(`  ✓ ${fruit.nom} (${fruit.calibres.length} calibres)`)
  }

  // ── 6. STOCKS DE DÉPART
  console.log('📦 Création des stocks initiaux...')

  // Pomme Rouge - Douala
  const pommeRouge = fruitsCreees['Pomme Rouge']
  for (const calibre of pommeRouge.calibres) {
    await prisma.stock.upsert({
      where: {
        agenceId_fruitId_calibreId_origine_categorie: {
          agenceId: douala.id,
          fruitId: pommeRouge.id,
          calibreId: calibre.id,
          origine: Origine.MAROC,
          categorie: 'NORMAL',
        },
      },
      update: {},
      create: {
        agenceId: douala.id,
        fruitId: pommeRouge.id,
        calibreId: calibre.id,
        origine: Origine.MAROC,
        categorie: 'NORMAL',
        quantiteCartons: Math.floor(Math.random() * 50) + 20,
        prixUnitaire: 8500,
      },
    })
  }

  // Kiwi - Douala (stock bas pour tester les alertes)
  const kiwi = fruitsCreees['Kiwi']
  await prisma.stock.upsert({
    where: {
      agenceId_fruitId_calibreId_origine_categorie: {
        agenceId: douala.id,
        fruitId: kiwi.id,
        calibreId: kiwi.calibres[0].id,
        origine: Origine.AFRIQUE_DU_SUD,
        categorie: 'NORMAL',
      },
    },
    update: {},
    create: {
      agenceId: douala.id,
      fruitId: kiwi.id,
      calibreId: kiwi.calibres[0].id,
      origine: Origine.AFRIQUE_DU_SUD,
      categorie: 'NORMAL',
      quantiteCartons: 3,  // Stock bas exprès pour tester l'alerte
      prixUnitaire: 12000,
    },
  })

  // Orange - Yaoundé
  const orange = fruitsCreees['Orange']
  for (const calibre of orange.calibres) {
    await prisma.stock.upsert({
      where: {
        agenceId_fruitId_calibreId_origine_categorie: {
          agenceId: yaounde.id,
          fruitId: orange.id,
          calibreId: calibre.id,
          origine: Origine.MAROC,
          categorie: 'NORMAL',
        },
      },
      update: {},
      create: {
        agenceId: yaounde.id,
        fruitId: orange.id,
        calibreId: calibre.id,
        origine: Origine.MAROC,
        categorie: 'NORMAL',
        quantiteCartons: Math.floor(Math.random() * 40) + 10,
        prixUnitaire: 6500,
      },
    })
  }

  console.log('  ✓ Stocks créés (dont 1 stock bas pour tester les alertes)')

  // ── 7. CLIENTS DE DÉMONSTRATION
  console.log('🛒 Création des clients...')

  const supermarche1 = await prisma.client.upsert({
    where: { telephone: '+237 233 100 001' },
    update: {},
    create: {
      nom: 'Supermarché Mahima Douala',
      type: TypeClient.SUPERMARCHE,
      agenceId: douala.id,
      telephone: '+237 233 100 001',
      email: 'achats@mahima-douala.cm',
      adresse: 'Boulevard de la Liberté, Douala',
      motDePasseHash: mdpClientHash,
      limiteCredit: 500000,  // 500 000 FCFA de limite crédit
      creditUtilise: 380000, // Déjà 380 000 utilisés → à relancer
      statutCredit: StatutCredit.A_RELANCER,
    },
  })

  const supermarche2 = await prisma.client.upsert({
    where: { telephone: '+237 222 200 001' },
    update: {},
    create: {
      nom: 'Shop & Go Yaoundé',
      type: TypeClient.SUPERMARCHE,
      agenceId: yaounde.id,
      telephone: '+237 222 200 001',
      email: 'commandes@shopgo-yaounde.cm',
      adresse: 'Rue Nachtigal, Centre, Yaoundé',
      motDePasseHash: mdpClientHash,
      limiteCredit: 300000,
      creditUtilise: 450000, // Dépasse la limite → EN_RETARD
      statutCredit: StatutCredit.EN_RETARD,
    },
  })

  const particulier1 = await prisma.client.upsert({
    where: { telephone: '+237 677 000 001' },
    update: {},
    create: {
      nom: 'Sylvie Atangana',
      type: TypeClient.PARTICULIER,
      agenceId: yaounde.id,
      telephone: '+237 677 000 001',
      adresse: 'Quartier Bastos, Yaoundé',
      motDePasseHash: mdpClientHash,
      limiteCredit: 0,
      creditUtilise: 0,
      statutCredit: StatutCredit.EN_REGLE,
    },
  })

  const particulier2 = await prisma.client.upsert({
    where: { telephone: '+237 655 000 002' },
    update: {},
    create: {
      nom: 'Robert Tchamba',
      type: TypeClient.PARTICULIER,
      agenceId: douala.id,
      telephone: '+237 655 000 002',
      adresse: 'Bonamoussadi, Douala',
      motDePasseHash: mdpClientHash,
      limiteCredit: 0,
      creditUtilise: 0,
      statutCredit: StatutCredit.EN_REGLE,
    },
  })

  console.log('  ✓ 2 supermarchés (dont 1 en retard, 1 à relancer)')
  console.log('  ✓ 2 particuliers')

  // ── 8. RÉSUMÉ FINAL
  console.log('\n✅ Seed terminé avec succès !')
  console.log('\n📋 Comptes de connexion :')
  console.log('─────────────────────────────────────────────')
  console.log('PDG           : +237 690 000 001 / FruitImport2024!')
  console.log('Secrétaire Douala  : +237 690 000 002 / FruitImport2024!')
  console.log('Secrétaire Yaoundé : +237 690 000 003 / FruitImport2024!')
  console.log('Magasinier Douala  : +237 690 000 004 / FruitImport2024!')
  console.log('Magasinier Yaoundé : +237 690 000 005 / FruitImport2024!')
  console.log('Livreur Douala     : +237 690 000 006 / FruitImport2024!')
  console.log('Livreur Yaoundé    : +237 690 000 007 / FruitImport2024!')
  console.log('─────────────────────────────────────────────')
  console.log('Client Supermarché : +237 233 100 001 / Client2024!')
  console.log('Client Particulier : +237 677 000 001 / Client2024!')
  console.log('─────────────────────────────────────────────')
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
