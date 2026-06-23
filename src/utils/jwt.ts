// ============================================================
// FICHIER : src/utils/jwt.ts
// Rôle : Gère la création et vérification des tokens JWT.
//
// C'est quoi JWT ?
// JWT = JSON Web Token. C'est une chaîne de caractères
// signée qui prouve qu'un utilisateur est connecté.
// Ex: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.abc123"
//
// On utilise DEUX tokens :
// - Access token  : valide 15 minutes (pour les requêtes)
// - Refresh token : valide 7 jours (pour renouveler l'access token)
// ============================================================

import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'

// Récupère les secrets depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

// Génère un access token (courte durée)
export function genererAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Génère un refresh token (longue durée)
export function genererRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Vérifie et décode un access token
export function verifierAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

// Vérifie et décode un refresh token
export function verifierRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload
}
