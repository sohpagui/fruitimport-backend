import { StatutCommande } from '@prisma/client';
import { PaginationParams } from '../types';
export declare function passerCommande(data: any): Promise<{
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
export declare function obtenirCommandes(params: PaginationParams & {
    agenceId?: number;
    clientId?: number;
    statut?: StatutCommande;
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
export declare function obtenirCommande(id: number): Promise<{
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
        actif: boolean;
        createdAt: Date;
        updatedAt: Date;
        adresse: string | null;
        type: import(".prisma/client").$Enums.TypeClient;
        limiteCredit: import("@prisma/client/runtime/library").Decimal;
        creditUtilise: import("@prisma/client/runtime/library").Decimal;
        statutCredit: import(".prisma/client").$Enums.StatutCredit;
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
export declare function mettreAJourStatutCommande(id: number, statut: StatutCommande): Promise<{
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
//# sourceMappingURL=commande.service.d.ts.map