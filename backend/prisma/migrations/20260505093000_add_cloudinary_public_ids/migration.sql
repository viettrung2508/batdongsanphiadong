-- AlterTable
ALTER TABLE "Media" ADD COLUMN "publicId" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "bannerImagePublicId" TEXT,
ADD COLUMN "thumbnailPublicId" TEXT;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN "bannerImagePublicId" TEXT,
ADD COLUMN "thumbnailPublicId" TEXT;
