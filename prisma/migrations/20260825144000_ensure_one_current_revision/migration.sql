-- A single article must have exactly one current revision at a time.
CREATE UNIQUE INDEX "ArticleRevision_one_approved_per_article"
ON "ArticleRevision" ("articleId")
WHERE "status" = 'APPROVED';
