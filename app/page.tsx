import { prisma } from "@/lib/prisma"; 
import Link from "next/link";
import Hero from "./components/Hero";
import Button from "./components/ui/Button";


export const dynamic = "force-dynamic"; // Neuer Datenbankzugriff bei neuladen

export default function HomePage() { // Umbenannt von LandingPage und jetzt die Root-Seite
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">Willkommen bei Chronotech!</h2>
        <p className="text-lg text-stone-700 leading-relaxed mb-4">
          Chronotech ist dein zentraler Treffpunkt für alle, die sich für Technikgeschichte, innovative Projekte und die Zukunft der Technologie begeistern. Tauche ein in spannende Artikel, diskutiere mit Gleichgesinnten und teile dein Wissen in unserer wachsenden Community.
        </p>
        <p className="text-lg text-stone-700 leading-relaxed">
          Egal, ob du ein erfahrener Experte bist oder gerade erst deine Reise in die Welt der Technik beginnst – hier findest du Inspiration, Austausch und neue Perspektiven.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/articles/new">
            <Button>
              Artikel schreiben
            </Button>
          </Link>
          <Link href="/articles"> {/* Link zur neuen Artikelübersichtsseite */}
            <Button variant="primary">
              Alle Artikel ansehen
            </Button>
          </Link>
        </div>
      </section>

      {/* Developer Roadmap Section */}
      <section className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">Unsere Entwicklungs-Roadmap</h2>
        <p className="text-lg text-stone-700 leading-relaxed mb-6">
          Chronotech ist ein lebendiges Projekt, das ständig weiterentwickelt wird. Hier siehst du, woran wir gerade arbeiten und was als Nächstes geplant ist. Deine Ideen und Feedback sind immer willkommen!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aktuelle Entwicklung */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">🚀 Aktuelle Entwicklung</h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Verbesserte URL-Validierung für Video- und Simulations-Einbettungen (Server-seitig)</li>
              <li>Sicherere Simulationslogik (Entfernung der direkten Code-Ausführung)</li>
              <li>Implementierung eines vollständigen Revisionssystems für Artikel</li>
              <li>Syntax-Highlighting für Code-Blöcke in Artikeln</li>
              <li>Fehlerbehebung und Stabilitätsverbesserungen</li>
            </ul>
          </div>

          {/* Geplante Features */}
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">💡 Geplante Features</h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>**Vorschau-Funktion** für alte Artikel-Revisionen</li>
              <li>**Rollback-Funktion:** Alte Artikelversionen wiederherstellen</li>
              <li>**Benutzerprofile:** Erweiterte Profilseiten für Autoren</li>
              <li>**Benachrichtigungssystem:** Toasts für Aktionen (Speichern, Löschen etc.)</li>
              <li>**Erweiterte Suche & Filter:** Nach Themen, Autoren, Datum filtern</li>
              <li>**Interaktive Diagramme/Visualisierungen:** Sichere Einbettungsmöglichkeiten</li>
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