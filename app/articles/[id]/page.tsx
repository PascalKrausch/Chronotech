import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "../../auth";
import CommentForm from "./CommentForm";
import { deleteComment } from "@/app/actions/comments";
import Button from "../../components/ui/Button";
import {deleteArticle} from "../../actions/articles"
import CommentItem from "../../components/CommentItem";
import type { Content, EntireArticle } from "@/lib/types";
import ArticleBlock from "../../components/ArticleBlock";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: Props) {
  
  const { id } = await params;
  const session = await auth();

  // Artikel und Kommentare laden
  const revision = await prisma.articleRevision.findFirst({
    where: { 
      articleId: id,
      status: "APPROVED" 
    },
    include: {
      author: true,
      article: {
        include: {
          comments: {
            include: { user: true },
            orderBy: { createdAt: "asc" } // Älteste Kommentare zuerst
          }
        }
      }
    }
  });

  // Falls unter der ID nichts existiert 
  if (!revision) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Beitrag nicht gefunden</h2>
        <p>Die ID <strong>{id}</strong> existiert nicht in der Datenbank.</p>
        <Link href="/">⬅️ Zurück zur Übersicht</Link>
      </div>
    );
  }

  const content = revision.content as Content;

  console.log("CONTENT", revision.content);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-stone-200 text-stone-900">
      <Link href="/">⬅️ Zurück zur Übersicht</Link>
      <hr style={{ margin: "1.5rem 0" }} />

      
      {/* Gesamter Inhalt des Beitrags */}

      {/* Flex-Container für Titel und Buttons*/}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
      <h1 className="margin-0 leading-tight text-zinc-700 text-2xl font-semibold">{revision.title}</h1>

      {session?.user?.id === revision.authorId && (
    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 shadow-sm shrink-0">
      
      {/* Button 1: Link zur edit-page */}
      <Link href={`/articles/${id}/edit`}>
        <Button type="button" className="px-3 py-1.5 text-sm font-medium">
          ✏️ Bearbeiten
        </Button>
      </Link>

      {/* Button: Link zur History */}
      <Link href={`/articles/${id}/history`}>
        <Button type="button" className="px-3 py-1.5 text-sm font-medium bg-white text-stone-600 border border-stone-200 hover:bg-stone-50">
          📜 Historie
        </Button>
      </Link>

      {/* Button 2: Löschen */}
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
  {/* neuer div für artikelinhalt und kommentare*/}
      </div>

      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        Autor: {revision.author.username} | Veröffentlicht am: {new Date(revision.createdAt).toLocaleDateString("de-DE")}
      </p>
      
      <div
  style={{
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginTop: "2rem",
    marginBottom: "3rem"
  }}
>
  {content.Article.map((block, index) => 
    <ArticleBlock
    key={index}
    block={block}
  />
)}
 
 
    
</div>

      <hr style={{ margin: "2rem 0" }} />

      {/* Kommentatsektion*/}
      <section>
        <h2> Kommentare ({revision.article.comments.length})</h2>

        {/*  Liste der vorhandenen Kommentare */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "1.5rem" }}>
          {revision.article.comments.length === 0 ? (
            <p style={{ color: "#666", }}>Noch keine Kommentare vorhanden. Schreibe den ersten!</p>
          ) : (
            revision.article.comments.map((comment) => (
              <div key={comment.id} className="relative p-4 mb-3 bg-gray-50 rounded-md border border-gray-100 pb-12">
                
                {/* kommentar bearbeiten*/}

                <CommentItem 
                key={comment.id}
                comment={comment}
                currentUserId={session?.user?.id}
                articleAuthorId={revision.authorId}
                onDeleteAction={async () => {
                  "use server";
                  await deleteComment(comment.id);
                }}/>
               </div>
            ))
          )}
        </div>

        
        <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: "#f0f4f8", borderRadius: "8px" }}>
          {session?.user ? (
            <>
              <h3>Einen Kommentar hinterlassen</h3>
              
              <CommentForm articleId={id} />
            </>
          ) : (
            <p style={{ margin: 0, color: "#666" }}>
              🔒 Möchtest du mitdiskutieren? <Link href="/login">Logge dich ein</Link>, um einen Kommentar zu schreiben.
            </p>
          )}
        </div>
      </section>
      
    </div>
  );
}