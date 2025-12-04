-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductCategory" ADD VALUE 'children';
ALTER TYPE "ProductCategory" ADD VALUE 'accessories';
ALTER TYPE "ProductCategory" ADD VALUE 'shoes';
ALTER TYPE "ProductCategory" ADD VALUE 'electronics';
ALTER TYPE "ProductCategory" ADD VALUE 'beauty';
ALTER TYPE "ProductCategory" ADD VALUE 'home';
