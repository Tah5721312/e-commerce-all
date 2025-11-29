-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_address" TEXT NOT NULL,
    "customer_city" TEXT NOT NULL,
    "customer_postal_code" TEXT NOT NULL,
    "customer_country" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "stripe_payment_intent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_title" TEXT NOT NULL,
    "product_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
