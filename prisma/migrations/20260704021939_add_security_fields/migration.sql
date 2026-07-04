-- AlterTable
ALTER TABLE `users` ADD COLUMN `bloque_jusqu_a` DATETIME(3) NULL,
    ADD COLUMN `derniere_connexion` DATETIME(3) NULL,
    ADD COLUMN `tentatives_echouees` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `historique_connexions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `succes` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `historique_connexions_user_id_idx`(`user_id`),
    INDEX `historique_connexions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `historique_connexions` ADD CONSTRAINT `historique_connexions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

