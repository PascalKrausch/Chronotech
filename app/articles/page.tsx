import { prisma } from "@/lib/prisma"; 
import ArticleCard from "../components/ArticleCard"
import ArticleList from "../components/ArticleList"


export const dynamic = "force-dynamic"; // Neuer Datenbankzugriff bei neuladen

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
                
              ],
            }
          : {},
        
        topic
          ? {
              OR: [
                { title: { contains: topic, mode: "insensitive" } },
                
              ],
            }
          : {},
      ],
    },
    include: {
      author: {
        select: { username: true }, // Holt den Namen des Autors
      },
    },
    orderBy: {
      createdAt: "desc", // Neueste Artikel zuerst
    },
  });

  return (
    <div className="bg-stone-800">
    <main className="max-w-4xl mx-auto p-6 bg-stone-200" >
        <section>
        <h2 className="text-2xl font-semibold mb-4 text-stone-800">
          Aktuelle Beiträge ({approvedRevisions.length})
        </h2>

        <ArticleList
          articles={approvedRevisions}
        />
        
      </section>
    </main></div>
  );
}