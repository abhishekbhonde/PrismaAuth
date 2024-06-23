/*
  Warnings:

  - You are about to drop the `newUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "newUser";

-- CreateTable
CREATE TABLE "NewUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "NewUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewUser_id_key" ON "NewUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NewUser_username_key" ON "NewUser"("username");
