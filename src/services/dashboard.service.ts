// ============================================================
// FICHIER : src/services/dashboard.service.ts
// Rôle : Logique métier du dashboard.
//        Orchestre les appels au repository et formate
//        les données pour le controller.
// ============================================================

import {
  statsGlobales,
  ventesSetDernierJours,
  ventesParFruit,
  statsParAgence,
  genererSynthese,
} from '../repositories/dashboard.repository'

// ── Dashboard PDG : vue globale des deux agences
export async function obtenirDashboardPDG() {
  const [stats, ventesGraphique, topFruits, syntheseDouala, syntheseYaounde, phrases] =
    await Promise.all([
      statsGlobales(),
      ventesSetDernierJours(),
      ventesParFruit(),
      statsParAgence(1), // Douala
      statsParAgence(2), // Yaoundé
      genererSynthese(1, 2),
    ])

  // Déterminer la meilleure agence du jour
  const meilleureAgence =
    syntheseDouala.ventesJour.montant >= syntheseYaounde.ventesJour.montant
      ? 'DOUALA'
      : 'YAOUNDE'

  return {
    kpis: {
      ventesTotalesJour: stats.ventesJour.montant,
      nbCommandesJour: stats.ventesJour.nbCommandes,
      pertesJour: stats.pertesJour,
      creancesTotales: stats.creances,
    },
    comparaison: {
      douala: syntheseDouala,
      yaounde: syntheseYaounde,
      meilleureAgence,
    },
    graphiqueVentes: ventesGraphique,
    topFruits,
    alertes: stats.alertes,
    synthese: phrases,
  }
}

// ── Dashboard par agence (secrétaire, magasinier)
export async function obtenirDashboardAgence(agenceId: number) {
  return statsParAgence(agenceId)
}
