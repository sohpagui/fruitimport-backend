-- AlterTable
ALTER TABLE `clients` ADD COLUMN `date_echeance` DATETIME(3) NULL,
    ADD COLUMN `taux_interet_mensuel` DECIMAL(5, 2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `versements_credit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `montant` DECIMAL(10, 2) NOT NULL,
    `solde_avant` DECIMAL(10, 2) NOT NULL,
    `solde_apres` DECIMAL(10, 2) NOT NULL,
    `enregistre_par_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `versements_credit_client_id_idx`(`client_id`),
    INDEX `versements_credit_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parametres_systeme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cle` VARCHAR(100) NOT NULL,
    `valeur` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `parametres_systeme_cle_key`(`cle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `versements_credit` ADD CONSTRAINT `versements_credit_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `versements_credit` ADD CONSTRAINT `versements_credit_enregistre_par_id_fkey` FOREIGN KEY (`enregistre_par_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

