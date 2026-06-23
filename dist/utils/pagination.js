"use strict";
// ============================================================
// FICHIER : src/utils/pagination.ts
// Rôle : Gère la pagination des listes.
//        Ex: GET /commandes?page=2&limit=20
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = getPagination;
exports.formatPagination = formatPagination;
function getPagination(req) {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
function formatPagination(total, params) {
    return {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
        hasNext: params.skip + params.limit < total,
        hasPrev: params.page > 1,
    };
}
//# sourceMappingURL=pagination.js.map