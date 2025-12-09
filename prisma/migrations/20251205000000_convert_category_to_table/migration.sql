-- CreateTable
CREATE TABLE IF NOT EXISTS "product_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "product_categories_name_key" ON "product_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "product_categories_slug_key" ON "product_categories"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "product_categories_slug_idx" ON "product_categories"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "product_categories_is_active_idx" ON "product_categories"("is_active");

-- Insert default categories
INSERT INTO "product_categories" ("name", "slug", "description", "is_active", "sort_order") VALUES
('Men', 'men', 'Men''s clothing and accessories', true, 1),
('Women', 'women', 'Women''s clothing and accessories', true, 2),
('Children', 'children', 'Children''s clothing and accessories', true, 3),
('Accessories', 'accessories', 'Fashion accessories', true, 4),
('Shoes', 'shoes', 'Footwear for all ages', true, 5),
('Electronics', 'electronics', 'Electronic devices and gadgets', true, 6),
('Beauty', 'beauty', 'Beauty and personal care products', true, 7),
('Home', 'home', 'Home and living products', true, 8)
ON CONFLICT (slug) DO NOTHING;

-- Add category_id column to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category_id" INTEGER;

-- Update existing products to use category_id based on category enum
UPDATE "products" SET "category_id" = (SELECT "id" FROM "product_categories" WHERE "slug" = "products"."category"::text) WHERE "category_id" IS NULL;

-- Make category_id NOT NULL after updating existing data
ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create index on category_id
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products"("category_id");

-- Drop the old category column (enum)
ALTER TABLE "products" DROP COLUMN IF EXISTS "category";

-- Drop the enum type if it exists
DROP TYPE IF EXISTS "ProductCategory";

