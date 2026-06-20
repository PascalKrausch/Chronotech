import Button from "./ui/Button";

export default function SearchBar() {
  return (
    <form method="GET" action="/articles" className="flex gap-2">
      <input
        type="text"
        name="search"
        placeholder="Artikel suchen..."
        className="w-full border rounded-md px-3 py-2 bg-white"
      />

      <Button type="submit">Suche</Button>
    </form>
  );
}
