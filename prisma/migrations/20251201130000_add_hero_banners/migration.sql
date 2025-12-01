-- CreateTable
CREATE TABLE "hero_banners" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "button_text" TEXT NOT NULL,
    "button_link" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "text_color" TEXT NOT NULL DEFAULT '#2B3445',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_banners_sort_order_idx" ON "hero_banners"("sort_order");


