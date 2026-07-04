-- CreateTable
CREATE TABLE `retours_marchandise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `livraison_id` INTEGER NOT NULL,
    `fruit_id` INTEGER NOT NULL,
    `calibre_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `raison` VARCHAR(255) NOT NULL,
    `statut` VARCHAR(50) NOT NULL DEFAULT 'EN_ATTENTE',
    `enregistre_par` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `retours_marchandise_livraison_id_idx`(`livraison_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `retours_marchandise` ADD CONSTRAINT `retours_marchandise_livraison_id_fkey` FOREIGN KEY (`livraison_id`) REFERENCES `livraisons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retours_marchandise` ADD CONSTRAINT `retours_marchandise_fruit_id_fkey` FOREIGN KEY (`fruit_id`) REFERENCES `fruits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retours_marchandise` ADD CONSTRAINT `retours_marchandise_calibre_id_fkey` FOREIGN KEY (`calibre_id`) REFERENCES `calibres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retours_marchandise` ADD CONSTRAINT `retours_marchandise_enregistre_par_fkey` FOREIGN KEY (`enregistre_par`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

