-- CreateTable
CREATE TABLE `comptoirs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agence_id` INTEGER NOT NULL,
    `gerant_actuel_id` INTEGER NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_comptoir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comptoir_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL DEFAULT 0,
    `prix_detail` DECIMAL(10, 2) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_comptoir_comptoir_id_fruit_id_calibre_id_key`(`comptoir_id`, `fruit_id`, `calibre_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approvisionnements_comptoir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comptoir_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `gerant_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `versements_comptoir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comptoir_id` INTEGER NOT NULL,
    `montant` DECIMAL(10, 2) NOT NULL,
    `gerant_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pertes_comptoir` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comptoir_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `raison` VARCHAR(100) NOT NULL,
    `gerant_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comptoirs` ADD CONSTRAINT `comptoirs_agence_id_fkey` FOREIGN KEY (`agence_id`) REFERENCES `agences`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comptoirs` ADD CONSTRAINT `comptoirs_gerant_actuel_id_fkey` FOREIGN KEY (`gerant_actuel_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_comptoir` ADD CONSTRAINT `stock_comptoir_comptoir_id_fkey` FOREIGN KEY (`comptoir_id`) REFERENCES `comptoirs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_comptoir` ADD CONSTRAINT `stock_comptoir_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_comptoir` ADD CONSTRAINT `stock_comptoir_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvisionnements_comptoir` ADD CONSTRAINT `approvisionnements_comptoir_comptoir_id_fkey` FOREIGN KEY (`comptoir_id`) REFERENCES `comptoirs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvisionnements_comptoir` ADD CONSTRAINT `approvisionnements_comptoir_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvisionnements_comptoir` ADD CONSTRAINT `approvisionnements_comptoir_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approvisionnements_comptoir` ADD CONSTRAINT `approvisionnements_comptoir_gerant_id_fkey` FOREIGN KEY (`gerant_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `versements_comptoir` ADD CONSTRAINT `versements_comptoir_comptoir_id_fkey` FOREIGN KEY (`comptoir_id`) REFERENCES `comptoirs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `versements_comptoir` ADD CONSTRAINT `versements_comptoir_gerant_id_fkey` FOREIGN KEY (`gerant_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes_comptoir` ADD CONSTRAINT `pertes_comptoir_comptoir_id_fkey` FOREIGN KEY (`comptoir_id`) REFERENCES `comptoirs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes_comptoir` ADD CONSTRAINT `pertes_comptoir_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes_comptoir` ADD CONSTRAINT `pertes_comptoir_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertes_comptoir` ADD CONSTRAINT `pertes_comptoir_gerant_id_fkey` FOREIGN KEY (`gerant_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

