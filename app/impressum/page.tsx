import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-stone-50 min-h-screen text-stone-900">
      <div className="mb-8">
        <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors">
          ⬅️ Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Impressum</h1>
      </div>

      <section className="space-y-6 text-stone-700">
        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">Angaben gemäß § 5 TMG</h2>
        <p>
          Chronotech GmbH<br />
          Nichtstraße 2,718<br />
          31415 Nichtstadt
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">Kontakt</h2>
        <p>
          Telefon: [08314 60221023]<br />
          E-Mail: chronotech@gmail.com
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">Registereintrag</h2>
        <p>
          Eintragung im Handelsregister.<br />
          Registergericht: [ Amtsgericht Nichtstadt]<br />
          Registernummer: [1341023]
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          [100]
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://ec.europa.eu/consumers/odr/</a>.<br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
      </section>
    </div>
  );
}

