import { Role } from '@prisma/client';
export declare function listerUsers(params: {
    agenceId?: number;
    role?: Role;
    skip: number;
    limit: number;
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
export declare function trouverUserParId(id: number): Promise<{
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
export declare function creerUser(data: {
    nom: string;
    telephone: string;
    email?: string;
    motDePasseHash: string;
    role: Role;
    agenceId?: number;
    creePar: number;
}): Promise<{
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
export declare function mettreAJourUser(id: number, data: Partial<{
    nom: string;
    telephone: string;
    email: string;
    motDePasseHash: string;
    actif: boolean;
    agenceId: number;
}>): Promise<{
    id: number;
    nom: string;
    telephone: string;
    email: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number;
    actif: boolean;
}>;
export declare function desactiverUser(id: number): Promise<{
    id: number;
    nom: string;
    telephone: string;
    email: string | null;
    motDePasseHash: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number | null;
    photoUrl: string | null;
    actif: boolean;
    tentativesEchouees: number;
    bloqueJusquA: Date | null;
    derniereCo: Date | null;
    creePar: number | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function loggerAction(data: {
    userId: number;
    action: string;
    details?: string;
    ipAddress?: string;
}): Promise<{
    id: number;
    createdAt: Date;
    ipAddress: string | null;
    userId: number;
    action: string;
    details: string | null;
}>;
//# sourceMappingURL=user.repository.d.ts.map