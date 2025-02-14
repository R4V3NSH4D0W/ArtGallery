-- DropIndex
DROP INDEX "OTP_email_key";

-- CreateIndex
CREATE INDEX "OTP_email_idx" ON "OTP"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
