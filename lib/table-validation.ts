import type { Table } from "@/lib/types";

export type TableValidationError = {
  type:
    | "INCONSISTENT_COLUMNS"
    | "EMPTY_HEADERS"
    | "NO_ROWS"
    | "NO_HEADERS";
  message: string;
  severity: "error" | "warning";
};

/**
 * Validiert eine Tabelle auf Konsistenz
 * @param table - Die zu validierende Tabelle
 * @returns Array von Validierungsfehlern (leer wenn alles OK ist)
 */
export function validateTable(table: Table): TableValidationError[] {
  const errors: TableValidationError[] = [];

  if (table.headers.length === 0) {
    errors.push({
      type: "NO_HEADERS",
      message: "Tabelle hat keine Header-Spalten",
      severity: "error",
    });
  }

  if (table.rows.length === 0) {
    errors.push({
      type: "NO_ROWS",
      message: "Tabelle hat keine Zeilen",
      severity: "warning",
    });
  }

  // Prüfe auf leere Headers
  const emptyHeaders = table.headers.filter((h) => !h.trim());
  if (emptyHeaders.length > 0) {
    errors.push({
      type: "EMPTY_HEADERS",
      message: `${emptyHeaders.length} Header-Spalte(n) sind leer`,
      severity: "warning",
    });
  }

  // Prüfe auf konsistente Spaltenzahl
  const expectedCols = table.headers.length;
  const inconsistentRows = table.rows.filter(
    (row) => row.length !== expectedCols
  );

  if (inconsistentRows.length > 0) {
    errors.push({
      type: "INCONSISTENT_COLUMNS",
      message: `${inconsistentRows.length} Zeile(n) haben eine unterschiedliche Anzahl von Spalten (erwartet: ${expectedCols})`,
      severity: "error",
    });
  }

  return errors;
}

/**
 * Repariert Tabellen-Inkonsistenzen automatisch
 * @param table - Die zu reparierende Tabelle
 * @returns Reparierte Tabelle
 */
export function fixTable(table: Table): Table {
  if (table.headers.length === 0) {
    return { ...table, headers: ["Spalte 1"] };
  }

  const expectedCols = table.headers.length;

  // Repariere Zeilen mit falscher Spaltenzahl
  const fixedRows = table.rows.map((row) => {
    if (row.length > expectedCols) {
      return row.slice(0, expectedCols);
    }
    if (row.length < expectedCols) {
      return [...row, ...Array(expectedCols - row.length).fill("")];
    }
    return row;
  });

  return {
    ...table,
    rows: fixedRows,
  };
}

/**
 * Prüft ob eine Tabelle gültig genug für Speicherung ist
 * @param table - Die zu prüfende Tabelle
 * @returns true wenn die Tabelle gespeichert werden kann
 */
export function isTableSaveable(table: Table): boolean {
  const errors = validateTable(table);
  const criticalErrors = errors.filter((e) => e.severity === "error");
  return criticalErrors.length === 0;
}
