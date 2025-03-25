-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Lunch', 'Breakfast', 'Dinner', 'Dessert', 'Snacks');

-- CreateEnum
CREATE TYPE "Cuisine" AS ENUM ('Indian', 'Arabic', 'Italian', 'Mexican', 'French', 'American', 'German');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cuisine" "Cuisine",
ADD COLUMN     "tags" "Tag"[];
