-- AlterTable
ALTER TABLE "GovernmentPlanSection" ADD COLUMN     "goals" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "indicators" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "problemIdentified" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "strategicObjective" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "content" SET DEFAULT '';
