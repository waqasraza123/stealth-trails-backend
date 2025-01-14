/*
  Warnings:

  - Added the required column `supabaseUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "supabaseUserId" TEXT NOT NULL;
