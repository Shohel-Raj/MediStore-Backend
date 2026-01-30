-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'BLOCK');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
