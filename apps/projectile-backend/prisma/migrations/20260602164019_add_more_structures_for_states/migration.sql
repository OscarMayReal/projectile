-- CreateEnum
CREATE TYPE "StateType" AS ENUM ('PreOpen', 'Open', 'Blocked', 'InProgress', 'Ready', 'Done');

-- AlterTable
ALTER TABLE "State" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#6b7280',
ADD COLUMN     "type" "StateType" NOT NULL DEFAULT 'Open';
