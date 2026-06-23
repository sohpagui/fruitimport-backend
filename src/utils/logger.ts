// ============================================================
// FICHIER : src/utils/logger.ts
// Rôle : Journalise les événements du serveur.
//        Winston écrit les logs dans la console ET dans
//        des fichiers (logs/error.log, logs/combined.log)
// ============================================================

import winston from 'winston'
import path from 'path'

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Affiche dans la console en développement
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Fichier pour les erreurs seulement
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    // Fichier pour tous les logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  ],
})

export default logger
