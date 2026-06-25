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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 mb-4">
        <label className="font-semibold">Titel</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel eingeben..."
          className="w-full p-3 border rounded"
        />
      </div>

      
        
      {sections.map((item, index) => (
        <div key={index} className="my-4">
          <ArticleBlockEditor
            block={item}
            index={index}
            onUpdate={updateContent}
          />

          <Button type="button" onClick={() => deleteSection(index)}>
            -Löschen
          </Button>
        </div>
      ))}

    <div className="mt-6 relative">
        <Button type="button" onClick={() => setShowMenu(!showMenu)}>
          + Hinzufügen
        </Button>

        {showMenu && (
          <div className="absolute z-10 mt-2 bg-white border rounded shadow-md min-w-[220px]">
            {blockTypes.map((block) => (
              <button
                key={block.type}
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-stone-100"
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
        

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Speichert..." : "+Speichern"}
      </Button>
    </form>
  );
}
