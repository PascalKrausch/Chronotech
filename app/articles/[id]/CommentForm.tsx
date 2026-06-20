"use client";

import { createComment } from "@/app/actions/comments";
import { useRef } from "react";
import Button from "../../components/ui/Button";

interface CommentFormProps {
  articleId: string;
}

export default function CommentForm({ articleId }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    try {
      await createComment(formData);
      formRef.current?.reset();
    } catch {
      alert("Fehler beim Absenden des Kommentars.");
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-3 mt-4"
    >
      <input type="hidden" name="articleId" value={articleId} />

      <textarea
        name="content"
        placeholder="Kommentar verfassen..."
        rows={4}
        required
        className="w-full p-2 rounded-md border border-stone-300 font-sans"
      />

      <Button type="submit">Absenden</Button>
    </form>
  );
}
