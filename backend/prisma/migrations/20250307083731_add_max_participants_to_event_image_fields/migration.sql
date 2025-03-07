-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventImage" TEXT,
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "HelpRequest" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "urgency" TEXT NOT NULL DEFAULT 'medium';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT;

-- CreateTable
CREATE TABLE "HelpRequestHelper" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "helpRequestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpRequestHelper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HelpRequestHelper" ADD CONSTRAINT "HelpRequestHelper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequestHelper" ADD CONSTRAINT "HelpRequestHelper_helpRequestId_fkey" FOREIGN KEY ("helpRequestId") REFERENCES "HelpRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
