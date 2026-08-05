"use client";

import type { DiagramValidationError } from "@/lib/diagram-validation";

type Props = {
  errors: DiagramValidationError[];
  onAutoFix?: () => void;
};

export default function DiagramValidationWarnings({
  errors,
  onAutoFix,
}: Props) {
  if (errors.length === 0) return null;

  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  return (
    <div className="mt-3 p-3 rounded-lg border space-y-2">
      <div className="flex items-start justify-between">
        <div>
          {errorCount > 0 && (
            <p className="text-sm text-red-700 font-medium">
              ⚠️ {errorCount} Fehler
            </p>
          )}
          {warningCount > 0 && (
            <p className="text-sm text-amber-700 font-medium">
              ℹ️ {warningCount} Warnung(en)
            </p>
          )}
        </div>
        {onAutoFix && errorCount > 0 && (
          <button
            onClick={onAutoFix}
            className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded transition-colors"
          >
            Auto-Reparieren
          </button>
        )}
      </div>

      <ul className="space-y-1 text-sm">
        {errors.map((error, i) => (
          <li
            key={i}
            className={`text-xs ${
              error.severity === "error"
                ? "text-red-600"
                : "text-amber-600"
            }`}
          >
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
