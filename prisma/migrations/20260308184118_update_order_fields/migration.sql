/*
  Warnings:

  - You are about to drop the column `product` on the `OrderItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creationDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "product",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");
