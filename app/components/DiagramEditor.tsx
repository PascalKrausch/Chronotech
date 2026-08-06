import React, { useState } from "react";

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

  // Handler für Tabelleneingaben
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
    const val = parseFloat(rawVal) || 0;
    const newSeries = [...block.series];
    const newValues = [...newSeries[sIndex].values];
    newValues[vIndex] = val;
    newSeries[sIndex] = { ...newSeries[sIndex], values: newValues };
    onUpdate(index, { series: newSeries });
  };

  const addColumn = () => {
    const newLabels = [...block.labels, `Kat ${block.labels.length + 1}`];
    const newSeries = block.series.map((s) => ({
      ...s,
      values: [...s.values, 0],
    }));
    onUpdate(index, { labels: newLabels, series: newSeries });
  };

  const removeColumn = (lblIndex: number) => {
    const newLabels = block.labels.filter((_, i) => i !== lblIndex);
    const newSeries = block.series.map((s) => ({
      ...s,
      values: s.values.filter((_, i) => i !== lblIndex),
    }));
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
    onUpdate(index, { series: newSeries });
  };

  const removeSeries = (sIndex: number) => {
    const newSeries = block.series.filter((_, i) => i !== sIndex);
    onUpdate(index, { series: newSeries });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-stone-50 border-stone-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-700">📈 Diagramm</span>
        
        {/* Tab-Umschalter: Tabelle vs. Massenimport */}
        <div className="flex gap-1 bg-stone-200 p-1 rounded text-xs">
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
            onClick={() => setActiveTab("raw")}
            className={`px-2 py-1 rounded transition-colors ${
              activeTab === "raw" ? "bg-white font-medium text-stone-800 shadow-xs" : "text-stone-600"
            }`}
          >
            CSV / Text
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Titel & Typ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            value={block.title || ""}
            placeholder="Diagrammtitel (optional)"
            className="w-full p-2.5 border rounded text-sm bg-white focus:ring-1 focus:ring-blue-400 outline-hidden"
            onChange={(e) => onUpdate(index, { title: e.target.value })}
          />

          <select
            value={block.chartType}
            onChange={(e) =>
              onUpdate(index, {
                chartType: e.target.value as "line" | "bar" | "pie",
              })
            }
            className="w-full text-sm p-2.5 border rounded bg-white text-stone-700 focus:ring-1 focus:ring-blue-400 outline-hidden"
          >
            <option value="line">📊 Linien-Diagramm</option>
            <option value="bar">📊 Balken-Diagramm</option>
            <option value="pie">🥧 Kreis-Diagramm</option>
          </select>
        </div>

        {/* TABELLE MODUS */}
        {activeTab === "table" && (
          <div className="space-y-2">
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
                            onChange={(e) => handleLabelChange(lIdx, e.target.value)}
                            className="w-full bg-transparent font-medium text-stone-700 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1 outline-hidden"
                          />
                          {block.labels.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColumn(lIdx)}
                              className="text-stone-400 hover:text-red-500 font-bold px-1"
                              title="Kategorie löschen"
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
                            onChange={(e) => handleSeriesNameChange(sIdx, e.target.value)}
                            className="w-full bg-transparent font-semibold text-stone-700 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded px-1 outline-hidden"
                          />
                          {block.series.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSeries(sIdx)}
                              className="text-stone-400 hover:text-red-500 px-1"
                              title="Reihe löschen"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </td>
                      {block.labels.map((_, vIdx) => (
                        <td key={vIdx} className="p-1 border-r border-stone-200">
                          <input
                            type="number"
                            value={s.values[vIdx] ?? 0}
                            onChange={(e) => handleValueChange(sIdx, vIdx, e.target.value)}
                            className="w-full p-1 border border-transparent focus:border-blue-300 focus:bg-white rounded text-stone-800 outline-hidden font-mono text-right"
                          />
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
          </div>
        )}

        {/* RAW / CSV MODUS (Für Excel-Paste) */}
        {activeTab === "raw" && (
          <div className="space-y-2">
            <textarea
              rows={5}
              placeholder={`Kategorie1,Kategorie2,Kategorie3\nUmsatz: 100, 200, 300\nKosten: 50, 80, 100`}
              value={`${block.labels.join(",")}\n${block.series
                .map((s) => `${s.name}:${s.values.join(",")}`)
                .join("\n")}`}
              className="w-full p-3 border rounded text-xs bg-white font-mono focus:ring-1 focus:ring-blue-400 outline-hidden"
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter((l) => l.trim());
                if (lines.length === 0) return;

                // Zeile 1 = Labels
                const newLabels = lines[0].split(",").map((l) => l.trim());

                // Ab Zeile 2 = Series
                const newSeries = lines.slice(1).map((line) => {
                  const [name, vals] = line.split(":");
                  return {
                    name: name ? name.trim() : "Reihe",
                    values: vals
                      ? vals
                          .split(",")
                          .map((v) => parseFloat(v.trim()))
                          .filter((v) => !isNaN(v))
                      : [],
                  };
                });

                onUpdate(index, { labels: newLabels, series: newSeries });
              }}
            />
            <p className="text-xs text-stone-500">
              💡 Zeile 1: Kategorien (Komma-getrennt). Folgezeilen im Format <code>Name: Wert1, Wert2</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};