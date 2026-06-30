export declare function trouverUserParIdentifiant(identifiant: string): Promise<{
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
        ville: string;
    };
} & {
    id: number;
    nom: string;
    telephone: string;
    email: string | null;
    motDePasseHash: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number | null;
    actif: boolean;
    creePar: number | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function trouverClientParIdentifiant(identifiant: string): Promise<{
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
        ville: string;
    };
} & {
    id: number;
    nom: string;
    telephone: string;
    email: string | null;
    motDePasseHash: string;
    agenceId: number;
    actif: boolean;
    createdAt: Date;
    updatedAt: Date;
    adresse: string | null;
    type: import(".prisma/client").$Enums.TypeClient;
    limiteCredit: import("@prisma/client/runtime/library").Decimal;
    creditUtilise: import("@prisma/client/runtime/library").Decimal;
    statutCredit: import(".prisma/client").$Enums.StatutCredit;
    dateEcheance: Date | null;
    tauxInteretMensuel: import("@prisma/client/runtime/library").Decimal;
}>;
export declare function creerClient(data: {
    nom: string;
    type: 'PARTICULIER' | 'SUPERMARCHE';
    agenceId: number;
    telephone: string;
    email?: string;
    adresse?: string;
    motDePasseHash: string;
}): Promise<{
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
        ville: string;
    };
} & {
    id: number;
    nom: string;
    telephone: string;
    email: string | null;
    motDePasseHash: string;
    agenceId: number;
    actif: boolean;
    createdAt: Date;
    updatedAt: Date;
    adresse: string | null;
    type: import(".prisma/client").$Enums.TypeClient;
    limiteCredit: import("@prisma/client/runtime/library").Decimal;
    creditUtilise: import("@prisma/client/runtime/library").Decimal;
    statutCredit: import(".prisma/client").$Enums.StatutCredit;
    dateEcheance: Date | null;
    tauxInteretMensuel: import("@prisma/client/runtime/library").Decimal;
}>;
export declare function telephoneExiste(telephone: string): Promise<boolean>;
export declare function emailExiste(email: string): Promise<boolean>;
//# sourceMappingURL=auth.repository.d.ts.map