// ============================================================
// FICHIER : src/middlewares/auth.middleware.ts
// Rôle : Middleware d'authentification.
//
// C'est quoi un middleware ?
// C'est une fonction qui s'exécute AVANT le controller.
// Elle vérifie le token JWT dans le header de la requête.
// Si le token est valide → req.user est rempli → on continue.
// Sinon → on retourne une erreur 401.
//
// Usage dans les routes :
// router.get('/commandes', authentifier, controller.lister)
// ============================================================

import { Request, Response, NextFunction } from 'express'
import { verifierAccessToken } from '../utils/jwt'
import { repondreErreur } from '../utils/response'
import { Role } from '@prisma/client'

// Vérifie que l'utilisateur est connecté (token valide)
export function authentifier(req: Request, res: Response, next: NextFunction) {
  // Le token est envoyé dans le header : Authorization: Bearer <token>
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return repondreErreur(res, 'Token manquant. Veuillez vous connecter.', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifierAccessToken(token)
    req.user = payload  // On attache l'utilisateur à la requête
    next()              // On passe au controller suivant
  } catch (error) {
    return repondreErreur(res, 'Token invalide ou expiré.', 401)
  }
}

// Vérifie que l'utilisateur a un des rôles autorisés
// Usage : autoriser(Role.PDG, Role.SECRETAIRE)
export function autoriser(...rolesAutorises: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return repondreErreur(res, 'Non authentifié.', 401)
    }

    if (!rolesAutorises.includes(req.user.role)) {
      return repondreErreur(
        res,
        `Accès refusé. Rôle requis : ${rolesAutorises.join(' ou ')}.`,
        403
      )
    }

    next()
  }
}

// Vérifie que l'employé accède uniquement à son agence
// Le PDG peut accéder à toutes les agences
export function verifierAgence(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return repondreErreur(res, 'Non authentifié.', 401)
  }

  // Le PDG n'a pas de restriction d'agence
  if (req.user.role === Role.PDG) {
    return next()
  }

  // Pour les autres rôles, vérifier que l'agence_id dans la requête
  // correspond à celle de l'employé connecté
  const agenceIdDemandee = parseInt(
    (req.query.agence_id || req.params.agenceId || req.body.agenceId) as string
  )

  if (agenceIdDemandee && agenceIdDemandee !== req.user.agenceId) {
    return repondreErreur(
      res,
      'Vous ne pouvez accéder qu\'aux données de votre agence.',
      403
    )
  }

  next()
}
