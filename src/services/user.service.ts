// ============================================================
// FICHIER : src/services/user.service.ts
// Rôle : Logique métier pour la gestion des employés.
// ============================================================

import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import {
  listerUsers,
  creerUser,
  trouverUserParId,
  mettreAJourUser,
  desactiverUser,
  loggerAction,
} from '../repositories/user.repository'
import {
  telephoneExiste,
  emailExiste,
} from '../repositories/auth.repository'
import { PaginationParams } from '../types'

// Rôles qui ne peuvent pas être créés par le PDG
// (les clients s'auto-inscrivent séparément)
const ROLES_EMPLOYES = [
  Role.SECRETAIRE,
  Role.MAGASINIER,
  Role.LIVREUR,
]

// ── Créer un compte employé (PDG uniquement)
export async function creerCompteEmploye(
  data: {
    nom: string
    telephone: string
    email?: string
    motDePasse: string
    role: Role
    agenceId?: number
  },
  creePar: number
) {
  // 1. Vérifie que le rôle est un rôle d'employé
  if (!ROLES_EMPLOYES.includes(data.role)) {
    throw new Error('Rôle invalide. Seuls SECRETAIRE, MAGASINIER et LIVREUR sont autorisés.')
  }

  // 2. Les secrétaires, magasiniers et livreurs doivent avoir une agence
  if (!data.agenceId) {
    throw new Error('Une agence est requise pour ce rôle.')
  }

  // 3. Vérifie l'unicité du téléphone
  const telExiste = await telephoneExiste(data.telephone)
  if (telExiste) {
    throw new Error('Ce numéro de téléphone est déjà utilisé.')
  }

  // 4. Vérifie l'unicité de l'email
  if (data.email) {
    const mailExiste = await emailExiste(data.email)
    if (mailExiste) {
      throw new Error('Cette adresse email est déjà utilisée.')
    }
  }

  // 5. Hashe le mot de passe (le PDG définit le mdp, l'employé ne peut pas le changer)
  const motDePasseHash = await bcrypt.hash(data.motDePasse, 12)

  // 6. Crée le compte
  const { motDePasse, ...donneesSansMdp } = data
  const user = await creerUser({
    ...donneesSansMdp,
    motDePasseHash,
    creePar,
  })

  // 7. Log l'action
  await loggerAction({
    userId: creePar,
    action: 'CREATION_COMPTE',
    details: JSON.stringify({ userId: user.id, role: user.role, nom: user.nom }),
  })

  return user
}

// ── Lister les employés
export async function listerEmployes(
  params: PaginationParams & { agenceId?: number; role?: Role }
) {
  return listerUsers({
    agenceId: params.agenceId,
    role: params.role,
    skip: params.skip,
    limit: params.limit,
  })
}

// ── Modifier un employé
export async function modifierEmploye(
  id: number,
  data: {
    nom?: string
    telephone?: string
    email?: string
    motDePasse?: string  // Seul le PDG peut modifier le mot de passe
    actif?: boolean
    agenceId?: number
  },
  modifiePar: { id: number; role: Role }
) {
  const user = await trouverUserParId(id)
  if (!user) {
    throw new Error('Employé introuvable.')
  }

  // Vérifier les unicités si téléphone ou email changent
  if (data.telephone && data.telephone !== user.telephone) {
    const telExiste = await telephoneExiste(data.telephone)
    if (telExiste) throw new Error('Ce téléphone est déjà utilisé.')
  }

  const miseAJour: any = {}
  if (data.nom) miseAJour.nom = data.nom
  if (data.telephone) miseAJour.telephone = data.telephone
  if (data.email) miseAJour.email = data.email
  if (data.agenceId) miseAJour.agenceId = data.agenceId
  if (typeof data.actif === 'boolean') miseAJour.actif = data.actif

  // Seul le PDG peut changer le mot de passe
  if (data.motDePasse && modifiePar.role === Role.PDG) {
    miseAJour.motDePasseHash = await bcrypt.hash(data.motDePasse, 12)
  } else if (data.motDePasse && modifiePar.role !== Role.PDG) {
    throw new Error('Seul le PDG peut modifier le mot de passe d\'un employé.')
  }

  const userMisAJour = await mettreAJourUser(id, miseAJour)

  // Log si c'est une modification importante
  if (data.motDePasse || typeof data.actif === 'boolean') {
    await loggerAction({
      userId: modifiePar.id,
      action: 'MODIFICATION_COMPTE',
      details: JSON.stringify({ userId: id, champs: Object.keys(miseAJour) }),
    })
  }

  return userMisAJour
}

// ── Obtenir un employé par ID
export async function obtenirEmploye(id: number) {
  const user = await trouverUserParId(id)
  if (!user) throw new Error('Employé introuvable.')
  return user
}
