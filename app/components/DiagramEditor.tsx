import { useState } from "react";
import type { ChangeEvent } from "react";

type Series = { name: string; values: number[] };
type DiagramBlock = {
  type: "Diagram";
  title?: string;
  chartType: "line" | "bar" | "pie";
  labels: string[];
  series: Series[];
};

export const DiagramEditor = ({
  block,
  index,
  onUpdate,
}: {
  block: DiagramBlock;
  index: number;
  onUpdate: (index: number, updated: Partial<DiagramBlock>) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"table" | "raw">("table");
  const [rawDraft, setRawDraft] = useState(() => serializeDiagram(block));
  const [rawDraftDirty, setRawDraftDirty] = useState(false);
  const [rawError, setRawError] = useState("");
  const [valueDrafts, setValueDrafts] = useState<Record<string, string>>({});

  const handleLabelChange = (lblIndex: number, newValue: string) => {
    const newLabels = [...block.labels];
    newLabels[lblIndex] = newValue;
    onUpdate(index, { labels: newLabels });
  };

  const handleSeriesNameChange = (sIndex: number, newName: string) => {
    const newSeries = [...block.series];
    newSeries[sIndex] = { ...newSeries[sIndex], name: newName };
    onUpdate(index, { series: newSeries });
  };

  const handleValueChange = (sIndex: number, vIndex: number, rawVal: string) => {
    const val = Number(rawVal.replace(",", "."));
    if (!isValidNumericInput(rawVal)) return;

    const newSeries = [...block.series];
    const newValues = [...newSeries[sIndex].values];
    newValues[vIndex] = val;
    newSeries[sIndex] = { ...newSeries[sIndex], values: newValues };
    onUpdate(index, { series: newSeries });
  };

  const valueDraftKey = (sIndex: number, vIndex: number) => `${sIndex}:${vIndex}`;

  const clearValueDrafts = () => setValueDrafts({});

  const addColumn = () => {
    const newLabels = [...block.labels, `Kat ${block.labels.length + 1}`];
    const newSeries = block.series.map((s) => ({
      ...s,
      values: [...s.values, 0],
    }));
    clearValueDrafts();
    onUpdate(index, { labels: newLabels, series: newSeries });
  };

  const removeColumn = (lblIndex: number) => {
    const newLabels = block.labels.filter((_, i) => i !== lblIndex);
    const newSeries = block.series.map((s) => ({
      ...s,
      values: s.values.filter((_, i) => i !== lblIndex),
    }));
    clearValueDrafts();
    onUpdate(index, { labels: newLabels, series: newSeries });
  };

  const addSeries = () => {
    const newSeries = [
      ...block.series,
      {
        name: `Reihe ${block.series.length + 1}`,
        values: new Array(block.labels.length).fill(0),
      },
    ];
    clearValueDrafts();
    onUpdate(index, { series: newSeries });
  };

  const removeSeries = (sIndex: number) => {
    const newSeries = block.series.filter((_, i) => i !== sIndex);
    clearValueDrafts();
    onUpdate(index, { series: newSeries });
  };

  const addExampleData = () => {
    clearValueDrafts();
    onUpdate(index, {
      labels: ["2023", "2024", "2025"],
      series: [{ name: "Umsatz", values: [100, 140, 125] }],
    });
  };

  const startEmptyTable = () => {
    clearValueDrafts();
    onUpdate(index, {
      labels: ["Kategorie 1", "Kategorie 2"],
      series: [{ name: "Datenreihe 1", values: [0, 0] }],
    });
  };

  const openRawTab = () => {
    if (!rawDraftDirty) setRawDraft(serializeDiagram(block));
    setRawError("");
    setActiveTab("raw");
  };

  const applyRawData = () => {
    const result = parseDiagramText(rawDraft);
    if (!result.success) {
      setRawError(result.error);
      return;
    }

    clearValueDrafts();
    setRawDraftDirty(false);
    setRawError("");
    onUpdate(index, { labels: result.labels, series: result.series });
    setActiveTab("table");
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-stone-50 border-stone-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-700">📈 Diagramm erstellen</h3>
          <p className="mt-1 text-xs text-stone-600">
            Spalten sind Kategorien oder Zeitpunkte; jede Zeile ist eine Datenreihe.
          </p>
        </div>
        <div className="flex gap-1 bg-stone-200 p-1 rounded text-xs self-start">
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`px-2 py-1 rounded transition-colors ${
              activeTab === "table" ? "bg-white font-medium text-stone-800 shadow-xs" : "text-stone-600"
            }`}
          >
            Tabelle
          </button>
          <button
            type="button"
            onClick={openRawTab}
            className={`px-2 py-1 rounded transition-colors ${
              activeTab === "raw" ? "bg-white font-medium text-stone-800 shadow-xs" : "text-stone-600"
            }`}
          >
            CSV / Tabelle einfügen
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="space-y-1 text-xs font-medium text-stone-700">
            Diagrammtitel (optional)
          <input
            type="text"
            value={block.title || ""}
            className="w-full p-2.5 border rounded text-sm bg-white focus:ring-1 focus:ring-blue-400 outline-hidden"
            onChange={(e) => onUpdate(index, { title: e.target.value })}
          />
          </label>

          <label className="space-y-1 text-xs font-medium text-stone-700">
            Diagrammtyp
            <select
              value={block.chartType}
              onChange={(e) =>
                onUpdate(index, {
                  chartType: e.target.value as "line" | "bar" | "pie",
                })
              }
              className="w-full text-sm p-2.5 border rounded bg-white text-stone-700 focus:ring-1 focus:ring-blue-400 outline-hidden"
            >
              <option value="line">Linie – Entwicklungen über Zeit</option>
              <option value="bar">Balken – Werte vergleichen</option>
              <option value="pie">Kreis – Anteile einer Datenreihe</option>
            </select>
          </label>
        </div>
        <p className="text-xs text-stone-500">
          {block.chartType === "line" && "Liniendiagramme eignen sich besonders für Entwicklungen und Trends."}
          {block.chartType === "bar" && "Balkendiagramme eignen sich zum Vergleichen von Kategorien oder Reihen."}
          {block.chartType === "pie" && "Kreisdiagramme zeigen nur die erste Datenreihe; die Werte sollten Anteile ergeben."}
        </p>

        {activeTab === "table" && (
          <div className="space-y-2">
            {block.labels.length === 0 && block.series.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
                <p className="font-medium text-stone-800">Noch keine Daten eingetragen</p>
                <p className="mt-1">Füge Kategorien und Datenreihen hinzu oder starte mit einem Beispiel.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={startEmptyTable}
                    className="rounded border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Leere Tabelle beginnen
                  </button>
                  <button
                    type="button"
                    onClick={addExampleData}
                    className="rounded border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Beispieldaten einsetzen
                  </button>
                </div>
              </div>
            ) : (
              <>
            <div className="overflow-x-auto border border-stone-200 rounded-lg bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200">
                    <th className="p-2 border-r border-stone-200 w-32 min-w-[120px]">
                      Datenserie
                    </th>
                    {block.labels.map((lbl, lIdx) => (
                      <th key={lIdx} className="p-2 border-r border-stone-200 min-w-[90px]">
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={lbl}
                            aria-label={`Kategorie ${lIdx + 1}`}
                            placeholder={`Kategorie ${lIdx + 1}`}
                            onChange={(e) => handleLabelChange(lIdx, e.target.value)}
                            className="w-full bg-transparent font-medium text-stone-700 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1 outline-hidden"
                          />
                          {block.labels.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColumn(lIdx)}
                              className="text-stone-400 hover:text-red-500 font-bold px-1"
                              title="Kategorie löschen"
                              aria-label={`Kategorie ${lbl || lIdx + 1} löschen`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="p-2 w-10 text-center">
                      <button
                        type="button"
                        onClick={addColumn}
                        className="text-blue-600 hover:text-blue-800 font-bold px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100"
                        aria-label="Kategorie hinzufügen"
                        title="Kategorie (Spalte) hinzufügen"
                      >
                        +
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {block.series.map((s, sIdx) => (
                    <tr key={sIdx} className="border-b border-stone-100 last:border-b-0">
                      <td className="p-1.5 border-r border-stone-200 bg-stone-50/50">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={s.name}
                            aria-label={`Name der Datenreihe ${sIdx + 1}`}
                            placeholder={`Datenreihe ${sIdx + 1}`}
                            onChange={(e) => handleSeriesNameChange(sIdx, e.target.value)}
                            className="w-full bg-transparent font-semibold text-stone-700 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1 outline-hidden"
                          />
                          {block.series.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSeries(sIdx)}
                              className="text-stone-400 hover:text-red-500 px-1"
                              title="Reihe löschen"
                              aria-label={`Datenreihe ${s.name || sIdx + 1} löschen`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </td>
                      {block.labels.map((_, vIdx) => (
                        <td key={vIdx} className="p-1 border-r border-stone-200">
                          {(() => {
                            const draftKey = valueDraftKey(sIdx, vIdx);
                            const draft = valueDrafts[draftKey];
                            const invalid =
                              draft !== undefined &&
                              !isValidNumericInput(draft);
                            return (
                              <div>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={draft ?? String(s.values[vIdx] ?? 0)}
                                  aria-label={`${s.name || `Datenreihe ${sIdx + 1}`}, ${block.labels[vIdx] || `Kategorie ${vIdx + 1}`}`}
                                  aria-invalid={invalid}
                                  aria-describedby={invalid ? `diagram-value-error-${draftKey}` : undefined}
                                  required
                                  pattern="[+-]?(?:\\d+(?:[.,]\\d*)?|[.,]\\d+)"
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const rawValue = e.target.value;
                                    setValueDrafts((current) => ({ ...current, [draftKey]: rawValue }));
                                    handleValueChange(sIdx, vIdx, rawValue);
                                  }}
                                  className={`w-full p-1 border rounded text-stone-800 outline-hidden font-mono text-right ${
                                    invalid
                                      ? "border-red-400 bg-red-50"
                                      : "border-transparent focus:border-blue-300 focus:bg-white"
                                  }`}
                                />
                                {invalid && (
                                  <span id={`diagram-value-error-${draftKey}`} className="block text-[10px] text-red-600">
                                    Bitte eine gültige Zahl eingeben.
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                      ))}
                      <td className="p-1"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addSeries}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 py-1"
            >
              + Neue Datenreihe hinzufügen
            </button>
              </>
            )}
          </div>
        )}

        {activeTab === "raw" && (
          <div className="space-y-2">
            <textarea
              aria-label="Diagrammdaten als CSV oder Tabelle"
              rows={5}
              placeholder={"Jahr,2023,2024\nUmsatz,100,140\nKosten,50,80"}
              value={rawDraft}
              className="w-full p-3 border rounded text-xs bg-white font-mono focus:ring-1 focus:ring-blue-400 outline-hidden"
              onChange={(e) => {
                setRawDraft(e.target.value);
                setRawDraftDirty(true);
                setRawError("");
              }}
            />
            <p className="text-xs text-stone-500">
              Erste Zeile: Kategorien. Jede weitere Zeile: Datenreihenname gefolgt von Zahlen.
              Komma-, Semikolon- und Tab-getrennte Daten werden unterstützt.
            </p>
            {rawDraftDirty && (
              <p className="text-xs font-medium text-amber-700">Änderungen werden erst mit „Daten übernehmen“ in die Tabelle übertragen.</p>
            )}
            {rawError && (
              <p role="alert" className="text-sm text-red-700">
                {rawError}
              </p>
            )}
            <button
              type="button"
              onClick={applyRawData}
              className="rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              Daten übernehmen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function serializeDiagram(block: DiagramBlock) {
  return [
    block.labels.join(","),
    ...block.series.map((series) => `${series.name}: ${series.values.join(", ")}`),
  ].join("\n");
}

function isValidNumericInput(value: string) {
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim().replace(",", "."));
}

function parseDiagramText(
  text: string,
):
  | { success: true; labels: string[]; series: Series[] }
  | { success: false; error: string } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) {
    return { success: false, error: "Bitte mindestens eine Kategorie und eine Datenreihe eingeben." };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headerCells = splitDelimitedLine(lines[0], delimiter).map((label) => label.trim());
  const hasSeriesNameColumn = headerCells[0] === "";
  const labels = hasSeriesNameColumn ? headerCells.slice(1) : headerCells;
  if (labels.some((label) => !label)) {
    return { success: false, error: "Bitte alle Kategorien in der ersten Zeile benennen." };
  }
  if (labels.length === 0) {
    return { success: false, error: "Bitte mindestens eine Kategorie in der ersten Zeile eingeben." };
  }

  const series: Series[] = [];
  for (let index = 1; index < lines.length; index++) {
    const cells = splitDelimitedLine(lines[index], delimiter).map((cell) => cell.trim());
    const colonIndex = hasSeriesNameColumn ? -1 : cells[0].indexOf(":");
    const name = colonIndex >= 0 ? cells[0].slice(0, colonIndex).trim() : cells[0];
    const values = hasSeriesNameColumn
      ? cells.slice(1)
      : colonIndex >= 0
        ? [cells[0].slice(colonIndex + 1).trim(), ...cells.slice(1)]
        : cells.slice(1);

    if (!name) {
      return { success: false, error: `Bitte der Datenreihe in Zeile ${index + 1} einen Namen geben.` };
    }
    if (values.length !== labels.length) {
      return {
        success: false,
        error: `Die Datenreihe „${name}“ hat ${values.length} Werte; erwartet werden ${labels.length}.`,
      };
    }

    const numericValues = values.map((value) => {
      const normalizedValue = delimiter === "," ? value : value.replace(",", ".");
      return normalizedValue === "" ? Number.NaN : Number(normalizedValue);
    });
    if (numericValues.some((value) => !Number.isFinite(value))) {
      return { success: false, error: `Bitte nur gültige Zahlen für „${name}“ eingeben.` };
    }
    series.push({ name, values: numericValues });
  }

  return { success: true, labels, series };
}

function detectDelimiter(header: string) {
  const candidates = [",", ";", "\t"];
  return candidates.reduce((best, candidate) =>
    countUnquotedSeparators(header, candidate) > countUnquotedSeparators(header, best)
      ? candidate
      : best,
  ",");
}

function countUnquotedSeparators(line: string, delimiter: string) {
  let inQuotes = false;
  let count = 0;
  for (let index = 0; index < line.length; index++) {
    if (line[index] === '"') {
      if (inQuotes && line[index + 1] === '"') {
        index++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && line[index] === delimiter) {
      count++;
    }
  }
  return count;
}

function splitDelimitedLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        cell += '"';
        index++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === delimiter && !inQuotes) {
      cells.push(cell);
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell);
  return cells;
}