import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "../../auth";
import CommentForm from "./CommentForm";
import { deleteComment } from "@/app/actions/comments";
import Button from "../../components/ui/Button";
import { deleteArticle } from "../../actions/articles";
import CommentItem from "../../components/CommentItem";
import type { Content } from "@/lib/types";
import ArticleBlock from "../../components/ArticleBlock";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const revision = await prisma.articleRevision.findFirst({
    where: {
      articleId: id,
      status: "APPROVED",
    },
    include: {
      author: true,
      article: {
        include: {
          comments: {
            include: { user: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!revision) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-xl font-semibold">Beitrag nicht gefunden</h2>
        <p className="mt-2 text-stone-600">
          Die ID <strong>{id}</strong> existiert nicht in der Datenbank.
        </p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ⬅️ Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const content = revision.content as Content;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-stone-200 text-stone-900">
      <Link href="/">⬅️ Zurück zur Übersicht</Link>
      <hr className="my-6 border-stone-300" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h1 className="leading-tight text-zinc-700 text-2xl font-semibold">
          {revision.title}
        </h1>

        {session?.user?.id === revision.authorId && (
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 shadow-sm shrink-0">
            <Link href={`/articles/${id}/edit`}>
              <Button type="button" className="px-3 py-1.5 text-sm font-medium">
                ✏️ Bearbeiten
              </Button>
            </Link>

            <Link href={`/articles/${id}/history`}>
              <Button
                type="button"
                className="px-3 py-1.5 text-sm font-medium bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              >
                📜 Historie
              </Button>
            </Link>

            <form
              action={async () => {
                "use server";
                await deleteArticle(id);
              }}
              className="m-0"
            >
              <Button
                type="submit"
                variant="danger"
                className="px-3 py-1.5 text-sm font-medium"
              >
                🗑️ Löschen
              </Button>
            </form>
          </div>
        )}
      </div>

      <p className="text-stone-500 text-sm">
        Autor: {revision.author.username} | Veröffentlicht am:{" "}
        {new Date(revision.createdAt).toLocaleDateString("de-DE")}
      </p>

      <div className="text-lg leading-relaxed mt-8 mb-12">
        {content.Article.map((block, index) => (
          <ArticleBlock key={index} block={block} />
        ))}
      </div>

      <hr className="my-8 border-stone-300" />

      <section>
        <h2>Kommentare ({revision.article.comments.length})</h2>

        <div className="flex flex-col gap-4 mt-6">
          {revision.article.comments.length === 0 ? (
            <p className="text-stone-500">
              Noch keine Kommentare vorhanden. Schreibe den ersten!
            </p>
          ) : (
            revision.article.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={session?.user?.id}
                articleAuthorId={revision.authorId}
                onDeleteAction={async () => {
                  "use server";
                  await deleteComment(comment.id);
                }}
              />
            ))
          )}
        </div>

        <div className="mt-10 p-6 bg-stone-100 rounded-lg">
          {session?.user ? (
            <>
              <h3 className="font-semibold mb-2">
                Einen Kommentar hinterlassen
              </h3>
              <CommentForm articleId={id} />
            </>
          ) : (
            <p className="text-stone-600">
              🔒 Möchtest du mitdiskutieren?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Logge dich ein
              </Link>
              , um einen Kommentar zu schreiben.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
