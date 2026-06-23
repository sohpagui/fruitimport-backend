// ============================================================
// FICHIER : src/middlewares/logger.middleware.ts
// Rôle : Journalise chaque requête HTTP reçue par le serveur.
//        Utile pour déboguer et surveiller l'activité.
// ============================================================

import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const debut = Date.now()

  res.on('finish', () => {
    const duree = Date.now() - debut
    logger.info(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duree}ms)`)
  })

  next()
}
