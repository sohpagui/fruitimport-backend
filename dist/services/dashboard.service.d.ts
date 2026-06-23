export declare function obtenirDashboardPDG(): Promise<{
    kpis: {
        ventesTotalesJour: number;
        nbCommandesJour: number;
        pertesJour: {
            valeur: number;
            quantite: number;
        };
        creancesTotales: number;
    };
    comparaison: {
        douala: {
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
        };
        yaounde: {
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
        };
        meilleureAgence: string;
    };
    graphiqueVentes: Record<string, Record<number, number>>;
    topFruits: {
        fruit: {
            id: number;
            nom: string;
        };
        montant: number;
        quantite: number;
    }[];
    alertes: {
        clientsEnRetard: number;
        clientsARelancer: number;
        transfertsEnAttente: number;
        commandesEnAttente: number;
        stockBas: number;
    };
    synthese: string[];
}>;
export declare function obtenirDashboardAgence(agenceId: number): Promise<{
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
//# sourceMappingURL=dashboard.service.d.ts.map