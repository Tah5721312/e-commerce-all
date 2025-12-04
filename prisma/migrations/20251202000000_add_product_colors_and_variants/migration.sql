-- CreateEnum
CREATE TYPE "ProductSize" AS ENUM ('S', 'M', 'L', 'XL', 'X2XL', 'X3XL');

-- CreateTable
CREATE TABLE "product_colors" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color_name" VARCHAR(100) NOT NULL,
    "color_code" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_color_id" INTEGER NOT NULL,
    "size" "ProductSize" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_colors_product_id_idx" ON "product_colors"("product_id");

-- CreateIndex
CREATE INDEX "product_variants_product_color_id_idx" ON "product_variants"("product_color_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_color_id_size_key" ON "product_variants"("product_color_id", "size");

-- AddForeignKey
ALTER TABLE "product_colors" ADD CONSTRAINT "product_colors_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_color_id_fkey" FOREIGN KEY ("product_color_id") REFERENCES "product_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;


