import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-stone-50 min-h-screen text-stone-900">
      <div className="mb-8">
        <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors">
          ⬅️ Zurück zur Startseite
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Datenschutzerklärung</h1>
      </div>

      <section className="space-y-6 text-stone-700">
        <p>
          Wir freuen uns über Ihr Interesse an unserem Online-Angebot. Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Nachfolgend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">1. Verantwortliche Stelle</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          <br />
          [Chronotech GmbH]
          <br />
          [Nichtstraße 2,718, 31415 Nichtstadt]
          <br />
          [chronotech@gmail.com]
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">2. Erfassung und Verarbeitung personenbezogener Daten</h2>
        <p>
          Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
        </p>
        <h3 className="text-xl font-semibold text-stone-800 mt-6 mb-3">2.1. Beim Besuch der Website</h3>
        <p>
          Bei jedem Aufruf unserer Internetseite erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners. Hierbei werden folgende Daten erhoben:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Name und URL der abgerufenen Datei</li>
          <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
          <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers</li>
        </ul>
        <p>
          Die vorübergehende Speicherung der IP-Adresse durch das System ist notwendig, um eine Auslieferung der Website an den Rechner des Nutzers zu ermöglichen. Die Speicherung in Logfiles erfolgt, um die Funktionsfähigkeit der Website sicherzustellen und zur Optimierung der Website sowie zur Sicherstellung der Sicherheit unserer informationstechnischen Systeme. Eine Auswertung der Daten zu Marketingzwecken findet in diesem Zusammenhang nicht statt.
        </p>

        <h3 className="text-xl font-semibold text-stone-800 mt-6 mb-3">2.2. Bei Registrierung und Nutzung des Forums</h3>
        <p>
          Wenn Sie sich auf unserer Website registrieren, erheben wir folgende Daten:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Benutzername</li>
          <li>E-Mail-Adresse</li>
          <li>Passwort (verschlüsselt)</li>
        </ul>
        <p>
          Diese Daten werden zur Erstellung und Verwaltung Ihres Benutzerkontos, zur Bereitstellung der Forenfunktionen (z.B. Artikel erstellen, kommentieren) und zur Kommunikation mit Ihnen verwendet.
        </p>
        <p>
          Bei der Erstellung von Artikeln und Kommentaren werden Ihr Benutzername und der Zeitpunkt der Erstellung öffentlich sichtbar gespeichert.
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">3. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies. Cookies sind Textdateien, die im Internetbrowser bzw. vom Internetbrowser auf dem Computersystem des Nutzers gespeichert werden. Wenn ein Nutzer eine Website aufruft, kann ein Cookie auf dem Betriebssystem des Nutzers gespeichert werden. Dieser Cookie enthält eine charakteristische Zeichenfolge, die eine eindeutige Identifizierung des Browsers beim erneuten Aufrufen der Website ermöglicht.
        </p>
        <p>
          Wir setzen Cookies ein, um unsere Website nutzerfreundlicher zu gestalten. Einige Elemente unserer Internetseite erfordern es, dass der aufrufende Browser auch nach einem Seitenwechsel identifiziert werden kann. In den Cookies werden dabei folgende Daten gespeichert und übermittelt:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Login-Informationen (für die Session-Verwaltung)</li>
          <li>Spracheinstellungen</li>
          <li>Suchbegriffe (optional, für Komfortfunktionen)</li>
        </ul>
        <p>
          Die Rechtsgrundlage für die Verarbeitung personenbezogener Daten unter Verwendung von Cookies ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Die meisten Browser sind so eingestellt, dass sie Cookies automatisch akzeptieren. Sie können das Speichern von Cookies jedoch deaktivieren oder Ihren Browser so einstellen, dass er Sie benachrichtigt, sobald Cookies gesendet werden.
        </p>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">4. Ihre Rechte als betroffene Person</h2>
        <p>
          Sie haben das Recht:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen (Art. 15 DSGVO).</li>
          <li>Die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen (Art. 16 DSGVO).</li>
          <li>Die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen (Art. 17 DSGVO).</li>
          <li>Die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen (Art. 18 DSGVO).</li>
          <li>Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen (Art. 20 DSGVO).</li>
          <li>Ihre einmal erteilte Einwilligung jederzeit uns gegenüber zu widerrufen (Art. 7 Abs. 3 DSGVO).</li>
          <li>Sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-stone-800 mt-8 mb-4">5. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
        </p>

        <p className="mt-8 text-sm text-stone-500 italic">
          Stand: [18. Juni 2026]
        </p>
      </section>
    </div>
  );
}