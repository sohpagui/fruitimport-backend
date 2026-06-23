// ============================================================
// FICHIER : src/utils/response.ts
// Rôle : Fonctions utilitaires pour envoyer des réponses
//        HTTP standardisées depuis tous les controllers.
// ============================================================

import { Response } from 'express'

// Réponse de succès (200 ou 201)
export function repondreSucces(
  res: Response,
  data: any,
  message?: string,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

// Réponse d'erreur
export function repondreErreur(
  res: Response,
  message: string,
  statusCode: number = 400,
  details?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: details,
  })
}
