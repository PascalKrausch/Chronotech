'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../auth"; 
import type {Content} from "../../lib/types"

// Erlaubte Domains für externe Inhalte
const ALLOWED_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "streamlit.app",
  "vercel.app",
  "github.io"
];

function isValidUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    return url.protocol === "https:" && ALLOWED_DOMAINS.some(domain => url.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

export async function createArticle({ title, contentState }: { title: string; contentState: Content }) {
  
  // Validierung
  if (!title || !contentState) {
    throw new Error("Titel und Inhalt sind erforderlich.");
  }

  // URL Validierung für Video und Simulation
  contentState.Article.forEach(block => {
    if ((block.type === "Video" || block.type === "Simulation") && block.url) {
      if (!isValidUrl(block.url)) {
        throw new Error(`Ungültige oder nicht erlaubte URL: ${block.url}`);
      }
    }
  });

  const session = await auth();
  const authorId = session?.user?.id;

  if (!authorId) {
    throw new Error("Nicht eingeloggt oder Sitzung abgelaufen.");
  }

  // Artikel in der DB anlegen
  
  const newArticle = await prisma.article.create({
    data: {} 
  });

  await prisma.articleRevision.create({
    data: {
      articleId: newArticle.id,
      authorId: authorId,
      title: title,
      content: contentState as any,
      status: "APPROVED", 
    }
  });
  revalidatePath("/");
  
  return {
  success: true,
  };
}

export async function deleteArticle(articleId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Nicht eingeloggt");

  const firstRevision = await prisma.articleRevision.findFirst({
    where: { articleId: articleId, status: "APPROVED" }
  });

  if (!firstRevision) throw new Error("Artikel nicht gefunden");

  if (firstRevision.authorId !== userId) {
    throw new Error("Du bist nicht der Autor dieses Artikels!");
  }

  await prisma.articleRevision.deleteMany({ where: { articleId } });
  await prisma.comment.deleteMany({ where: { articleId } });

  await prisma.article.delete({
    where: { id: articleId }
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateArticle({
  articleId,
  title,
  contentState,
}: {
  articleId: string;
  title: string;
  contentState: Content;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Nicht eingeloggt");
  }

  const revision = await prisma.articleRevision.findFirst({
    where: {
      articleId,
      status: "APPROVED",
    },
  });

  if (!revision) {
    throw new Error("Artikel nicht gefunden");
  }

  if (revision.authorId !== userId) {
    throw new Error("Keine Berechtigung");
  }

  // URL Validierung für Video und Simulation
  contentState.Article.forEach(block => {
    if ((block.type === "Video" || block.type === "Simulation") && block.url) {
      if (!isValidUrl(block.url)) {
        throw new Error(`Ungültige oder nicht erlaubte URL: ${block.url}`);
      }
    }
  });

  // 1. Alle bisherigen "APPROVED" Revisionen dieses Artikels archivieren
  // (Normalerweise sollte es nur eine geben, aber updateMany ist hier sicher)
  await prisma.articleRevision.updateMany({
    where: { 
      articleId, 
      status: "APPROVED" 
    },
    data: {
      status: "SUPERSEDED" as any, // Status auf "überholt" setzen
    }
  });

  // 2. Eine neue Revision mit dem aktuellen Stand erstellen
  await prisma.articleRevision.create({
    data: {
      articleId,
      authorId: userId, // Der User, der die Änderung vorgenommen hat
      title,
      content: contentState as any,
      status: "APPROVED",
    }
  });

  revalidatePath("/");
  revalidatePath(`/articles/${articleId}`);

  return {
    success: true,
  };
}