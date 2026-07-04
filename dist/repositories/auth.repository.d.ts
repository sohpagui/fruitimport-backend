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
    tentativesEchouees: number;
    bloqueJusquA: Date | null;
    derniereCo: Date | null;
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
export declare function enregistrerConnexion(userId: number, succes: boolean, ip?: string, userAgent?: string): Promise<void>;
export declare function estBloque(userId: number): Promise<boolean>;
export declare function changerMotDePasse(userId: number, nouveauHash: string): Promise<{
    id: number;
    nom: string;
    telephone: string;
    email: string | null;
    motDePasseHash: string;
    role: import(".prisma/client").$Enums.Role;
    agenceId: number | null;
    actif: boolean;
    tentativesEchouees: number;
    bloqueJusquA: Date | null;
    derniereCo: Date | null;
    creePar: number | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function obtenirHistoriqueConnexions(userId: number): Promise<{
    id: number;
    createdAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    succes: boolean;
    userId: number;
}[]>;
//# sourceMappingURL=auth.repository.d.ts.map