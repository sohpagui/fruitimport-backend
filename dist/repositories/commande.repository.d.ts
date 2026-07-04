import { StatutCommande, ModePaiement } from '@prisma/client';
export declare function creerCommande(data: {
    agenceId: number;
    clientId: number;
    creeParId?: number;
    modePaiement: ModePaiement;
    adresseLivraison?: string;
    note?: string;
    lignes: Array<{
        fruitId: number;
        calibreId: number;
        categorie: 'NORMAL' | 'SOLDE';
        quantite: number;
        prixUnitaire: number;
    }>;
}): Promise<{
    client: {
        id: number;
        nom: string;
        telephone: string;
    };
    lignes: ({
        fruit: {
            id: number;
            nom: string;
        };
        calibre: {
            id: number;
            valeur: string;
        };
    } & {
        id: number;
        fruitId: number;
        calibreId: number;
        categorie: import(".prisma/client").$Enums.CategorieStock;
        prixUnitaire: import("@prisma/client/runtime/library").Decimal;
        quantite: number;
        sousTotal: import("@prisma/client/runtime/library").Decimal;
        commandeId: number;
    })[];
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
}>;
export declare function listerCommandes(params: {
    agenceId?: number;
    clientId?: number;
    statut?: StatutCommande;
    skip: number;
    limit: number;
}): Promise<{
    commandes: ({
        creePar: {
            id: number;
            nom: string;
            role: import(".prisma/client").$Enums.Role;
        };
        agence: {
            id: number;
            nom: import(".prisma/client").$Enums.NomAgence;
        };
        client: {
            id: number;
            nom: string;
            telephone: string;
            type: import(".prisma/client").$Enums.TypeClient;
        };
        livraison: {
            id: number;
            statut: import(".prisma/client").$Enums.StatutLivraison;
            commandeId: number;
            livreurId: number;
            noteProbleme: string | null;
            dateAssignation: Date;
            dateLivraison: Date | null;
        };
        lignes: ({
            fruit: {
                id: number;
                nom: string;
            };
            calibre: {
                id: number;
                valeur: string;
            };
        } & {
            id: number;
            fruitId: number;
            calibreId: number;
            categorie: import(".prisma/client").$Enums.CategorieStock;
            prixUnitaire: import("@prisma/client/runtime/library").Decimal;
            quantite: number;
            sousTotal: import("@prisma/client/runtime/library").Decimal;
            commandeId: number;
        })[];
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
    })[];
    total: number;
}>;
export declare function trouverCommandeParId(id: number): Promise<{
    creePar: {
        id: number;
        nom: string;
        role: import(".prisma/client").$Enums.Role;
    };
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
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
    livraison: {
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
    };
    lignes: ({
        fruit: {
            id: number;
            nom: string;
            uniteMesure: string;
        };
        calibre: {
            id: number;
            valeur: string;
        };
    } & {
        id: number;
        fruitId: number;
        calibreId: number;
        categorie: import(".prisma/client").$Enums.CategorieStock;
        prixUnitaire: import("@prisma/client/runtime/library").Decimal;
        quantite: number;
        sousTotal: import("@prisma/client/runtime/library").Decimal;
        commandeId: number;
    })[];
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
}>;
export declare function changerStatutCommande(id: number, statut: StatutCommande): Promise<{
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
}>;
//# sourceMappingURL=commande.repository.d.ts.map