import { StatutCredit } from '@prisma/client';
import { PaginationParams } from '../types';
export declare function obtenirClients(params: PaginationParams & {
    agenceId?: number;
    statutCredit?: StatutCredit;
}): Promise<{
    clients: {
        id: number;
        nom: string;
        telephone: string;
        email: string;
        createdAt: Date;
        agence: {
            id: number;
            nom: import(".prisma/client").$Enums.NomAgence;
        };
        adresse: string;
        type: import(".prisma/client").$Enums.TypeClient;
        limiteCredit: import("@prisma/client/runtime/library").Decimal;
        creditUtilise: import("@prisma/client/runtime/library").Decimal;
        statutCredit: import(".prisma/client").$Enums.StatutCredit;
    }[];
    total: number;
}>;
export declare function obtenirClient(id: number): Promise<{
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
    commandes: {
        id: number;
        date: Date;
        numero: string;
        modePaiement: import(".prisma/client").$Enums.ModePaiement;
        statut: import(".prisma/client").$Enums.StatutCommande;
        montantTotal: import("@prisma/client/runtime/library").Decimal;
    }[];
    paiementsCredit: {
        id: number;
        date: Date;
        clientId: number;
        commandeId: number | null;
        montant: import("@prisma/client/runtime/library").Decimal;
        enregistrePar: number;
    }[];
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
export declare function mettreAJourLimiteCredit(clientId: number, limiteCredit: number, modifiePar: number): Promise<{
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
export declare function enregistrerPaiement(data: {
    clientId: number;
    commandeId?: number;
    montant: number;
    enregistrePar: number;
}): Promise<{
    id: number;
    date: Date;
    clientId: number;
    commandeId: number | null;
    montant: import("@prisma/client/runtime/library").Decimal;
    enregistrePar: number;
}>;
export declare function definirEcheanceEtTaux(clientId: number, dateEcheance: Date, tauxInteretMensuel: number): Promise<{
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
export declare function faireVersement(data: {
    clientId: number;
    montant: number;
    enregistreParId: number;
}): Promise<{
    id: number;
    date: Date;
    clientId: number;
    montant: import("@prisma/client/runtime/library").Decimal;
    soldeAvant: import("@prisma/client/runtime/library").Decimal;
    soldeApres: import("@prisma/client/runtime/library").Decimal;
    enregistreParId: number;
}>;
export declare function obtenirHistoriqueVersements(clientId: number): Promise<({
    enregistrePar: {
        id: number;
        nom: string;
    };
} & {
    id: number;
    date: Date;
    clientId: number;
    montant: import("@prisma/client/runtime/library").Decimal;
    soldeAvant: import("@prisma/client/runtime/library").Decimal;
    soldeApres: import("@prisma/client/runtime/library").Decimal;
    enregistreParId: number;
})[]>;
export declare function executerJobInterets(): Promise<any[]>;
//# sourceMappingURL=client.service.d.ts.map