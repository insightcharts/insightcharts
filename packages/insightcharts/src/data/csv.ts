import type { Row } from "./types";

const NUMERIC = /^[-+−]?(\d{1,3}(,\d{3})+|\d+)?(\.\d+)?([eE][-+]?\d+)?$/;

/** Convert a raw CSV cell to number, boolean, null or string. Dates stay strings (ISO strings sort and parse correctly). */
export function inferValue(raw: string): unknown {
  const s = raw.trim();
  if (s === "") return null;
  if (s === "true" || s === "TRUE") return true;
  if (s === "false" || s === "FALSE") return false;
  if (s === "NA" || s === "N/A" || s === "null" || s === "NaN") return null;
  // Leading zeros ("007", zip codes) are identifiers, not numbers.
  if (/^[-+−]?0\d/.test(s)) return s;
  if (NUMERIC.test(s) && /\d/.test(s)) {
    const n = Number(s.replace(/,/g, "").replace("−", "-"));
    if (Number.isFinite(n)) return n;
  }
  if (/^[-+−]?\d+(\.\d+)?%$/.test(s)) return Number(s.slice(0, -1).replace("−", "-")) / 100;
  return s;
}

function detectDelimiter(text: string): string {
  const line = text.slice(0, text.indexOf("\n") === -1 ? undefined : text.indexOf("\n"));
  const counts = [",", "\t", ";", "|"].map((d) => [d, line.split(d).length] as const);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][0];
}

export interface ParseCsvOptions {
  delimiter?: string;
  /** Set false to keep every cell as a string. */
  infer?: boolean;
}

/** RFC 4180 CSV parser with quoted fields, escaped quotes, CRLF and type inference. */
export function parseCsv(text: string, options: ParseCsvOptions = {}): Row[] {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const delimiter = options.delimiter ?? detectDelimiter(text);
  const infer = options.infer !== false;
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"' && field === "") quoted = true;
    else if (c === delimiter) {
      record.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      record.push(field);
      field = "";
      if (record.length > 1 || record[0] !== "") records.push(record);
      record = [];
    } else field += c;
  }
  if (field !== "" || record.length) {
    record.push(field);
    records.push(record);
  }
  const header = records.shift();
  if (!header) return [];
  const keys = header.map((h, i) => h.trim() || `column_${i + 1}`);
  return records.map((cells) => {
    const row: Row = {};
    for (let i = 0; i < keys.length; i++) {
      const raw = cells[i] ?? "";
      row[keys[i]] = infer ? inferValue(raw) : raw;
    }
    return row;
  });
}

/** Serialise rows to CSV (used by chart export). */
export function toCsv(rows: Row[], columns?: string[]): string {
  const keys = columns ?? Array.from(rows.reduce((set, r) => (Object.keys(r).forEach((k) => set.add(k)), set), new Set<string>()));
  const cell = (v: unknown) => {
    if (v == null) return "";
    const s = v instanceof Date ? v.toISOString() : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.map(cell).join(","), ...rows.map((r) => keys.map((k) => cell(r[k])).join(","))].join("\n");
}
