/*
  Warnings:

  - You are about to drop the column `color` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `iconName` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `State` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "color",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "iconName",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "State" DROP COLUMN "projectId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Board" (
    "iconName" TEXT,
    "color" TEXT DEFAULT '#0c9d6d',
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "State" ADD CONSTRAINT "State_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
