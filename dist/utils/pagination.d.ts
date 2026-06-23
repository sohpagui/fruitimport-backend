import { Request } from 'express';
import { PaginationParams } from '../types';
export declare function getPagination(req: Request): PaginationParams;
export declare function formatPagination(total: number, params: PaginationParams): {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};
//# sourceMappingURL=pagination.d.ts.map