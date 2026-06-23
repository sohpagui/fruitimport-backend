// ============================================================
// FICHIER : src/utils/pagination.ts
// Rôle : Gère la pagination des listes.
//        Ex: GET /commandes?page=2&limit=20
// ============================================================

import { Request } from 'express'
import { PaginationParams } from '../types'

export function getPagination(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function formatPagination(total: number, params: PaginationParams) {
  return {
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
    hasNext: params.skip + params.limit < total,
    hasPrev: params.page > 1,
  }
}
