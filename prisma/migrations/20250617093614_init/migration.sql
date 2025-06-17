/*
  Warnings:

  - Added the required column `websiteId` to the `websiteTicksLocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "websiteTicksLocation" DROP CONSTRAINT "websiteTicksLocation_websiteTickId_fkey";

-- AlterTable
ALTER TABLE "websiteTicksLocation" ADD COLUMN     "websiteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "websiteTicksLocation" ADD CONSTRAINT "websiteTicksLocation_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Websites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
