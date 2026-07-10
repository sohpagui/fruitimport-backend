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
export declare function obtenirBenefices(periode: string): Promise<{
    periode: "jour" | "semaine" | "mois";
    chiffreAffaires: number;
    coutAchat: number;
    beneficeBrut: number;
    valeurPertes: number;
    beneficeNet: number;
    margePercent: string;
    parFruit: {
        nom: string;
        benefice: number;
        quantite: number;
    }[];
}>;
//# sourceMappingURL=dashboard.service.d.ts.map