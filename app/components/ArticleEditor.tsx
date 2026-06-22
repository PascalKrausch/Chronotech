"use client";

import { useState } from "react";
import type { Content, EntireArticle } from "@/lib/types";
import Button from "./ui/Button";
import { updateArticle, createArticle } from "@/app/actions/articles";
import ArticleBlockEditor from "./ArticleBlockEditor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  articleId?: string;
  mode: "create" | "edit";
  initialTitle: string;
  initialContent: Content;
};

const blockTypes = [
  { type: "TextAbschnitt", label: "📝 Absatz" },
  { type: "SubHeader", label: "🔠 Unterüberschrift" },
  { type: "Quote", label: "💬 Zitat" },
  { type: "Image", label: "🖼️ Bild" },
  { type: "Video", label: "🎥 Video" },
  { type: "CodeBlock", label: "💻 Codeblock" },
  { type: "Simulation", label: "📈 Simulation" },
] as const;

export default function ArticleEditor({
  initialTitle,
  initialContent,
  mode,
  articleId,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [sections, setSections] = useState<EntireArticle[]>(
    initialContent.Article,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const addSection = (type: EntireArticle["type"]) => {
    let block: EntireArticle;

    switch (type) {
      case "TextAbschnitt":
        block = { type, content: "" };
        break;
      case "SubHeader":
        block = { type, content: "" };
        break;
      case "Quote":
        block = { type, content: "" };
        break;
      case "Image":
        block = { type, src: "", alt: "" };
        break;
      case "Video":
        block = { type, url: "" };
        break;
      case "CodeBlock":
        block = { type, language: "typescript", code: "" };
        break;
      case "Simulation":
        block = { type: "Simulation", url: "" };
        break;
    }

    setSections((prev) => [...prev, block]);
  };

  const deleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Bitte einen Titel eingeben");
      return;
    }

    if (sections.length === 0) {
      alert("Der Artikel braucht mindestens einen Abschnitt");
      return;
    }

    setIsSaving(true);

    try {
      const contentState: Content = {
        Article: sections,
      };

      if (mode === "create") {
        const result = await createArticle({
          title,
          contentState,
        });
        if (result.success) {
          toast.success("Artikel erfolgreich erstellt!");
          router.push("/");
        }
      } else {
        await updateArticle({
          articleId: articleId!,
          title,
          contentState,
        });
        toast.success("Änderungen erfolgreich gespeichert!");
        router.push(`/articles/${articleId}`);
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
        toast.error(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (
    index: number,
    updatedFields: Partial<EntireArticle>,
  ) => {
    setSections((prev) =>
      prev.map((item, i) =>
        i === index ? ({ ...item, ...updatedFields } as EntireArticle) : item,
      ),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      {/* Titel-Eingabe */}
      <div className="flex flex-col gap-2 mb-6">
        <label className="font-semibold text-lg">Titel</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel eingeben..."
          className="w-full p-3 border rounded text-xl font-medium"
        />
      </div>

      {/* Liste der Abschnitte */}
      <div className="space-y-6">
        {sections.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg bg-white shadow-sm relative group">
            <ArticleBlockEditor
              block={item}
              index={index}
              onUpdate={updateContent}
            />
            <div className="mt-2 flex justify-end">
              <Button type="button" onClick={() => deleteSection(index)} className="text-red-500 bg-red-50 hover:bg-red-100">
                🗑️ Block löschen
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamischer Hinzufügen-Bereich (Jetzt unten) */}
      <div className="mt-8 mb-12 p-4 border-2 border-dashed border-stone-200 rounded-lg flex flex-col items-center justify-center bg-stone-50/50">
        <div className="relative">
          <Button type="button" onClick={() => setShowMenu(!showMenu)}>
            ➕ Block hinzufügen
          </Button>

          {showMenu && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 bg-white border rounded shadow-xl min-w-[220px]">
              {blockTypes.map((block) => (
                <button
                  key={block.type}
                  type="button"
                  className="block w-full text-left px-4 py-2.5 hover:bg-stone-100 text-sm transition-colors"
                  onClick={() => {
                    addSection(block.type);
                    setShowMenu(false);
                  }}
                >
                  {block.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {sections.length === 0 && (
          <p className="text-stone-400 text-sm mt-2">Dein Artikel ist noch leer. Füge einen Block hinzu!</p>
        )}
      </div>

      {/* Fester Footer für das Speichern */}
      <div className="border-t pt-4 flex justify-end">
        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold">
          {isSaving ? "Speichert..." : "💾 Artikel speichern"}
        </Button>
      </div>
    </form>
  );
}