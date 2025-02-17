/*
  Warnings:

  - You are about to alter the column `user_id` on the `applications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(36)`.
  - You are about to alter the column `user_id` on the `attendances` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(36)`.
  - You are about to alter the column `user_id` on the `leaves` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(36)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `applications` DROP FOREIGN KEY `applications_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `attendances` DROP FOREIGN KEY `attendances_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `leaves` DROP FOREIGN KEY `leaves_user_id_fkey`;

-- DropIndex
DROP INDEX `applications_user_id_fkey` ON `applications`;

-- DropIndex
DROP INDEX `attendances_user_id_fkey` ON `attendances`;

-- DropIndex
DROP INDEX `leaves_user_id_fkey` ON `leaves`;

-- AlterTable
ALTER TABLE `applications` MODIFY `user_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `attendances` MODIFY `user_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `leaves` MODIFY `user_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaves` ADD CONSTRAINT `leaves_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
