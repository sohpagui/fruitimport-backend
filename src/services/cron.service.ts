import cron from 'node-cron'
import { genererRapportJournalier } from './rapport.service'

export function demarrerCron() {
  // Chaque jour a 22h00
  cron.schedule('0 22 * * *', async () => {
    console.log('Generation du rapport journalier...')
    try {
      const url = await genererRapportJournalier()
      console.log('Rapport genere:', url)
    } catch (e) {
      console.error('Erreur rapport:', e)
    }
  }, { timezone: 'Africa/Douala' })

  console.log('Cron planifie: rapport journalier a 22h00')
}
