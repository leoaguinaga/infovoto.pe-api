-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VOTER', 'TABLE_MEMBER');

-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('GENERAL', 'REGIONAL', 'MUNICIPAL', 'REFERENDUM');

-- CreateEnum
CREATE TYPE "ElectoralEventCategory" AS ENUM ('ELECTION_DAY', 'PROCESS_RELEVANT', 'TABLE_MEMBER_RELEVANT', 'OTHER');

-- CreateEnum
CREATE TYPE "CandidateOffice" AS ENUM ('PRESIDENT', 'FIRST_VP', 'SECOND_VP', 'CONGRESS', 'SENATE_NATIONAL', 'SENATE_REGIONAL', 'ANDINE_PARLIAMENT');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GuideCategory" AS ENUM ('ELECTOR_LOCATION', 'ELECTOR_BALLOT_INSTRUCTIONS', 'ELECTOR_SECURITY_RECOMMENDATIONS', 'ELECTOR_LEGAL_FRAMEWORK', 'TABLE_MEMBER_CALENDAR', 'TABLE_MEMBER_DUTIES_INSTALLATION', 'TABLE_MEMBER_DUTIES_VOTING', 'TABLE_MEMBER_DUTIES_OTHER', 'APP_TUTORIAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "votingTableId" INTEGER,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "votingTableId" INTEGER NOT NULL,
    "roleInTable" TEXT,

    CONSTRAINT "TableMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ElectionType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectoralEvent" (
    "id" SERIAL NOT NULL,
    "electionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "ElectoralEventCategory" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ElectoralEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliticalGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "PoliticalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "office" "CandidateOffice" NOT NULL,
    "biography" TEXT,
    "photoUrl" TEXT,
    "politicalGroupId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentPlan" (
    "id" SERIAL NOT NULL,
    "politicalGroupId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sector" TEXT,
    "documentUrl" TEXT,
    "fromYear" INTEGER,
    "toYear" INTEGER,

    CONSTRAINT "GovernmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentPlanItem" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "problem" TEXT NOT NULL,
    "strategicObjective" TEXT NOT NULL,
    "indicator" TEXT,
    "targetValue" DOUBLE PRECISION,
    "targetUnit" TEXT,
    "targetYear" INTEGER,

    CONSTRAINT "GovernmentPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "authorId" INTEGER NOT NULL,
    "candidateId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteIntention" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "electionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoteIntention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostModerationAlert" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedByAdminId" INTEGER,

    CONSTRAINT "PostModerationAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingCenter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "department" TEXT,
    "province" TEXT,
    "district" TEXT,

    CONSTRAINT "VotingCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingTable" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "votingCenterId" INTEGER NOT NULL,
    "room" TEXT,
    "floor" TEXT,

    CONSTRAINT "VotingTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideContent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "GuideCategory" NOT NULL,
    "electionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "source" TEXT,
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "electionId" INTEGER,
    "politicalGroupId" INTEGER,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Voter_userId_key" ON "Voter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Voter_documentNumber_key" ON "Voter"("documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TableMember_userId_key" ON "TableMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VoteIntention_userId_electionId_candidateId_key" ON "VoteIntention"("userId", "electionId", "candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "VotingTable_code_key" ON "VotingTable"("code");

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_votingTableId_fkey" FOREIGN KEY ("votingTableId") REFERENCES "VotingTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableMember" ADD CONSTRAINT "TableMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableMember" ADD CONSTRAINT "TableMember_votingTableId_fkey" FOREIGN KEY ("votingTableId") REFERENCES "VotingTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectoralEvent" ADD CONSTRAINT "ElectoralEvent_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_politicalGroupId_fkey" FOREIGN KEY ("politicalGroupId") REFERENCES "PoliticalGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernmentPlan" ADD CONSTRAINT "GovernmentPlan_politicalGroupId_fkey" FOREIGN KEY ("politicalGroupId") REFERENCES "PoliticalGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernmentPlanItem" ADD CONSTRAINT "GovernmentPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "GovernmentPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteIntention" ADD CONSTRAINT "VoteIntention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteIntention" ADD CONSTRAINT "VoteIntention_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteIntention" ADD CONSTRAINT "VoteIntention_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModerationAlert" ADD CONSTRAINT "PostModerationAlert_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModerationAlert" ADD CONSTRAINT "PostModerationAlert_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotingTable" ADD CONSTRAINT "VotingTable_votingCenterId_fkey" FOREIGN KEY ("votingCenterId") REFERENCES "VotingCenter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideContent" ADD CONSTRAINT "GuideContent_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_politicalGroupId_fkey" FOREIGN KEY ("politicalGroupId") REFERENCES "PoliticalGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
