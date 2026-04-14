
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('INSTAPAY', 'VODAFONE_CASH', 'PAY_ON_DELIVERY');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentIntentId",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentReference" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PAY_ON_DELIVERY';
