/*
  Warnings:

  - You are about to drop the column `studentNumber` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentID]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentID` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_studentNumber_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "studentNumber",
ADD COLUMN     "studentID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentID_key" ON "Student"("studentID");
