import Link from "next/link";
import { blockPreviewText } from "@/lib/article-utils";
import type { ArticleRevisionWithAuthor } from "@/lib/types";

type Props = {
  revision: ArticleRevisionWithAuthor;
};

export default function ArticleCard({ revision }: Props) {
  const preview =
    revision.content?.Article?.map(blockPreviewText).join(" ").slice(0, 200) ??
    "";

  return (
    <article className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-2xl font-bold text-zinc-500 hover:underline">
        <Link href={`/articles/${revision.articleId}`}>{revision.title}</Link>
      </h3>

      <p className="text-xs text-slate-600 mt-1">
        Von{" "}
        <span className="font-medium text-slate-600">
          {revision.author.username}
        </span>
        {" • "}
        {new Date(revision.createdAt).toLocaleDateString("de-DE")}
      </p>

      <p className="text-slate-600 mt-4 line-clamp-3">{preview}</p>
    </article>
  );
}
