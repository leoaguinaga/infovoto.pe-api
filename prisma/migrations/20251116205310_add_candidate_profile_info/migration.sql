/*
  Warnings:

  - A unique constraint covering the columns `[documentNumber]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('BACHELOR', 'MASTER', 'DOCTORATE', 'TECHNICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestigationStatus" AS ENUM ('IN_PROGRESS', 'ARCHIVED', 'CONVICTED', 'ACQUITTED');

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "civilStatus" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documentNumber" TEXT,
ADD COLUMN     "documentType" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "nationality" TEXT DEFAULT 'Peruana',
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "level" "EducationLevel" NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "fieldOfStudy" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetDeclaration" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "declaredIncome" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PEN',
    "source" TEXT,
    "description" TEXT,
    "salaryIncome" DECIMAL(15,2),
    "rentalIncome" DECIMAL(15,2),
    "dividendIncome" DECIMAL(15,2),
    "otherIncome" DECIMAL(15,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetDeclaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investigation" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "status" "InvestigationStatus" NOT NULL,
    "filingDate" TIMESTAMP(3),
    "resolutionDate" TIMESTAMP(3),
    "outcome" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investigation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetDeclaration_candidateId_year_key" ON "AssetDeclaration"("candidateId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_documentNumber_key" ON "Candidate"("documentNumber");

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDeclaration" ADD CONSTRAINT "AssetDeclaration_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investigation" ADD CONSTRAINT "Investigation_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
