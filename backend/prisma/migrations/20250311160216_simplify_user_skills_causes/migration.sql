/*
  Warnings:

  - You are about to drop the `Cause` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCause` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCause" DROP CONSTRAINT "UserCause_causeId_fkey";

-- DropForeignKey
ALTER TABLE "UserCause" DROP CONSTRAINT "UserCause_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "causes" TEXT[],
ADD COLUMN     "skills" TEXT[];

-- DropTable
DROP TABLE "Cause";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "UserCause";

-- DropTable
DROP TABLE "UserSkill";
