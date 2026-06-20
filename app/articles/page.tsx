import { prisma } from "@/lib/prisma";
import ArticleList from "../components/ArticleList";
import TopicFilter from "../components/TopicFilter";
import type { ArticleRevisionWithAuthor, Content } from "@/lib/types";

export const dynamic = "force-dynamic";

const TOPICS = [
  { name: "Alle", value: "" },
  { name: "Dampfmaschine", value: "dampfmaschine" },
  { name: "Computer", value: "computer" },
  { name: "Internet", value: "internet" },
  { name: "Robotik", value: "robotik" },
];

interface Props {
  searchParams: Promise<{
    search?: string;
    topic?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { search, topic } = await searchParams;

  const approvedRevisions = await prisma.articleRevision.findMany({
    where: {
      status: "APPROVED",
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { searchText: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        topic
          ? {
              OR: [
                { title: { contains: topic, mode: "insensitive" } },
                { searchText: { contains: topic, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    include: {
      author: {
        select: { username: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const articles: ArticleRevisionWithAuthor[] = approvedRevisions.map(
    (revision) => ({
      articleId: revision.articleId,
      title: revision.title,
      createdAt: revision.createdAt,
      content: revision.content as Content,
      author: revision.author,
    }),
  );

  return (
    <div className="bg-stone-800">
      <main className="max-w-4xl mx-auto p-6 bg-stone-200">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-stone-800">
            Aktuelle Beiträge ({articles.length})
          </h2>

          <div className="mb-6">
            <TopicFilter currentTopic={topic} topics={TOPICS} />
          </div>

          <ArticleList articles={articles} />
        </section>
      </main>
    </div>
  );
}
