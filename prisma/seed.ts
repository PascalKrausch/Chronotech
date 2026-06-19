import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {PrismaClient} from './generated/client/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.comment.deleteMany({});
  await prisma.articleRevision.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Einen Test-User anlegen
  const admin = await prisma.user.create({
    data: {
      username: "Thomas Newcomen",
      email: "thomasnewcomen@steammaschine.de",
      role: "ADMIN",
      password: "bobbobbob"
    },
  });

  // 3. Einen ersten Artikel inkl. einer freigegebenen Revision anlegen
  const article = await prisma.article.create({});

  await prisma.articleRevision.create({
    data: {
      articleId: article.id,
      authorId: admin.id,
      title: "Die Newcomen-Dampfmaschine (1712)",
      content: "Die atmosphärische Dampfmaschine von Thomas Newcomen war die erste funktionierende ...",
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