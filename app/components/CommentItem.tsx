"use client";

import { useState } from "react";
import Button from "../components/ui/Button";
import { updateComment } from "@/app/actions/comments";
import type { CommentWithUser } from "@/lib/types";

interface CommentItemProps {
  comment: CommentWithUser;
  currentUserId?: string;
  articleAuthorId: string;
  onDeleteAction: () => Promise<void>;
}

export default function CommentItem({
  comment,
  currentUserId,
  articleAuthorId,
  onDeleteAction,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isCommentOwner = currentUserId === comment.userId;
  const isArticleOwner = currentUserId === articleAuthorId;

  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isArticleOwner;

  async function handleSave() {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await updateComment(comment.id, content);
      setIsEditing(false);
    } catch {
      alert("Fehler beim Aktualisieren");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative p-4 mb-3 bg-gray-50 rounded-md border border-gray-100 pb-14">
      <p className="mb-2 text-sm text-gray-500">
        <strong>{comment.user.username}</strong> •{" "}
        {new Date(comment.createdAt).toLocaleDateString("de-DE")}
      </p>

      {isEditing ? (
        <div className="flex flex-col gap-2 mt-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-black bg-white"
            rows={2}
            disabled={loading}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setContent(comment.content);
              }}
              className="text-xs text-gray-500 hover:underline cursor-pointer"
              disabled={loading}
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 font-medium cursor-pointer"
              disabled={loading}
            >
              {loading ? "Speichert..." : "Speichern"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 text-sm md:text-base whitespace-pre-wrap">
          {comment.content}
        </p>
      )}

      {(canEdit || canDelete) && !isEditing && (
        <div className="absolute right-3 bottom-2.5 flex items-center gap-2">
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ✏️ Ändern
            </button>
          )}

          {canDelete && (
            <form action={onDeleteAction} className="m-0">
              <Button
                type="submit"
                variant="danger"
                className="px-2 py-1 text-xs font-semibold"
              >
                🗑️ Löschen
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
