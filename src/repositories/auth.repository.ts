// ============================================================
// FICHIER : src/repositories/auth.repository.ts
// Rôle : Accès à la base de données pour l'authentification.
//        Le repository est la SEULE couche qui parle à Prisma.
//        Les services appellent le repository, jamais Prisma directement.
//
// Architecture en couches :
// Route → Controller → Service → Repository → Prisma → MySQL
// ============================================================

import { } from '@prisma/client'
import prisma from '../lib/prisma'


// Trouve un employé par téléphone ou email
export async function trouverUserParIdentifiant(identifiant: string) {
  return prisma.user.findFirst({
    where: {
      OR: [
        { telephone: identifiant },
        { email: identifiant },
      ],
      actif: true,
    },
    include: {
      agence: {
        select: { id: true, nom: true, ville: true },
      },
    },
  })
}

// Trouve un client par téléphone ou email
export async function trouverClientParIdentifiant(identifiant: string) {
  return prisma.client.findFirst({
    where: {
      OR: [
        { telephone: identifiant },
        { email: identifiant },
      ],
      actif: true,
    },
    include: {
      agence: {
        select: { id: true, nom: true, ville: true },
      },
    },
  })
}

// Crée un nouveau compte client (auto-inscription)
export async function creerClient(data: {
  nom: string
  type: 'PARTICULIER' | 'SUPERMARCHE'
  agenceId: number
  telephone: string
  email?: string
  adresse?: string
  motDePasseHash: string
}) {
  return prisma.client.create({
    data,
    include: {
      agence: {
        select: { id: true, nom: true, ville: true },
      },
    },
  })
}

// Vérifie qu'un téléphone n'est pas déjà utilisé (user ou client)
export async function telephoneExiste(telephone: string) {
  const user = await prisma.user.findUnique({ where: { telephone } })
  const client = await prisma.client.findUnique({ where: { telephone } })
  return !!(user || client)
}

// Vérifie qu'un email n'est pas déjà utilisé
export async function emailExiste(email: string) {
  const user = await prisma.user.findFirst({ where: { email } })
  const client = await prisma.client.findFirst({ where: { email } })
  return !!(user || client)
}

// ── Enregistrer une tentative de connexion
export async function enregistrerConnexion(userId: number, succes: boolean, ip?: string, userAgent?: string) {
  await prisma.historiqueConnexion.create({
    data: { userId, succes, ipAddress: ip, userAgent }
  })
  if (succes) {
    await prisma.user.update({
      where: { id: userId },
      data: { tentativesEchouees: 0, bloqueJusquA: null, derniereCo: new Date() }
    })
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return
    const tentatives = user.tentativesEchouees + 1
    const bloque = tentatives >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null
    await prisma.user.update({
      where: { id: userId },
      data: { tentativesEchouees: tentatives, bloqueJusquA: bloque }
    })
  }
}

// ── Vérifier si un compte est bloqué
export async function estBloque(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.bloqueJusquA) return false
  if (user.bloqueJusquA > new Date()) return true
  await prisma.user.update({ where: { id: userId }, data: { bloqueJusquA: null, tentativesEchouees: 0 } })
  return false
}

// ── Changer le mot de passe
export async function changerMotDePasse(userId: number, nouveauHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { motDePasseHash: nouveauHash }
  })
}

// ── Historique des connexions d'un utilisateur
export async function obtenirHistoriqueConnexions(userId: number) {
  return prisma.historiqueConnexion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
}
