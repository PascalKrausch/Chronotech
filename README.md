# ChronoTech

Eine Full-Stack-Plattform für technisches Wissen, entwickelt mit **Next.js, React, TypeScript, Prisma und PostgreSQL**.

ChronoTech verbindet Artikelverwaltung, strukturiertes Bearbeiten von Inhalten, Versionshistorie, Authentifizierung, Diskussionen und Suchfunktionen in einer Webanwendung.

Das Projekt wird vollständig eigenständig entwickelt – vom Datenmodell und der Backend-Logik über die Benutzeroberfläche bis hin zum Deployment.

## 🚀 Live-Demo

**Live:** [chronotech-steel.vercel.app](https://chronotech-steel.vercel.app)
**Repository:** [github.com/PascalKrausch/Chronotech](https://github.com/PascalKrausch/Chronotech)

---

## ✨ Was ist ChronoTech?

ChronoTech ist als Plattform gedacht, auf der technische Inhalte erstellt, gepflegt und diskutiert werden können.

Der Fokus liegt nicht nur auf der Darstellung von Artikeln, sondern auf dem vollständigen Lebenszyklus technischer Inhalte:

* Artikel erstellen und bearbeiten
* Versionshistorie verwalten
* ältere Versionen wiederherstellen
* Inhalte über Kommentare diskutieren
* Benutzer authentifizieren und verwalten
* Inhalte durchsuchen und filtern
* technische Codebeispiele sicher und lesbar darstellen

Die Anwendung befindet sich weiterhin in aktiver Entwicklung. Der Editor, der Revisions-Workflow, Benachrichtigungen sowie die Suche werden laufend weiterentwickelt.

---

## 🧩 Kernfunktionen

### Artikelverwaltung

* Technische Artikel erstellen, bearbeiten und verwalten
* Strukturierte Inhalte als JSON
* Artikelrevisionen mit Zuordnung zum jeweiligen Autor
* Veröffentlichungs- und Bearbeitungsstatus von Revisionen

### Revisionssystem

* Permanente Versionshistorie von Artikeln
* Frühere Versionen bleiben erhalten
* Wiederherstellung älterer Versionen
* Metadaten wie Autor, Status und Erstellungszeit

### Authentifizierung & Benutzerkonten

* Registrierung und Login
* Authentifizierung über NextAuth.js
* Passwort-Hashing mit bcrypt
* JWT-basierte Sessions
* Benutzerrollen zur Verwaltung von Berechtigungen

### Diskussionen

* Kommentare zu einzelnen Artikeln
* Zuordnung von Kommentaren zu Benutzern
* Permanente Diskussionshistorie

### Strukturierter Editor

* Blockbasierter Editor
* Strukturierte JSON-Darstellung der Inhalte
* Unterstützung für technische Inhalte und Codeblöcke

### Developer Experience

* Syntax-Highlighting für Code mit PrismJS
* Suche und Filterung technischer Inhalte
* Responsive Oberfläche für Desktop und mobile Geräte
* Toast-Benachrichtigungen für Benutzeraktionen

### Sicherheit

* Passwörter werden vor der Speicherung gehasht
* Gerenderte HTML-Inhalte werden mit DOMPurify bereinigt
* Datenbankzugriffe laufen über Prisma
* Anwendungsschichten für UI, API und Datenzugriff sind getrennt

---

## 🏗️ Architektur

ChronoTech verwendet den **Next.js App Router** mit serverseitiger Anwendungslogik und API-Routen.

```text
┌──────────────────────────────────────────────┐
│                  Frontend                    │
│  Next.js App Router                         │
│  React + TypeScript                         │
│  Tailwind CSS                               │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│              Anwendungsschicht              │
│  API-Routen                                  │
│  Authentifizierung                           │
│  Validierung & Business-Logik                │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│                Datenebene                   │
│  Prisma ORM                                 │
│  PostgreSQL                                 │
└──────────────────────────────────────────────┘
```

### Zentrales Datenmodell

Die Datenbank basiert im Kern auf vier wichtigen Entitäten:

```text
User
 ├── ArticleRevision
 └── Comment

Article
 ├── ArticleRevision
 └── Comment
```

Ein Artikel wird über seine Revisionen verwaltet, statt den aktuellen Inhalt einfach zu überschreiben. Dadurch wird die Versionshistorie zu einem festen Bestandteil des Datenmodells.

---

## 🔧 Technische Besonderheiten

### Revisionshistorie als Bestandteil der Domänenlogik

Änderungen an einem Artikel überschreiben nicht einfach den bisherigen Inhalt. Stattdessen wird eine neue `ArticleRevision` angelegt.

Dadurch bleiben erhalten:

* frühere Artikelstände
* Autoren der Revisionen
* Zeitstempel
* Statusinformationen
* strukturierte Inhalte

Dadurch können ältere Versionen wiederhergestellt werden, ohne direkt in der Datenbank Änderungen vornehmen zu müssen.

### Strukturierte Speicherung von Inhalten

Artikelinhalte werden als strukturiertes JSON gespeichert und nicht als undurchsichtiger Textblock.

So lassen sich unterschiedliche Inhaltstypen bzw. Blöcke abbilden, während Editor und Datenhaltung voneinander getrennt bleiben.

### Authentifizierung und Sicherheit

Die Authentifizierung erfolgt über NextAuth.js.

Passwörter werden mit bcrypt gehasht. Inhalte werden vor dem Rendern bereinigt, um potenziell gefährliches HTML nicht ungeprüft in die Anwendung zu übernehmen.

Ziel ist es, Authentifizierung, Datenhaltung und Inhaltsdarstellung nicht unnötig direkt miteinander zu vermischen.

### Entwicklung von Features über den gesamten Stack

Features werden über die komplette Anwendung hinweg umgesetzt:

```text
Benutzeraktion
      ↓
React / Next.js UI
      ↓
API-Route
      ↓
Anwendungslogik
      ↓
Prisma
      ↓
PostgreSQL
```

Das Projekt zeigt damit nicht nur isolierte Frontend-Komponenten, sondern die Entwicklung vollständiger Features über mehrere Schichten hinweg.

---

## 🛠️ Tech-Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS 4**
* **Recharts**
* **Matter.js**
* **PrismJS**
* **DOMPurify**
* **Sonner**

### Backend & Datenhaltung

* **Next.js API-Routen**
* **Prisma 7**
* **PostgreSQL**
* **Supabase** (optional)

### Authentifizierung

* **NextAuth.js 5**
* **bcrypt**
* **JWT**

---

## 📂 Projektstruktur

```text
Chronotech/
├── app/
│   ├── api/
│   ├── articles/
│   ├── auth/
│   ├── components/
│   ├── login/
│   ├── register/
│   └── page.tsx
│
├── lib/
│   └── gemeinsame Anwendungslogik
│
├── prisma/
│   └── schema.prisma
│
├── public/
├── AGENTS.md
├── CLAUDE.md
├── docker-compose.yml
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚦 Entwicklungsstand

### Bereits umgesetzt

* Artikelverwaltung
* Revisionshistorie
* Wiederherstellung von Revisionen
* Benutzer-Authentifizierung
* Benutzerrollen
* Kommentare
* Strukturierter Editor
* Syntax-Highlighting
* Suche und Filter
* Responsive Oberfläche
* Bereinigung von Inhalten
* Datenbankanbindung
* Produktives Deployment

### Aktuell in Weiterentwicklung

* Benutzeroberfläche des Artikel-Editors
* Revisions-Workflow
* Verarbeitung von Codeblöcken
* Toast-basierte Benachrichtigungen
* Suche und Filter

### Geplant

* Vorschau älterer Revisionen
* Technische Diagramme und Zeichnungen
* Weitere strukturierte Inhaltsblöcke
* Weitere Verbesserungen des Artikel-Workflows

Der geplante Simulationseditor wird als eigenständiges zukünftiges Projekt weitergeführt, damit ChronoTech auf die Verwaltung technischen Wissens fokussiert bleibt.

---

## ⚙️ Einrichtung

### Voraussetzungen

* Node.js 20+
* PostgreSQL
* npm

### 1. Repository klonen

```bash
git clone https://github.com/PascalKrausch/Chronotech.git
cd Chronotech
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Eine `.env.local` im Projektverzeichnis anlegen:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/chronotech

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

Bei Verwendung der optionalen Supabase-Integration zusätzlich:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Prisma Client generieren

```bash
npx prisma generate
```

### 5. Datenbankmigrationen anwenden

```bash
npx prisma migrate dev
```

### 6. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist anschließend erreichbar unter:

```text
http://localhost:3000
```

---

## 🏭 Produktion

Produktions-Build erstellen:

```bash
npm run build
```

Produktionsserver starten:

```bash
npm run start
```

Das Projekt ist aktuell über Vercel deployed.

---

## 📝 Entwicklungsbefehle

| Befehl          | Zweck                       |
| --------------- | --------------------------- |
| `npm run dev`   | Entwicklungsserver starten  |
| `npm run build` | Produktions-Build erstellen |
| `npm run start` | Produktionsserver starten   |
| `npm run lint`  | ESLint ausführen            |

---

## 🤖 Entwicklungsprozess

Das Repository enthält projektspezifische Entwicklungsrichtlinien in `AGENTS.md` und `CLAUDE.md`.

Ziel ist es, technische Entscheidungen an der jeweils verwendeten Next.js-Version und den Konventionen des Projekts auszurichten.

Bei der Entwicklung neuer Features wird die Anwendung als Gesamtsystem betrachtet: Änderungen werden über UI, API, Anwendungslogik und Datenhaltung hinweg betrachtet.

---

## 🎯 Warum ich das Projekt gebaut habe

ChronoTech begann als praktisches Projekt, um die Entwicklung einer technischen Wissensplattform als vollständige Full-Stack-Anwendung zu untersuchen und weiterzuentwickeln.

Dabei standen insbesondere folgende Themen im Fokus:

* relationales Datenmodellieren
* Authentifizierung
* versionierte Domänendaten
* strukturierte Editoren
* API-Design
* Integration von Frontend und Backend
* sichere Darstellung von Inhalten
* iterative Produktentwicklung
* produktives Deployment

---

## 📌 Projektstatus

ChronoTech ist ein eigenständiges Projekt und wird kontinuierlich weiterentwickelt.

Das Repository soll nicht nur einen minimalistischen Showcase darstellen, sondern die tatsächliche Implementierung und den Entwicklungsprozess zeigen.
