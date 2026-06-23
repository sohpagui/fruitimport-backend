-- CreateTable
CREATE TABLE `agences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` ENUM('DOUALA', 'YAOUNDE') NOT NULL,
    `ville` VARCHAR(100) NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `agences_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `telephone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NULL,
    `mot_de_passe_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('PDG', 'SECRETAIRE', 'MAGASINIER', 'LIVREUR', 'CLIENT_PARTICULIER', 'CLIENT_SUPERMARCHE') NOT NULL,
    `agence_id` INTEGER NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `cree_par_id` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_telephone_key`(`telephone`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_agence_id_idx`(`agence_id`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fruits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `unite_mesure` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `fruits_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calibres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fruit_id` INTEGER NOT NULL,
    `valeur` VARCHAR(50) NOT NULL,
    `ordre_affichage` INTEGER NOT NULL DEFAULT 0,

    INDEX `calibres_fruit_id_idx`(`fruit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agence_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `origine` ENUM('MAROC', 'AFRIQUE_DU_SUD', 'ITALIE', 'AUTRE') NOT NULL,
    `categorie` ENUM('NORMAL', 'SOLDE') NOT NULL DEFAULT 'NORMAL',
    `quantite_cartons` INTEGER NOT NULL DEFAULT 0,
    `prix_unitaire` DECIMAL(10, 2) NOT NULL,
    `date_derniere_maj` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stocks_agence_id_idx`(`agence_id`),
    INDEX `stocks_fruit_id_idx`(`fruit_id`),
    UNIQUE INDEX `stocks_agence_id_fruit_id_calibre_id_origine_categorie_key`(`agence_id`, `fruit_id`, `calibre_id`, `origine`, `categorie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receptions_marchandise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agence_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `origine` ENUM('MAROC', 'AFRIQUE_DU_SUD', 'ITALIE', 'AUTRE') NOT NULL,
    `cartons_normal` INTEGER NOT NULL,
    `cartons_solde` INTEGER NOT NULL DEFAULT 0,
    `prix_normal` DECIMAL(10, 2) NOT NULL,
    `prix_solde` DECIMAL(10, 2) NULL,
    `date_arrivee` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recu_par_id` INTEGER NOT NULL,

    INDEX `receptions_marchandise_agence_id_idx`(`agence_id`),
    INDEX `receptions_marchandise_date_arrivee_idx`(`date_arrivee`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pertes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agence_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `raison` ENUM('JAUNISSEMENT', 'POURRISSEMENT', 'CHOC', 'AUTRE') NOT NULL,
    `valeur_perdue` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `declare_par_id` INTEGER NOT NULL,

    INDEX `pertes_agence_id_idx`(`agence_id`),
    INDEX `pertes_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(150) NOT NULL,
    `type` ENUM('PARTICULIER', 'SUPERMARCHE') NOT NULL,
    `agence_id` INTEGER NOT NULL,
    `telephone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NULL,
    `adresse` VARCHAR(255) NULL,
    `mot_de_passe_hash` VARCHAR(255) NOT NULL,
    `limite_credit` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `credit_utilise` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `statut_credit` ENUM('EN_REGLE', 'A_RELANCER', 'EN_RETARD') NOT NULL DEFAULT 'EN_REGLE',
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clients_telephone_key`(`telephone`),
    UNIQUE INDEX `clients_email_key`(`email`),
    INDEX `clients_agence_id_idx`(`agence_id`),
    INDEX `clients_statut_credit_idx`(`statut_credit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commandes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(20) NOT NULL,
    `agence_id` INTEGER NOT NULL,
    `client_id` INTEGER NOT NULL,
    `cree_par_id` INTEGER NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mode_paiement` ENUM('ESPECES', 'CREDIT') NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'CONFIRMEE', 'PREPAREE', 'EN_LIVRAISON', 'LIVREE', 'ANNULEE') NOT NULL DEFAULT 'EN_ATTENTE',
    `montant_total` DECIMAL(10, 2) NOT NULL,
    `adresse_livraison` VARCHAR(255) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `commandes_numero_key`(`numero`),
    INDEX `commandes_agence_id_idx`(`agence_id`),
    INDEX `commandes_client_id_idx`(`client_id`),
    INDEX `commandes_statut_idx`(`statut`),
    INDEX `commandes_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lignes_commande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commande_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `categorie` ENUM('NORMAL', 'SOLDE') NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prix_unitaire` DECIMAL(10, 2) NOT NULL,
    `sous_total` DECIMAL(10, 2) NOT NULL,

    INDEX `lignes_commande_commande_id_idx`(`commande_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `livraisons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commande_id` INTEGER NOT NULL,
    `livreur_id` INTEGER NOT NULL,
    `statut` ENUM('PREPARE', 'EN_ROUTE', 'LIVRE', 'PROBLEME') NOT NULL DEFAULT 'PREPARE',
    `note_probleme` TEXT NULL,
    `date_assignation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_livraison` DATETIME(3) NULL,

    UNIQUE INDEX `livraisons_commande_id_key`(`commande_id`),
    INDEX `livraisons_livreur_id_idx`(`livreur_id`),
    INDEX `livraisons_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transferts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agence_source_id` INTEGER NOT NULL,
    `agence_destination_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'APPROUVE', 'REJETE') NOT NULL DEFAULT 'EN_ATTENTE',
    `demande_par_id` INTEGER NOT NULL,
    `valide_par_id` INTEGER NULL,
    `date_demande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_validation` DATETIME(3) NULL,
    `note` TEXT NULL,

    INDEX `transferts_statut_idx`(`statut`),
    INDEX `transferts_agence_source_id_idx`(`agence_source_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paiements_credit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `commande_id` INTEGER NULL,
    `montant` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enregistre_par_id` INTEGER NOT NULL,

    INDEX `paiements_credit_client_id_idx`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('CREDIT_ECHEANCE', 'NOUVELLE_COMMANDE', 'STOCK_BAS', 'TRANSFERT_DEMANDE', 'TRANSFERT_APPROUVE', 'TRANSFERT_REJETE', 'LIVRAISON_ASSIGNEE') NOT NULL,
    `message` TEXT NOT NULL,
    `lu` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_idx`(`user_id`),
    INDEX `notifications_lu_idx`(`lu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications_client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `type` ENUM('CREDIT_ECHEANCE', 'NOUVELLE_COMMANDE', 'STOCK_BAS', 'TRANSFERT_DEMANDE', 'TRANSFERT_APPROUVE', 'TRANSFERT_REJETE', 'LIVRAISON_ASSIGNEE') NOT NULL,
    `message` TEXT NOT NULL,
    `lu` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_client_client_id_idx`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `logs_actions_user_id_idx`(`user_id`),
    INDEX `logs_actions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_cree_par_id_fkey` FOREIGN KEY (`cree_par_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calibres` ADD CONSTRAINT `calibres_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receptions_marchandise` ADD CONSTRAINT `receptions_marchandise_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receptions_marchandise` ADD CONSTRAINT `receptions_marchandise_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receptions_marchandise` ADD CONSTRAINT `receptions_marchandise_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receptions_marchandise` ADD CONSTRAINT `receptions_marchandise_recu_par_id_fkey` FOREIGN KEY (`recu_par_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes` ADD CONSTRAINT `pertes_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes` ADD CONSTRAINT `pertes_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes` ADD CONSTRAINT `pertes_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes` ADD CONSTRAINT `pertes_declare_par_id_fkey` FOREIGN KEY (`declare_par_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_cree_par_id_fkey` FOREIGN KEY (`cree_par_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_commande` ADD CONSTRAINT `lignes_commande_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commandes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_commande` ADD CONSTRAINT `lignes_commande_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_commande` ADD CONSTRAINT `lignes_commande_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `livraisons` ADD CONSTRAINT `livraisons_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commandes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `livraisons` ADD CONSTRAINT `livraisons_livreur_id_fkey` FOREIGN KEY (`livreur_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferts` ADD CONSTRAINT `transferts_agence_source_id_fkey` FOREIGN KEY (`agence_source_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferts` ADD CONSTRAINT `transferts_agence_destination_id_fkey` FOREIGN KEY (`agence_destination_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferts` ADD CONSTRAINT `transferts_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferts` ADD CONSTRAINT `transferts_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferts` ADD CONSTRAINT `transferts_demande_par_id_fkey` FOREIGN KEY (`demande_par_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transferts` ADD CONSTRAINT `transferts_valide_par_id_fkey` FOREIGN KEY (`valide_par_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements_credit` ADD CONSTRAINT `paiements_credit_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements_credit` ADD CONSTRAINT `paiements_credit_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commandes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paiements_credit` ADD CONSTRAINT `paiements_credit_enregistre_par_id_fkey` FOREIGN KEY (`enregistre_par_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications_client` ADD CONSTRAINT `notifications_client_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs_actions` ADD CONSTRAINT `logs_actions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
