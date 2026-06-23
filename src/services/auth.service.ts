// ============================================================
// FICHIER : src/services/auth.service.ts
// Rôle : Contient la logique métier de l'authentification.
//        Le service orchestre les appels au repository
//        et applique les règles de l'entreprise.
// ============================================================

import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import {
  trouverUserParIdentifiant,
  trouverClientParIdentifiant,
  creerClient,
  telephoneExiste,
  emailExiste,
} from '../repositories/auth.repository'
import {
  genererAccessToken,
  genererRefreshToken,
  verifierRefreshToken,
} from '../utils/jwt'

// ── Connexion (employé ou client)
export async function connexion(identifiant: string, motDePasse: string) {
  // 1. Cherche d'abord dans les employés
  let utilisateur = await trouverUserParIdentifiant(identifiant)
  let isClient = false

  // 2. Si pas trouvé comme employé, cherche dans les clients
  if (!utilisateur) {
    const client = await trouverClientParIdentifiant(identifiant)
    if (!client) {
      throw new Error('Identifiant ou mot de passe incorrect.')
    }
    // @ts-ignore
    utilisateur = client
    isClient = true
  }

  // 3. Vérifie le mot de passe
  const mdpValide = await bcrypt.compare(motDePasse, utilisateur.motDePasseHash)
  if (!mdpValide) {
    throw new Error('Identifiant ou mot de passe incorrect.')
  }

  // 4. Génère les tokens JWT
  const payload = {
    id: utilisateur.id,
    role: utilisateur.role as Role,
    agenceId: utilisateur.agenceId ?? null,
    isClient,
  }

  const accessToken = genererAccessToken(payload)
  const refreshToken = genererRefreshToken(payload)

  // 5. Retourne les tokens et les infos utilisateur (sans le mot de passe)
  const { motDePasseHash, ...userSansMotDePasse } = utilisateur as any

  return {
    accessToken,
    refreshToken,
    utilisateur: {
      ...userSansMotDePasse,
      isClient,
    },
  }
}

// ── Renouvellement du token d'accès via le refresh token
export async function rafraichirToken(refreshToken: string) {
  try {
    const payload = verifierRefreshToken(refreshToken)

    const nouveauPayload = {
      id: payload.id,
      role: payload.role as Role,
      agenceId: payload.agenceId,
      isClient: payload.isClient,
    }

    const accessToken = genererAccessToken(nouveauPayload)
    return { accessToken }
  } catch {
    throw new Error('Refresh token invalide ou expiré.')
  }
}

// ── Inscription d'un nouveau client (auto-inscription)
export async function inscrireClient(data: {
  nom: string
  type: 'PARTICULIER' | 'SUPERMARCHE'
  agenceId: number
  telephone: string
  email?: string
  adresse?: string
  motDePasse: string
}) {
  // 1. Vérifie que le téléphone n'est pas déjà utilisé
  const telExiste = await telephoneExiste(data.telephone)
  if (telExiste) {
    throw new Error('Ce numéro de téléphone est déjà utilisé.')
  }

  // 2. Vérifie l'email si fourni
  if (data.email) {
    const mailExiste = await emailExiste(data.email)
    if (mailExiste) {
      throw new Error('Cette adresse email est déjà utilisée.')
    }
  }

  // 3. Hashe le mot de passe
  const motDePasseHash = await bcrypt.hash(data.motDePasse, 12)

  // 4. Crée le client
  const { motDePasse, ...donneesSansMdp } = data
  const client = await creerClient({
    ...donneesSansMdp,
    motDePasseHash,
  })

  return client
}
