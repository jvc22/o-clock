/*
  Warnings:

  - You are about to drop the column `mother` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "mother",
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianPhone" TEXT;
