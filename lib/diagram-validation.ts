import type { Diagram } from "@/lib/types";

export type DiagramValidationError = {
  type:
    | "NO_LABELS"
    | "NO_SERIES"
    | "INCONSISTENT_VALUES"
    | "EMPTY_SERIES_NAME"
    | "INVALID_VALUES";
  message: string;
  severity: "error" | "warning";
};

/**
 * Validiert ein Diagramm auf Konsistenz
 * @param diagram - Das zu validierende Diagramm
 * @returns Array von Validierungsfehlern (leer wenn alles OK ist)
 */
export function validateDiagram(diagram: Diagram): DiagramValidationError[] {
  const errors: DiagramValidationError[] = [];

  if (diagram.labels.length === 0) {
    errors.push({
      type: "NO_LABELS",
      message: "Diagramm hat keine Labels",
      severity: "error",
    });
  }

  if (diagram.series.length === 0) {
    errors.push({
      type: "NO_SERIES",
      message: "Diagramm hat keine Datenserien",
      severity: "error",
    });
  }

  // Prüfe auf konsistente Values-Längen
  if (diagram.labels.length > 0) {
    const expectedLength = diagram.labels.length;
    const inconsistentSeries = diagram.series.filter(
      (s) => s.values.length !== expectedLength
    );

    if (inconsistentSeries.length > 0) {
      errors.push({
        type: "INCONSISTENT_VALUES",
        message: `${inconsistentSeries.length} Serie(n) haben eine unterschiedliche Anzahl von Werten (erwartet: ${expectedLength})`,
        severity: "error",
      });
    }
  }

  // Prüfe auf leere Serie-Namen
  const emptyNames = diagram.series.filter((s) => !s.name.trim());
  if (emptyNames.length > 0) {
    errors.push({
      type: "EMPTY_SERIES_NAME",
      message: `${emptyNames.length} Serie(n) haben keinen Namen`,
      severity: "warning",
    });
  }

  // Prüfe auf ungültige Werte
  const hasInvalidValues = diagram.series.some((s) =>
    s.values.some((v) => typeof v !== "number" || isNaN(v))
  );

  if (hasInvalidValues) {
    errors.push({
      type: "INVALID_VALUES",
      message: "Einige Werte sind keine gültigen Zahlen",
      severity: "error",
    });
  }

  return errors;
}

/**
 * Repariert Diagramm-Inkonsistenzen automatisch
 * @param diagram - Das zu reparierende Diagramm
 * @returns Repariertes Diagramm
 */
export function fixDiagram(diagram: Diagram): Diagram {
  const expectedLength = diagram.labels.length;

  // Repariere Series mit falscher Werte-Länge
  const fixedSeries = diagram.series.map((s) => {
    if (s.values.length > expectedLength) {
      return {
        ...s,
        values: s.values.slice(0, expectedLength),
      };
    }
    if (s.values.length < expectedLength) {
      return {
        ...s,
        values: [...s.values, ...Array(expectedLength - s.values.length).fill(0)],
      };
    }
    return s;
  });

  // Gebe leeren Namen Standard-Namen
  const fixedSeriesWithNames = fixedSeries.map((s, idx) => ({
    ...s,
    name: s.name.trim() || `Serie ${idx + 1}`,
  }));

  return {
    ...diagram,
    series: fixedSeriesWithNames,
  };
}

/**
 * Prüft ob ein Diagramm gültig genug für Speicherung ist
 * @param diagram - Das zu prüfende Diagramm
 * @returns true wenn das Diagramm gespeichert werden kann
 */
export function isDiagramSaveable(diagram: Diagram): boolean {
  const errors = validateDiagram(diagram);
  const criticalErrors = errors.filter((e) => e.severity === "error");
  return criticalErrors.length === 0;
}
