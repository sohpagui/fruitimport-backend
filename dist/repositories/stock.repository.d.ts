import { Origine, CategorieStock } from '@prisma/client';
export declare function listerStocks(params: {
    agenceId?: number;
    fruitId?: number;
    calibreId?: number;
    categorie?: CategorieStock;
    skip: number;
    limit: number;
}): Promise<{
    stocks: ({
        agence: {
            id: number;
            nom: import(".prisma/client").$Enums.NomAgence;
        };
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
        agenceId: number;
        fruitId: number;
        calibreId: number;
        origine: import(".prisma/client").$Enums.Origine;
        categorie: import(".prisma/client").$Enums.CategorieStock;
        quantiteCartons: number;
        prixUnitaire: import("@prisma/client/runtime/library").Decimal;
        dateDerniereMaj: Date;
    })[];
    total: number;
}>;
export declare function obtenirAlertesStock(agenceId?: number): Promise<({
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
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
    agenceId: number;
    fruitId: number;
    calibreId: number;
    origine: import(".prisma/client").$Enums.Origine;
    categorie: import(".prisma/client").$Enums.CategorieStock;
    quantiteCartons: number;
    prixUnitaire: import("@prisma/client/runtime/library").Decimal;
    dateDerniereMaj: Date;
})[]>;
export declare function receptionnerMarchandise(data: {
    agenceId: number;
    fruitId: number;
    calibreId: number;
    origine: Origine;
    cartonsNormal: number;
    cartonsSolde: number;
    prixNormal: number;
    prixSolde?: number;
    recuParId: number;
}): Promise<{
    id: number;
    agenceId: number;
    fruitId: number;
    calibreId: number;
    origine: import(".prisma/client").$Enums.Origine;
    cartonsNormal: number;
    cartonsSolde: number;
    prixNormal: import("@prisma/client/runtime/library").Decimal;
    prixSolde: import("@prisma/client/runtime/library").Decimal | null;
    dateArrivee: Date;
    recuParId: number;
}>;
export declare function declarerPerte(data: {
    agenceId: number;
    fruitId: number;
    calibreId: number;
    origine: Origine;
    categorie: CategorieStock;
    quantite: number;
    raison: any;
    declarePar: number;
}): Promise<{
    valeurPerdue: number;
    id: number;
    agenceId: number;
    date: Date;
    fruitId: number;
    calibreId: number;
    quantite: number;
    raison: import(".prisma/client").$Enums.RaisonPerte;
    declarePar: number;
}>;
export declare function obtenirCatalogue(agenceId: number): Promise<({
    fruit: {
        id: number;
        nom: string;
        uniteMesure: string;
    };
    calibre: {
        id: number;
        valeur: string;
        ordreAffichage: number;
    };
} & {
    id: number;
    agenceId: number;
    fruitId: number;
    calibreId: number;
    origine: import(".prisma/client").$Enums.Origine;
    categorie: import(".prisma/client").$Enums.CategorieStock;
    quantiteCartons: number;
    prixUnitaire: import("@prisma/client/runtime/library").Decimal;
    dateDerniereMaj: Date;
})[]>;
export declare function deduireStock(tx: any, agenceId: number, fruitId: number, calibreId: number, categorie: CategorieStock, quantite: number): Promise<any>;
//# sourceMappingURL=stock.repository.d.ts.map