import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "./generated/client/client";
import bcrypt from "bcrypt";
import { extractSearchText } from "../lib/article-utils";
import type { Content } from "../lib/types";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.comment.deleteMany({});
  await prisma.articleRevision.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("bobbobbob", 10);

  const admin = await prisma.user.create({
    data: {
      username: "Thomas Newcomen",
      email: "thomasnewcomen@steammaschine.de",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  const article = await prisma.article.create({});

  const content: Content = {
    Article: [
      {
        type: "TextAbschnitt",
        content:
          "Die atmosphärische Dampfmaschine von Thomas Newcomen war die erste funktionierende Dampfmaschine und markierte den Beginn der industriellen Revolution.",
      },
      {
        type: "SubHeader",
        content: "Funktionsweise",
      },
      {
        type: "TextAbschnitt",
        content:
          "Newcomens Maschine nutzte atmosphärischen Druck, um einen Kolben nach unten zu bewegen und Wasser aus Minen zu pumpen.",
      },
    ],
  };

  const title = "Die Newcomen-Dampfmaschine (1712)";

  await prisma.articleRevision.create({
    data: {
      articleId: article.id,
      authorId: admin.id,
      title,
      content: content as unknown as Prisma.InputJsonValue,
      searchText: extractSearchText(title, content),
      status: "APPROVED",
    },
  });

  console.log("Datenbank erfolgreich mit Testdaten gefüllt!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
