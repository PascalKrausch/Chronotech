'use client';

import { createComment } from "@/app/actions/comments";
import { useRef } from "react";
import Button from "..//../components/ui/Button";

interface CommentFormProps {
  articleId: string;
}

export default function CommentForm({ articleId }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    try {
      await createComment(formData);
      formRef.current?.reset();
    } catch (error) {
      alert("Fehler beim Absenden des Kommentars.");
    }
  }

  return (
    <form 
      ref={formRef}
      action={handleSubmit} 
      style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}
    >
      
      <input type="hidden" name="articleId" value={articleId} />
      
      <textarea 
        name="content" 
        placeholder="Kommentar verfassen..." 
        rows={4} 
        required 
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "sans-serif" }} 
      />
      
      <Button type="submit">
        Absenden
      </Button>
    </form>
  );
}