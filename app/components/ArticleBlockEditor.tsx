import type { EntireArticle } from "@/lib/types";

type Props = {
  block: EntireArticle;
  index: number;
  onUpdate: (index: number, fields: Partial<EntireArticle>) => void;
};

function youtubeToEmbed(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);

  if (!match) return url;

  return `https://www.youtube.com/embed/${match[1]}`;
}

export default function ArticleBlockEditor({ block, index, onUpdate }: Props) {
  switch (block.type) {
    case "SubHeader":
      return (
        <div>
          <input
            type="text"
            value={block.content}
            placeholder="Unterüberschrift"
            className="w-full p-3 border rounded font-semibold"
            onChange={(e) => onUpdate(index, { content: e.target.value })}
          />
        </div>
      );

    case "TextAbschnitt":
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={block.content}
            rows={8}
            className="w-full p-3 border rounded"
            placeholder="Absatz schreiben..."
            onChange={(e) => onUpdate(index, { content: e.target.value })}
          />
        </div>
      );

    case "Image":
      return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-stone-50 border-stone-200">
          <span className="text-sm font-semibold text-stone-700">🖼️ Bild</span>
          <input
            type="url"
            value={block.src}
            placeholder="Bild-URL (https://...)"
            className="w-full p-3 border rounded text-sm bg-white"
            onChange={(e) => onUpdate(index, { src: e.target.value })}
          />
          <input
            type="text"
            value={block.alt}
            placeholder="Alternativtext (Barrierefreiheit)"
            className="w-full p-3 border rounded text-sm bg-white"
            onChange={(e) => onUpdate(index, { alt: e.target.value })}
          />
          <input
            type="text"
            value={block.caption ?? ""}
            placeholder="Bildunterschrift (optional)"
            className="w-full p-3 border rounded text-sm bg-white"
            onChange={(e) => onUpdate(index, { caption: e.target.value })}
          />
          {block.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt || "Vorschau"} className="max-h-48 rounded" />
          )}
        </div>
      );

    case "Video":
      return (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={block.url}
            placeholder="YouTube URL einfügen..."
            className="w-full p-3 border rounded text-sm text-gray-600"
            onChange={(e) => onUpdate(index, { url: e.target.value })}
          />
          {block.url && (
            <iframe
              src={youtubeToEmbed(block.url)}
              className="w-full aspect-video rounded-lg my-6"
              allowFullScreen
              title="Video"
            />
          )}
        </div>
      );

    case "Quote":
      return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-stone-50 border-stone-200">
          <span className="text-sm font-semibold text-stone-700">💬 Zitat</span>
          <textarea
            value={block.content}
            rows={4}
            placeholder="Zitat eingeben..."
            className="w-full p-3 border rounded italic"
            onChange={(e) => onUpdate(index, { content: e.target.value })}
          />
          <input
            type="text"
            value={block.author ?? ""}
            placeholder="Autor (optional)"
            className="w-full p-3 border rounded text-sm bg-white"
            onChange={(e) => onUpdate(index, { author: e.target.value })}
          />
        </div>
      );

    case "CodeBlock":
      return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-stone-50 border-stone-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              💻 Codeblock
            </span>
            <select
              value={block.language || "typescript"}
              onChange={(e) => onUpdate(index, { language: e.target.value })}
              className="text-xs p-1 border rounded bg-white text-stone-700 focus:ring-1 focus:ring-blue-500 outline-hidden"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="css">CSS</option>
              <option value="bash">Bash</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <textarea
            value={block.code}
            rows={10}
            onChange={(e) => onUpdate(index, { code: e.target.value })}
            className="w-full p-4 rounded-lg border font-mono text-sm bg-stone-900 text-stone-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
            placeholder="// Dein Code hier..."
          />
        </div>
      );

    

    default:
      return null;
  }
}
