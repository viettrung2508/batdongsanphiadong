ALTER TYPE "PropertyKind" ADD VALUE 'APARTMENT';

ALTER TABLE "Property"
ADD COLUMN "parentProjectId" TEXT;

CREATE INDEX "Property_parentProjectId_idx" ON "Property"("parentProjectId");

ALTER TABLE "Property"
ADD CONSTRAINT "Property_parentProjectId_fkey"
FOREIGN KEY ("parentProjectId") REFERENCES "Property"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
