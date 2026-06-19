'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export async function createComment(formData: FormData) {
  const articleId = formData.get("articleId") as string;
  const content = formData.get("content") as string;

  // Validierung
  if (!articleId || !content || content.trim() === "") {
    throw new Error("Kommentartext darf nicht leer sein.");
  }

  // Prüfen, ob der User eingeloggt ist
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Du musst eingeloggt sein, um zu kommentieren.");
  }

  // Kommentar in der Datenbank speichern
  await prisma.comment.create({
    data: {
      content: content.trim(),
      articleId: articleId,
      userId: userId,
    },
  });

  revalidatePath(`/articles/${articleId}`);
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Nicht eingeloggt");

  // User finden
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {article: {include: {
        revisions: true,
      },
    },
  },
  });

  //Errors

  if (!comment) {
    throw new Error("Kommentar nicht gefunden");
  }

  const approvedRevision = comment.article.revisions.find(
  (r) => r.status === "APPROVED"
);

  const isCommentOwner = comment.userId === userId;
  const isArticleOwner = approvedRevision?.authorId === userId;

  if (!isCommentOwner && !isArticleOwner) {
    throw new Error("Keine Berechtigung");
  }

  // Löschen
  await prisma.comment.delete({
    where: { id: commentId }
  });

  // Aktualisieren
  revalidatePath(`/articles/${comment.articleId}`);
}

export async function updateComment(commentId: string, content: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Nicht logged in");
  if (!content.trim()) throw new Error("Kommentar darf nicht leer sein.");

  // User prüfen
  const comment = await prisma.comment.findUnique({
    where: { id: commentId }
  });

  if (!comment || comment.userId !== userId) {
    throw new Error("Nicht autorisiert!");
  }

  // Datenbank aktualisieren
  await prisma.comment.update({
    where: { id: commentId },
    data: { content }
  });

  // aktualisieren
  revalidatePath(`/articles/${comment.articleId}`);
}