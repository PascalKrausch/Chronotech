import Link from "next/link"
import Button from "../components/ui/Button";

type Topic = {
  name: string
  value: string
}

type Props = {
  search?: string
  topic?: string
  topics: Topic[]
}

export default function SearchBar() {
  return (
    <form 
      method="GET"
      action="/articles"
      className="flex gap-2,"
    >
      <input
        type="text"
        name="search"
        placeholder="Artikel suchen..."
        className="w-full border rounded-md px-3 py-2 bg-white"
      />

      <Button
        type="submit">
        Suche
      </Button>
    </form>
  )
}