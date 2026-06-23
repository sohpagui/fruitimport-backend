// ============================================================
// FICHIER : src/middlewares/validate.middleware.ts
// Rôle : Valide les données envoyées par le client
//        avec les schémas Zod avant d'appeler le controller.
//
// Zod est une librairie de validation. On définit la forme
// attendue des données et Zod vérifie automatiquement.
// Si une donnée est invalide → erreur 400 avec détails.
// ============================================================

import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { repondreErreur } from '../utils/response'

export function valider(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse et valide le body de la requête
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Formate les erreurs Zod pour les rendre lisibles
        const erreurs = error.errors.map((e) => ({
          champ: e.path.join('.'),
          message: e.message,
        }))
        return repondreErreur(res, 'Données invalides.', 400, erreurs)
      }
      next(error)
    }
  }
}
