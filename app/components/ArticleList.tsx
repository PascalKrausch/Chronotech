import ArticleCard from "./ArticleCard";
import type { ArticleRevisionWithAuthor } from "@/lib/types";

type Props = {
  articles: ArticleRevisionWithAuthor[];
};

export default function ArticleList({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <p className="text-slate-500 italic">Noch keine Beiträge vorhanden.</p>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard key={article.articleId} revision={article} />
      ))}
    </div>
  );
}
