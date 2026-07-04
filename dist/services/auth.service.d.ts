export declare function connexion(identifiant: string, motDePasse: string): Promise<{
    accessToken: string;
    refreshToken: string;
    utilisateur: any;
}>;
export declare function rafraichirToken(refreshToken: string): Promise<{
    accessToken: string;
}>;
export declare function inscrireClient(data: {
    nom: string;
    type: 'PARTICULIER' | 'SUPERMARCHE';
    agenceId: number;
    telephone: string;
    email?: string;
    adresse?: string;
    motDePasse: string;
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
    photoUrl: string | null;
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
//# sourceMappingURL=auth.service.d.ts.map