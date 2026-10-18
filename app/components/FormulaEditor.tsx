"use client";

import { useEffect, useRef, useState } from "react";
import type { MathfieldElement } from "mathlive";

type Props = {
  latex: string;
  onChange: (latex: string) => void;
};

export default function FormulaEditor({ latex, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const latexRef = useRef(latex);
  const onChangeRef = useRef(onChange);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    latexRef.current = latex;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    let cancelled = false;
    let field: MathfieldElement | null = null;

    import("mathlive").then(() => {
      if (cancelled || !containerRef.current) return;

      field = document.createElement("math-field") as MathfieldElement;
      field.className =
        "w-full p-3 text-lg bg-white border rounded focus-within:ring-2 focus-within:ring-blue-400";
      field.value = latexRef.current;
      field.addEventListener("input", () => {
        onChangeRef.current(field!.value);
      });
      containerRef.current.appendChild(field);
      fieldRef.current = field;
    });

    return () => {
      cancelled = true;
      field?.remove();
      fieldRef.current = null;
    };
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (field && field.value !== latex) {
      field.value = latex;
    }
  }, [latex]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">
          Formel eingeben (Tastatur-Symbol öffnet die Symbolpalette)
        </span>
        <button
          type="button"
          onClick={() => setShowSource((prev) => !prev)}
          className="px-2 py-1 text-xs bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded transition-colors"
        >
          {showSource ? "LaTeX ausblenden" : "LaTeX anzeigen"}
        </button>
      </div>

      <div ref={containerRef} />

      {showSource && (
        <textarea
          value={latex}
          rows={3}
          placeholder="z. B. \frac{a}{b} + \sqrt{x}"
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border rounded font-mono text-sm bg-stone-900 text-stone-100"
        />
      )}
    </div>
  );
}
