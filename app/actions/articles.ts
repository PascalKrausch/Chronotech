"use server";

import { prisma } from "@/lib/prisma";
import { extractSearchText } from "@/lib/article-utils";
import { REVISION_STATUS, type Content } from "@/lib/types";
import { Prisma } from "@/prisma/generated/client/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../auth";

const ALLOWED_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "streamlit.app",
  "vercel.app",
  "github.io",
];

function isValidUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    return (
      url.protocol === "https:" &&
      ALLOWED_DOMAINS.some((domain) => url.hostname.endsWith(domain))
    );
  } catch {
    return false;
  }
}

function toJsonContent(contentState: Content): Prisma.InputJsonValue {
  return contentState as unknown as Prisma.InputJsonValue;
}

export async function createArticle({
  title,
  contentState,
}: {
  title: string;
  contentState: Content;
}) {
  if (!title || !contentState) {
    throw new Error("Titel und Inhalt sind erforderlich.");
  }

  contentState.Article.forEach((block) => {
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

  const newArticle = await prisma.article.create({
    data: {},
  });

  await prisma.articleRevision.create({
    data: {
      articleId: newArticle.id,
      authorId,
      title,
      content: toJsonContent(contentState),
      searchText: extractSearchText(title, contentState),
      status: REVISION_STATUS.APPROVED,
    },
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
    where: { articleId, status: REVISION_STATUS.APPROVED },
  });

  if (!firstRevision) throw new Error("Artikel nicht gefunden");

  if (firstRevision.authorId !== userId) {
    throw new Error("Du bist nicht der Autor dieses Artikels!");
  }

  await prisma.articleRevision.deleteMany({ where: { articleId } });
  await prisma.comment.deleteMany({ where: { articleId } });

  await prisma.article.delete({
    where: { id: articleId },
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

  contentState.Article.forEach((block) => {
    if ((block.type === "Video" || block.type === "Simulation") && block.url) {
      if (!isValidUrl(block.url)) {
        throw new Error(`Ungültige oder nicht erlaubte URL: ${block.url}`);
      }
    }
  });

  await prisma.$transaction(async (tx) => {
    const revision = await tx.articleRevision.findFirst({
      where: {
        articleId,
        status: REVISION_STATUS.APPROVED,
      },
    });

    if (!revision) {
      throw new Error("Artikel nicht gefunden");
    }

    if (revision.authorId !== userId) {
      throw new Error("Keine Berechtigung");
    }

    const archivedRevision = await tx.articleRevision.updateMany({
      where: {
        id: revision.id,
        status: REVISION_STATUS.APPROVED,
      },
      data: {
        status: REVISION_STATUS.SUPERSEDED,
      },
    });

    if (archivedRevision.count !== 1) {
      throw new Error("Der Artikel wurde zwischenzeitlich geändert. Bitte erneut versuchen.");
    }

    await tx.articleRevision.create({
      data: {
        articleId,
        authorId: userId,
        title,
        content: toJsonContent(contentState),
        searchText: extractSearchText(title, contentState),
        status: REVISION_STATUS.APPROVED,
      },
    });
  });

  revalidatePath("/");
  revalidatePath(`/articles/${articleId}`);
  revalidatePath(`/articles/${articleId}/history`);

  return {
    success: true,
  };
}

export async function rollbackArticle(
  articleId: string,
  revisionId: string,
): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Nicht eingeloggt");
  }

  await prisma.$transaction(async (tx) => {
    const [currentRevision, targetRevision] = await Promise.all([
      tx.articleRevision.findFirst({
        where: {
          articleId,
          status: REVISION_STATUS.APPROVED,
        },
      }),
      tx.articleRevision.findFirst({
        where: {
          id: revisionId,
          articleId,
          status: REVISION_STATUS.SUPERSEDED,
        },
      }),
    ]);

    if (!currentRevision || !targetRevision) {
      throw new Error("Artikelversion nicht gefunden");
    }

    if (currentRevision.authorId !== userId) {
      throw new Error("Keine Berechtigung");
    }

    const archivedRevision = await tx.articleRevision.updateMany({
      where: {
        id: currentRevision.id,
        status: REVISION_STATUS.APPROVED,
      },
      data: {
        status: REVISION_STATUS.SUPERSEDED,
      },
    });

    if (archivedRevision.count !== 1) {
      throw new Error("Der Artikel wurde zwischenzeitlich geändert. Bitte erneut versuchen.");
    }

    const contentState = targetRevision.content as Content;

    await tx.articleRevision.create({
      data: {
        articleId,
        authorId: userId,
        title: targetRevision.title,
        content: toJsonContent(contentState),
        searchText: extractSearchText(targetRevision.title, contentState),
        status: REVISION_STATUS.APPROVED,
      },
    });
  });

  revalidatePath("/");
  revalidatePath(`/articles/${articleId}`);
  revalidatePath(`/articles/${articleId}/history`);
}
