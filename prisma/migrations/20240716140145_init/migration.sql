/*
  Warnings:

  - You are about to drop the column `flood` on the `room` table. All the data in the column will be lost.
  - Added the required column `floor` to the `room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room" DROP COLUMN "flood",
ADD COLUMN     "floor" TEXT NOT NULL;
