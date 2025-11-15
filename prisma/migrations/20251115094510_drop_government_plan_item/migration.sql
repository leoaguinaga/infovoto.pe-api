/*
  Warnings:

  - You are about to drop the `GovernmentPlanItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GovernmentPlanItem" DROP CONSTRAINT "GovernmentPlanItem_planId_fkey";

-- DropTable
DROP TABLE "GovernmentPlanItem";
