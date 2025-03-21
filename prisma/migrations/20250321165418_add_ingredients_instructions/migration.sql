/*
  Warnings:

  - The `ingredients` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `instructions` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredients",
ADD COLUMN     "ingredients" TEXT[],
ALTER COLUMN "cookingTime" SET DATA TYPE TEXT,
DROP COLUMN "instructions",
ADD COLUMN     "instructions" TEXT[];
