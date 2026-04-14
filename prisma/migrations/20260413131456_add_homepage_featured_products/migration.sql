-- CreateTable
CREATE TABLE "HomepageFeaturedProduct" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageFeaturedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageFeaturedProduct_position_key" ON "HomepageFeaturedProduct"("position");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageFeaturedProduct_productId_key" ON "HomepageFeaturedProduct"("productId");

-- AddForeignKey
ALTER TABLE "HomepageFeaturedProduct" ADD CONSTRAINT "HomepageFeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
