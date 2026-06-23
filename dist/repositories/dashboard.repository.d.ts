export declare function statsGlobales(): Promise<{
    ventesJour: {
        montant: number;
        nbCommandes: number;
    };
    ventesParAgence: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.CommandeGroupByOutputType, "agenceId"[]> & {
        _count: {
            id: number;
        };
        _sum: {
            montantTotal: import("@prisma/client/runtime/library").Decimal;
        };
    })[];
    stockParAgence: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.StockGroupByOutputType, "agenceId"[]> & {
        _sum: {
            quantiteCartons: number;
        };
    })[];
    pertesJour: {
        valeur: number;
        quantite: number;
    };
    creances: number;
    alertes: {
        clientsEnRetard: number;
        clientsARelancer: number;
        transfertsEnAttente: number;
        commandesEnAttente: number;
        stockBas: number;
    };
}>;
export declare function ventesSetDernierJours(): Promise<Record<string, Record<number, number>>>;
export declare function ventesParFruit(agenceId?: number): Promise<{
    fruit: {
        id: number;
        nom: string;
    };
    montant: number;
    quantite: number;
}[]>;
export declare function statsParAgence(agenceId: number): Promise<{
    agenceId: number;
    ventesJour: {
        montant: number;
        nbCommandes: number;
    };
    stockTotal: number;
    nbClients: number;
    nbEmployes: number;
    perteMois: number;
    livraisonsEnCours: number;
    topFruits: {
        fruit: {
            id: number;
            nom: string;
        };
        montant: number;
        quantite: number;
    }[];
}>;
export declare function genererSynthese(agenceId1: number, agenceId2: number): Promise<string[]>;
//# sourceMappingURL=dashboard.repository.d.ts.map