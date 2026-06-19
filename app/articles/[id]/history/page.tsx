import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HistoryPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  // Alle Revisionen laden, sortiert nach Erstellungsdatum (neueste zuerst)
  const revisions = await prisma.articleRevision.findMany({
    where: { articleId: id },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  if (revisions.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Keine Historie gefunden.</h2>
        <Link href={`/articles/${id}`} className="text-blue-600 hover:underline mt-4 inline-block">
          Zurück zum Artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-stone-50 min-h-screen text-stone-900">
      <div className="mb-8">
        <Link href={`/articles/${id}`} className="text-stone-500 hover:text-stone-800 transition-colors">
          ⬅️ Zurück zum Artikel
        </Link>
        <h1 className="text-3xl font-bold mt-4">Versionshistorie</h1>
        <p className="text-stone-500">Alle Bearbeitungen für: <span className="italic">{revisions[0].title}</span></p>
      </div>

      <div className="space-y-4">
        {revisions.map((rev) => (
          <div
            key={rev.id}
            className={`p-5 border rounded-xl shadow-sm transition-all ${
              rev.status === "APPROVED"
                ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-100"
                : "bg-white border-stone-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    rev.status === "APPROVED" ? "bg-emerald-200 text-emerald-800" : "bg-stone-100 text-stone-500"
                  }`}>
                    {rev.status === "APPROVED" ? "Aktuell" : "Archiviert"}
                  </span>
                  <h3 className="font-bold text-lg">{rev.title}</h3>
                </div>
                <p className="text-sm text-stone-600">
                  Bearbeitet von <span className="font-semibold text-stone-800">{rev.author.username}</span> am{" "}
                  {new Date(rev.createdAt).toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              {/* Hier könnte man später eine Preview oder Diff-Funktion einbauen */}
              <div className="text-xs font-mono text-stone-400">
                ID: {rev.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}