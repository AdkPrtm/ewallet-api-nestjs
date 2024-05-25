/*
  Warnings:

  - You are about to drop the column `ktp_picture` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "ktp_picture",
ALTER COLUMN "profile_picture" SET DEFAULT 'default.png';
