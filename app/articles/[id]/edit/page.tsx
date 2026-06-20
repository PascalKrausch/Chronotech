import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";
import { notFound, redirect } from "next/navigation";
import type { Content } from "@/lib/types";
import ArticleEditor from "../../../components/ArticleEditor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const revision = await prisma.articleRevision.findFirst({
    where: { articleId: id, status: "APPROVED" },
    include: { author: true },
  });

  if (!revision) {
    notFound();
  }

  if (session?.user?.id !== revision.authorId) {
    redirect(`/articles/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-100 rounded-lg shadow-sm mt-8">
      <h1 className="">✏️ Artikel bearbeiten</h1>

      <ArticleEditor
        initialTitle={revision.title}
        initialContent={revision.content as Content}
        mode="edit"
        articleId={id}
      />
    </div>
  );
}
