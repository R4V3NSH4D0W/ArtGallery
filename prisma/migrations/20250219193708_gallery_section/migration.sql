-- CreateTable
CREATE TABLE "GalleryArt" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryArt_pkey" PRIMARY KEY ("id")
);
