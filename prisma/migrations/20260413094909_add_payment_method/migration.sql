/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `Order` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('INSTAPAY', 'VODAFONE_CASH', 'PAY_ON_DELIVERY');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentIntentId",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentReference" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PAY_ON_DELIVERY';
