// ============================================================
// FICHIER : src/repositories/auth.repository.ts
// Rôle : Accès à la base de données pour l'authentification.
//        Le repository est la SEULE couche qui parle à Prisma.
//        Les services appellent le repository, jamais Prisma directement.
//
// Architecture en couches :
// Route → Controller → Service → Repository → Prisma → MySQL
// ============================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
