import { Role } from '@prisma/client';
import { PaginationParams } from '../types';
export declare function creerCompteEmploye(data: {
    nom: string;
    telephone: string;
    email?: string;
    motDePasse: string;
    role: Role;
    agenceId?: number;
}, creePar: number): Promise<{
    id: number;
    nom: string;
    telephone: string;
    email: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number;
    createdAt: Date;
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
}>;
export declare function listerEmployes(params: PaginationParams & {
    agenceId?: number;
    role?: Role;
}): Promise<{
    users: {
        id: number;
        nom: string;
        telephone: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        actif: boolean;
        createdAt: Date;
        agence: {
            id: number;
            nom: import(".prisma/client").$Enums.NomAgence;
        };
    }[];
    total: number;
}>;
export declare function modifierEmploye(id: number, data: {
    nom?: string;
    telephone?: string;
    email?: string;
    motDePasse?: string;
    actif?: boolean;
    agenceId?: number;
}, modifiePar: {
    id: number;
    role: Role;
}): Promise<{
    id: number;
    nom: string;
    telephone: string;
    email: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number;
    actif: boolean;
}>;
export declare function obtenirEmploye(id: number): Promise<{
    id: number;
    nom: string;
    telephone: string;
    email: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number;
    actif: boolean;
    createdAt: Date;
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
}>;
//# sourceMappingURL=user.service.d.ts.map