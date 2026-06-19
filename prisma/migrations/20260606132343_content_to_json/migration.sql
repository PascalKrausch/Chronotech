/*
  Warnings:

  - You are about to drop the column `simConfig` on the `ArticleRevision` table. All the data in the column will be lost.
  - Changed the type of `content` on the `ArticleRevision` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ArticleRevision" DROP COLUMN "simConfig",
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;
