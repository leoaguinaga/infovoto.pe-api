/*
  Warnings:

  - You are about to drop the column `sector` on the `GovernmentPlan` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GovernmentPlanSector" AS ENUM ('ECONOMY', 'HEALTH', 'EDUCATION', 'INFRASTRUCTURE', 'ENVIRONMENT', 'SOCIAL_WELFARE', 'SECURITY', 'TECHNOLOGY', 'AGRICULTURE', 'OTHER');

-- AlterTable
ALTER TABLE "GovernmentPlan" DROP COLUMN "sector";

-- CreateTable
CREATE TABLE "GovernmentPlanSection" (
    "id" SERIAL NOT NULL,
    "governmentPlanId" INTEGER NOT NULL,
    "sector" "GovernmentPlanSector" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "GovernmentPlanSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GovernmentPlanSection" ADD CONSTRAINT "GovernmentPlanSection_governmentPlanId_fkey" FOREIGN KEY ("governmentPlanId") REFERENCES "GovernmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
