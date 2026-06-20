-- AlterTable
ALTER TABLE "ArticleRevision" ADD COLUMN IF NOT EXISTS "searchText" TEXT NOT NULL DEFAULT '';

-- Backfill searchText from title for existing rows
UPDATE "ArticleRevision" SET "searchText" = "title" WHERE "searchText" = '';

-- Remove default after backfill (optional, keeps schema strict)
ALTER TABLE "ArticleRevision" ALTER COLUMN "searchText" DROP DEFAULT;
