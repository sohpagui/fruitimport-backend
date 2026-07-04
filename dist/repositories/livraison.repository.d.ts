import { StatutLivraison } from '@prisma/client';
export declare function creerLivraison(data: {
    commandeId: number;
    livreurId: number;
}): Promise<{
    commande: {
        client: {
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
        };
    } & {
        id: number;
        agenceId: number;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        numero: string;
        modePaiement: import(".prisma/client").$Enums.ModePaiement;
        statut: import(".prisma/client").$Enums.StatutCommande;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
        adresseLivraison: string | null;
        note: string | null;
        clientId: number;
        creeParId: number | null;
    };
    livreur: {
        id: number;
        nom: string;
        telephone: string;
    };
} & {
    id: number;
    statut: import(".prisma/client").$Enums.StatutLivraison;
    commandeId: number;
    livreurId: number;
    noteProbleme: string | null;
    dateAssignation: Date;
    dateLivraison: Date | null;
}>;
export declare function listerLivraisons(params: {
    livreurId?: number;
    statut?: StatutLivraison;
    agenceId?: number;
    skip: number;
    limit: number;
}): Promise<{
    livraisons: ({
        commande: {
            agence: {
                id: number;
                nom: import(".prisma/client").$Enums.NomAgence;
            };
            client: {
                id: number;
                nom: string;
                telephone: string;
            };
        } & {
            id: number;
            agenceId: number;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            numero: string;
            modePaiement: import(".prisma/client").$Enums.ModePaiement;
            statut: import(".prisma/client").$Enums.StatutCommande;
            montantTotal: import("@prisma/client/runtime/library").Decimal;
            adresseLivraison: string | null;
            note: string | null;
            clientId: number;
            creeParId: number | null;
        };
        livreur: {
            id: number;
            nom: string;
            telephone: string;
        };
    } & {
        id: number;
        statut: import(".prisma/client").$Enums.StatutLivraison;
        commandeId: number;
        livreurId: number;
        noteProbleme: string | null;
        dateAssignation: Date;
        dateLivraison: Date | null;
    })[];
    total: number;
}>;
export declare function mettreAJourStatutLivraison(id: number, statut: StatutLivraison, noteProbleme?: string): Promise<{
    id: number;
    statut: import(".prisma/client").$Enums.StatutLivraison;
    commandeId: number;
    livreurId: number;
    noteProbleme: string | null;
    dateAssignation: Date;
    dateLivraison: Date | null;
}>;
//# sourceMappingURL=livraison.repository.d.ts.map