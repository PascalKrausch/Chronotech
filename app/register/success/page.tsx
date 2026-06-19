import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <main className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
         Registrierung erfolgreich
      </h1>

      <p className="mb-6">
        Dein Account wurde erfolgreich erstellt.
      </p>

      <div className="flex gap-4 justify-center">
        
        <Link
          href="/"
          className="px-4 py-2 border rounded"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}