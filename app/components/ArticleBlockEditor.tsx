"use client"
import type { EntireArticle } from "@/lib/types";
import { useState } from "react";
import { uploadMedia } from "@/lib/supabase-upload";
import { validateTable, fixTable } from "@/lib/table-validation";
import { validateDiagram, fixDiagram } from "@/lib/diagram-validation";
import TableValidationWarnings from "./TableValidationWarnings";
import DiagramValidationWarnings from "./DiagramValidationWarnings";
import DiagramChart from "./DiagramChart";
import {DiagramEditor} from "./DiagramEditor";
import { toast } from "sonner";

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
  const [uploading, setUploading] = useState(false);
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
      

      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          setUploading(true);
          const publicUrl = await uploadMedia(file);
          onUpdate(index, { src: publicUrl });
          toast.success("Bild erfolgreich hochgeladen!");
        } catch (error: any) {
          toast.error(error.message || "Fehler beim Bild-Upload");
        } finally {
          setUploading(false);
        }
      };
      return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-stone-50 border-stone-200">
          <span className="text-sm font-semibold text-stone-700">🖼️ Bild</span>
          {/* Datei Upload Feld */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-stone-500 font-medium">Datei hochladen:</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              onChange={handleFileChange}
            />
            {uploading && <span className="text-xs text-blue-500 animate-pulse">Lädt hoch...</span>}
          </div>

          <div className="text-xs text-stone-400 text-center my-1">— ODER —</div>
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

      case "Table":
        const addRow = () => {
          const newRow = Array(block.headers.length).fill("");
          const rows = [...block.rows, newRow];
          onUpdate(index, { rows });
        };

        const removeRow = (rowIndex: number) => {
          const rows = block.rows.filter((_, i) => i !== rowIndex);
          onUpdate(index, { rows });
        };

        const addColumn = () => {
          const headers = [...block.headers, `Spalte ${block.headers.length + 1}`];
          const rows = block.rows.map((row) => [...row, ""]);
          onUpdate(index, { headers, rows });
        };

        const removeColumn = (colIndex: number) => {
          const headers = block.headers.filter((_, i) => i !== colIndex);
          const rows = block.rows.map((row) =>
            row.filter((_, i) => i !== colIndex)
          );
          onUpdate(index, { headers, rows });
        };

        return (
          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-stone-50 border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-700">📊 Tabelle</span>
              <div className="flex gap-2">
                <button
                  onClick={addColumn}
                  className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded transition-colors"
                  title="Spalte hinzufügen"
                >
                  + Spalte
                </button>
                <button
                  onClick={addRow}
                  className="px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded transition-colors"
                  title="Zeile hinzufügen"
                >
                  + Zeile
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-stone-100">
                    {block.headers.map((header, col) => (
                      <th key={col} className="border border-stone-300 p-2 relative group">
                        <div className="flex gap-1">
                          <input
                            value={header}
                            onChange={(e) => {
                              const headers = [...block.headers];
                              headers[col] = e.target.value;
                              onUpdate(index, { headers });
                            }}
                            placeholder="Spalten-Name"
                            className="w-full px-2 py-1 border border-stone-200 rounded text-sm font-semibold text-stone-700 bg-white focus:ring-1 focus:ring-blue-400 outline-hidden"
                          />
                          {block.headers.length > 1 && (
                            <button
                              onClick={() => removeColumn(col)}
                              className="px-1.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                              title="Spalte löschen"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={r} className="hover:bg-stone-50 transition-colors group">
                      {row.map((cell, c) => (
                        <td key={c} className="border border-stone-300 p-2">
                          <input
                            value={cell}
                            onChange={(e) => {
                              const rows = [...block.rows];
                              rows[r][c] = e.target.value;
                              onUpdate(index, { rows });
                            }}
                            placeholder="Wert eingeben"
                            className="w-full px-2 py-1 border border-stone-200 rounded text-sm text-stone-700 bg-white focus:ring-1 focus:ring-blue-400 outline-hidden"
                          />
                        </td>
                      ))}
                      <td className="bg-stone-100 p-2 border border-stone-300 border-l-0">
                        {block.rows.length > 1 && (
                          <button
                            onClick={() => removeRow(r)}
                            className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded transition-colors w-full"
                            title="Zeile löschen"
                          >
                            Löschen
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-stone-500 p-2 bg-white rounded border border-stone-200">
              <p>💡 Zeilen: {block.rows.length} | Spalten: {block.headers.length}</p>
            </div>

            {block.type === "Table" && (
              <TableValidationWarnings
                errors={validateTable(block)}
                onAutoFix={() => onUpdate(index, fixTable(block))}
              />
            )}
          </div>
        );

      case "Diagram":
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-stone-50 border-stone-200">
      
      <DiagramEditor block={block} index={index} onUpdate={onUpdate} />

      <DiagramValidationWarnings
        errors={validateDiagram(block)}
        onAutoFix={() => onUpdate(index, fixDiagram(block))}
      />

      {block.labels.length > 0 && block.series.length > 0 && (
        <div className="border rounded-lg bg-white p-4">
          <p className="text-xs font-medium text-stone-600 mb-2">
            📊 Vorschau:
          </p>
          <div className="overflow-x-auto" style={{ height: 200 }}>
            <DiagramChart block={block} />
          </div>
        </div>
      )}
    </div>
  );

    default:
      return null;
  }
}
