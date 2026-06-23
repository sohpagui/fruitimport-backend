import { StatutTransfert } from '@prisma/client';
export declare function creerTransfert(data: {
    agenceSourceId: number;
    agenceDestinationId: number;
    fruitId: number;
    calibreId: number;
    quantite: number;
    demandePar: number;
    note?: string;
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
export declare function listerTransferts(params: {
    statut?: StatutTransfert;
    agenceId?: number;
    skip: number;
    limit: number;
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
export declare function approuverTransfert(id: number, validePar: number): Promise<{
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
export declare function rejeterTransfert(id: number, validePar: number): Promise<{
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
//# sourceMappingURL=transfert.repository.d.ts.map