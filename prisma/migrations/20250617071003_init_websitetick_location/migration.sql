-- CreateTable
CREATE TABLE "websiteTicksLocation" (
    "id" TEXT NOT NULL,
    "websiteTickId" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "websiteTicksLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "websiteTicksLocation" ADD CONSTRAINT "websiteTicksLocation_websiteTickId_fkey" FOREIGN KEY ("websiteTickId") REFERENCES "websiteTicks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
