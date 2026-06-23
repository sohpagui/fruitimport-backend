// ============================================================
// FICHIER : src/types/index.ts
// Rôle : Définit les types TypeScript partagés dans tout
//        le projet. TypeScript utilise ces types pour
//        vérifier que le code est correct avant l'exécution.
// ============================================================

import { Role } from '@prisma/client'

// Type pour le payload stocké dans le token JWT
// C'est ce qu'on "lit" quand on vérifie un token
export interface JwtPayload {
  id: number           // ID de l'utilisateur ou client
  role: Role | 'CLIENT_PARTICULIER' | 'CLIENT_SUPERMARCHE'
  agenceId: number | null
  isClient: boolean    // true = client externe, false = employé
}

// Extension de Request Express pour ajouter l'utilisateur connecté
// Après le middleware d'auth, req.user est disponible partout
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

// Réponse standard de l'API
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Paramètres de pagination
export interface PaginationParams {
  page: number
  limit: number
  skip: number
}
