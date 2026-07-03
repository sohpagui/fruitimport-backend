import { CategorieStock } from '@prisma/client';
import { PaginationParams } from '../types';
export declare function obtenirStocks(params: PaginationParams & {
    agenceId?: number;
    fruitId?: number;
    categorie?: CategorieStock;
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
            imageUrl: string;
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
export declare function obtenirAlertes(agenceId?: number): Promise<({
    agence: {
        id: number;
        nom: import(".prisma/client").$Enums.NomAgence;
    };
    fruit: {
        id: number;
        nom: string;
        imageUrl: string;
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
export declare function recevoirMarchandise(data: any): Promise<{
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
export declare function declarerUnePerte(data: any): Promise<{
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
export declare function obtenirCatalogueAgence(agenceId: number): Promise<({
    fruit: {
        id: number;
        nom: string;
        uniteMesure: string;
        imageUrl: string;
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
//# sourceMappingURL=stock.service.d.ts.map