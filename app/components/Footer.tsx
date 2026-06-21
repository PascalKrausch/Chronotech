import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-700 text-stone-200 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Copyright und Brand */}
        <div className="text-center md:text-left">
          
          <p className="text-sm mt-2">
            &copy; {currentYear} Chronotech. Alle Rechte vorbehalten.
          </p>
        </div>

        {/* Navigationslinks */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2 text-sm">
          <Link href="/datenschutz" className="hover:text-cyan-100 transition-colors">Datenschutz</Link>
          <Link href="/impressum" className="hover:text-cyan-100 transition-colors">Impressum</Link>
        </div>
      </div>
    </footer>
  );
}