import { StatutTransfert } from '@prisma/client';
import { PaginationParams } from '../types';
export declare function demanderTransfert(data: any, demandeur: {
    id: number;
    agenceId: number | null;
    role: string;
}): Promise<{
    fruit: {
        id: number;
        nom: string;
    };
    calibre: {
        id: number;
        valeur: string;
    };
    agenceSource: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
    agenceDestination: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
    demandeur: {
        id: number;
        nom: string;
        role: import(".prisma/client").$Enums.Role;
    };
} & {
    id: number;
    fruitId: number;
    calibreId: number;
    quantite: number;
    statut: import(".prisma/client").$Enums.StatutTransfert;
    note: string | null;
    dateDemande: Date;
    dateValidation: Date | null;
    agenceSourceId: number;
    agenceDestinationId: number;
    demandePar: number;
    validePar: number | null;
}>;
export declare function obtenirTransferts(params: PaginationParams & {
    statut?: StatutTransfert;
    agenceId?: number;
}): Promise<{
    transferts: ({
        fruit: {
            id: number;
            nom: string;
        };
        calibre: {
            id: number;
            valeur: string;
        };
        agenceSource: {
            id: number;
            nom: import(".prisma/client").$Enums.NomAgence;
        };
        agenceDestination: {
            id: number;
            nom: import(".prisma/client").$Enums.NomAgence;
        };
        demandeur: {
            id: number;
            nom: string;
        };
        validateur: {
            id: number;
            nom: string;
        };
    } & {
        id: number;
        fruitId: number;
        calibreId: number;
        quantite: number;
        statut: import(".prisma/client").$Enums.StatutTransfert;
        note: string | null;
        dateDemande: Date;
        dateValidation: Date | null;
        agenceSourceId: number;
        agenceDestinationId: number;
        demandePar: number;
        validePar: number | null;
    })[];
    total: number;
}>;
export declare function approuver(id: number, validePar: number): Promise<{
    id: number;
    fruitId: number;
    calibreId: number;
    quantite: number;
    statut: import(".prisma/client").$Enums.StatutTransfert;
    note: string | null;
    dateDemande: Date;
    dateValidation: Date | null;
    agenceSourceId: number;
    agenceDestinationId: number;
    demandePar: number;
    validePar: number | null;
}>;
export declare function rejeter(id: number, validePar: number): Promise<{
    id: number;
    fruitId: number;
    calibreId: number;
    quantite: number;
    statut: import(".prisma/client").$Enums.StatutTransfert;
    note: string | null;
    dateDemande: Date;
    dateValidation: Date | null;
    agenceSourceId: number;
    agenceDestinationId: number;
    demandePar: number;
    validePar: number | null;
}>;
//# sourceMappingURL=transfert.service.d.ts.map