/*
  Warnings:

  - You are about to drop the column `isFinished` on the `DailyOverride` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyOverride" DROP COLUMN "isFinished",
ADD COLUMN     "isChecked" BOOLEAN NOT NULL DEFAULT false;
