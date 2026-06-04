/*
  Warnings:

  - A unique constraint covering the columns `[userConnectionId,accountConnectionType]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_userConnectionId_accountConnectionType_key" ON "User"("userConnectionId", "accountConnectionType");
