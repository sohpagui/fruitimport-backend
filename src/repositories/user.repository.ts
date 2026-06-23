// ============================================================
// FICHIER : src/repositories/user.repository.ts
// Rôle : Accès BD pour la gestion des utilisateurs (employés).
// ============================================================

import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

// Liste tous les employés (avec filtres optionnels)
export async function listerUsers(params: {
  agenceId?: number
  role?: Role
  skip: number
  limit: number
}) {
  const where: any = { actif: true }
  if (params.agenceId) where.agenceId = params.agenceId
  if (params.role) where.role = params.role

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: params.skip,
      take: params.limit,
      select: {
        id: true,
        nom: true,
        telephone: true,
        email: true,
        role: true,
        actif: true,
        createdAt: true,
        agence: { select: { id: true, nom: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return { users, total }
}

// Trouve un employé par ID
export async function trouverUserParId(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nom: true,
      telephone: true,
      email: true,
      role: true,
      agenceId: true,
      actif: true,
      createdAt: true,
      agence: { select: { id: true, nom: true } },
    },
  })
}

// Crée un compte employé (PDG uniquement)
export async function creerUser(data: {
  nom: string
  telephone: string
  email?: string
  motDePasseHash: string
  role: Role
  agenceId?: number
  creePar: number
}) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      nom: true,
      telephone: true,
      email: true,
      role: true,
      agenceId: true,
      createdAt: true,
      agence: { select: { id: true, nom: true } },
    },
  })
}

// Met à jour les infos d'un employé
export async function mettreAJourUser(
  id: number,
  data: Partial<{
    nom: string
    telephone: string
    email: string
    motDePasseHash: string
    actif: boolean
    agenceId: number
  }>
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      nom: true,
      telephone: true,
      email: true,
      role: true,
      agenceId: true,
      actif: true,
    },
  })
}

// Désactive un compte employé (soft delete)
export async function desactiverUser(id: number) {
  return prisma.user.update({
    where: { id },
    data: { actif: false },
  })
}

// Enregistre une action dans les logs
export async function loggerAction(data: {
  userId: number
  action: string
  details?: string
  ipAddress?: string
}) {
  return prisma.logAction.create({ data })
}
