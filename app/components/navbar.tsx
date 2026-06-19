import Link from "next/link";
import SearchBar from "./SearchBar";
import { auth, signOut } from "../auth"; 
import Button from "../components/ui/Button";

export default async function Navbar() {
  
  const session = await auth();

  return (
    <nav className="border-b bg-zinc-500">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-cyan-50">
          ChronoTech
        </Link>

        {/* Suche */}
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        {/* Auth Bereich */}
        <div className="flex gap-4 items-center">
          {session?.user ? (
            <>
              <Link href="/articles/new" className="text-stone-200 hover:text-cyan-100">
                Artikel schreiben
              </Link>
              
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <Button type="submit" variant="danger">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-stone-200 hover:text-cyan-100"
              >
                Anmelden
              </Link>

              <Link
                href="/register"
                className="bg-stone-200 text-black px-4 py-2 rounded-md hover:bg-cyan-50"
              >
                Registrieren
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}