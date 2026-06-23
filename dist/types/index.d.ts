import { Role } from '@prisma/client';
export interface JwtPayload {
    id: number;
    role: Role | 'CLIENT_PARTICULIER' | 'CLIENT_SUPERMARCHE';
    agenceId: number | null;
    isClient: boolean;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}
//# sourceMappingURL=index.d.ts.map