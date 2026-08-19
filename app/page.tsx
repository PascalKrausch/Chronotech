import Link from "next/link";
import Hero from "./components/Hero";
import Button from "./components/ui/Button";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Hero />

      <section className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">
          Willkommen bei ChronoTech!
        </h2>
        <p className="text-lg text-stone-700 leading-relaxed mb-4">
          ChronoTech ist dein zentraler Treffpunkt für alle, die sich für
          Technikgeschichte, innovative Projekte und die Zukunft der Technologie
          begeistern. Tauche ein in spannende Artikel, diskutiere mit
          Gleichgesinnten und teile dein Wissen in unserer wachsenden Community.
        </p>
        <p className="text-lg text-stone-700 leading-relaxed">
          Egal, ob du ein erfahrener Experte bist oder gerade erst deine Reise in
          die Welt der Technik beginnst – hier findest du Inspiration, Austausch
          und neue Perspektiven.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/articles">
            <Button variant="primary">Alle Artikel ansehen</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">
          Unsere Entwicklungs-Roadmap
        </h2>
        <p className="text-lg text-stone-700 leading-relaxed mb-6">
          ChronoTech ist ein lebendiges Projekt, das ständig weiterentwickelt
          wird. Hier siehst du, woran wir gerade arbeiten und was als Nächstes
          geplant ist. Deine Ideen und Feedback sind immer willkommen!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              ✅ Abgeschlossen
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Artikel-Editor mit Block-System</li>
              <li>Revisionssystem mit Versionshistorie</li>
              <li>Benachrichtigungssystem (Toasts)</li>
              <li>Such- und Filterfunktion für Artikel</li>
              <li>Bild-Upload in Artikeln</li>
              <li>Tabellen-Editor mit Validierung</li>
              <li>Diagramm-Editor mit interaktiven Charts und Validierung</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              🚀 Aktuelle Entwicklung
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Verfeinerung und Bugfixes am Diagramm-Editor</li>
              <li>Verbesserung der Tabellenbearbeitung</li>
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              💡 Geplante Features
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Rollback-Funktion: Alte Artikelversionen wiederherstellen</li>
              <li>Simulations-Editor zur Visualisierung zeitabhängiger Prozesse</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-stone-500 mt-8 text-center">
          Hast du eine Idee oder möchtest du mithelfen? Kontaktiere uns!
        </p>
      </section>
    </div>
  );
}
