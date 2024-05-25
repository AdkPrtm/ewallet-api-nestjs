-- AlterTable
ALTER TABLE "users" ALTER COLUMN "profile_picture" DROP DEFAULT;

-- CreateTable
CREATE TABLE "otp_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "OTP" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_users_email_key" ON "otp_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otp_users_OTP_key" ON "otp_users"("OTP");
