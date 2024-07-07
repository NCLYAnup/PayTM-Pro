/*
  Warnings:

  - Made the column `toUserName` on table `p2pTransfer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "p2pTransfer" ALTER COLUMN "toUserName" SET NOT NULL;
