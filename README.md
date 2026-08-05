# ChronoTech – Interaktives Tech-Forum

[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

ChronoTech ist eine moderne, interaktive Community-Plattform für Technikbegeisterte. Tauche ein in spannende Artikel zur Technikgeschichte, innovativen Projekten und der Zukunft der Technologie. Diskutiere mit Gleichgesinnten und teile dein Wissen in einer wachsenden Community.

## 🎯 Features

- **📝 Artikel-Management**: Erstelle, bearbeite und verwalte technische Artikel
- **📚 Revisionssystem**: Vollständige Versionskontrolle für alle Artikel
- **💬 Kommentare & Diskussionen**: Interaktive Diskussionen unter Artikeln
- **👥 Benutzerkonten**: Sichere Authentifizierung mit NextAuth.js
- **🎨 Moderner Editor**: Blockbasierter Editor für strukturierte Inhalte
- **📊 Code-Syntax-Highlighting**: Professionelle Darstellung von Code-Snippets
- **🔍 Such- und Filterfunktionen**: Einfach Artikel finden
- **📱 Responsive Design**: Optimiert für alle Geräte

## 🚀 Aktuelle Entwicklung

- Verbesserung der Artikel-Editor-Benutzeroberfläche
- Implementierung eines vollständigen Revisionssystems
- Syntax-Highlighting für Code-Blöcke
- Benachrichtigungssystem (Toasts für Aktionen)
- Bessere Such- und Filtermöglichkeiten

## 💡 Geplante Features

- Vorschau-Funktion für alte Artikel-Revisionen
- Rollback-Funktion zum Wiederherstellen alter Versionen
- Erweiterung um Diagramme und technische Zeichnungen
- Simulations-Editor zur Visualisierung zeitabhängiger Prozesse

## 🛠️ Tech-Stack

### Frontend
- **Next.js 16** – React-Framework mit App Router
- **React 19** – UI-Bibliothek
- **TypeScript** – Typsichere Entwicklung
- **Tailwind CSS 4** – Utility-First CSS
- **Recharts** – Datenvisualisierung
- **Matter.js** – Physik-Simulationen
- **PrismJS** – Code-Syntax-Highlighting
- **DOMPurify** – HTML-Sanitierung

### Backend
- **Next.js API Routes** – Serverless Backend
- **Prisma 7** – ORM für Datenbank-Operationen
- **PostgreSQL** – Relationale Datenbank
- **Supabase** – Backend-as-a-Service (optional)

### Authentifizierung & Sicherheit
- **NextAuth.js 5** – Authentifizierung
- **bcrypt** – Passwort-Hashing
- **JWT** – Token-basierte Authentifizierung

## 📦 Installation & Setup

### Voraussetzungen
- Node.js 20+ 
- PostgreSQL (lokal oder via Supabase)
- npm oder yarn

### 1. Projekt klonen
```bash
git clone https://github.com/PascalKrausch/Chronotech.git
cd interactive-techforum
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren
```bash
cp .env.example .env.local
```

Folgende Variablen sind erforderlich:
```env
# Datenbank
DATABASE_URL=postgresql://user:password@localhost:5432/chronotech

# Authentifizierung
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Datenbank initialisieren
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Entwicklungsserver starten
```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar.

## 📂 Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── api/               # API-Routes
│   ├── auth/              # Authentifizierung
│   ├── articles/          # Artikel-Seiten
│   ├── login/             # Login-Seite
│   ├── register/          # Registrierung
│   ├── components/        # React-Komponenten
│   └── page.tsx           # Homepage
├── prisma/                # Datenbank-Schema
│   └── schema.prisma      # Prisma-Schema
├── lib/                   # Utility-Funktionen
├── public/                # Statische Assets
├── node_modules/          # Dependencies
├── package.json           # Projekt-Metadaten
├── tsconfig.json          # TypeScript-Konfiguration
└── tailwind.config.ts     # Tailwind-Konfiguration
```

## 🚀 Production Build

### Build erstellen
```bash
npm run build
```

### Production-Server starten
```bash
npm run start
```

## 📝 Entwicklungs-Commands

| Command | Beschreibung |
|---------|-------------|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Production-Build erstellen |
| `npm run start` | Production-Server starten |
| `npm run lint` | ESLint ausführen |

## 🧪 Testing

Zur Durchführung von Tests verwende:
```bash
npm run test
```

## 📚 Dokumentation

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org/)

## 🤝 Beitragen

Wir freuen uns über Contributions! Bitte beachte folgende Schritte:

1. **Fork** das Repository
2. **Branch** erstellen: `git checkout -b feature/meine-feature`
3. **Änderungen** committen: `git commit -m 'Add: neue Feature'`
4. **Push** zum Branch: `git push origin feature/meine-feature`
5. **Pull Request** öffnen

### Code-Stil
- TypeScript für Type-Sicherheit verwenden
- Komponenten mit PascalCase benennen
- Utility-Funktionen mit camelCase benennen
- ESLint-Regeln befolgen

## 📄 Lizenzen

Dieses Projekt steht unter der MIT-Lizenz – siehe [LICENSE](LICENSE) für Details.

## 👨‍💻 Autor

**Pascal Krausch**
- GitHub: [@PascalKrausch](https://github.com/PascalKrausch)
- Repository: [Chronotech](https://github.com/PascalKrausch/Chronotech)

## 💬 Support & Kontakt

Hast du Fragen oder Ideen? Öffne ein [Issue](https://github.com/PascalKrausch/Chronotech/issues) oder kontaktiere uns direkt!

---

**ChronoTech** – *Dein zentraler Treffpunkt für Technik und Innovation* 🚀
