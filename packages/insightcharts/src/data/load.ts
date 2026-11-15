import { parseCsv } from "./csv";
import type { Columnar, DataInput, RemoteSource, Row, TableLike } from "./types";

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** A string is treated as a URL when it is a single line that looks like a path or absolute URL. */
export function isUrl(s: string): boolean {
  // Commas do not disqualify: query strings (`?fields=a,b`) and every `data:` URL have them.
  return !/[\n\r]/.test(s.trim()) && /^(https?:\/\/|\/|\.\.?\/|data:)/.test(s.trim());
}

export function getPath(value: unknown, path?: string): unknown {
  if (!path) return value;
  return path.split(".").reduce<unknown>((v, key) => (isObject(v) || Array.isArray(v) ? (v as Record<string, unknown>)[key] : undefined), value);
}

function columnarToRows(cols: Columnar): Row[] {
  const keys = Object.keys(cols);
  const n = keys.reduce((max, k) => Math.max(max, cols[k].length), 0);
  const rows: Row[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const row: Row = {};
    for (const k of keys) row[k] = cols[k][i];
    rows[i] = row;
  }
  return rows;
}

function toRows(value: unknown, path?: string): Row[] {
  const v = getPath(value, path);
  if (Array.isArray(v)) {
    if (v.length === 0) return [];
    if (isObject(v[0])) return v as Row[];
    // Array of arrays with a header row.
    if (Array.isArray(v[0])) {
      const [header, ...body] = v as unknown[][];
      return body.map((cells) => Object.fromEntries(header.map((h, i) => [String(h), cells[i]])));
    }
    return (v as unknown[]).map((value, index) => ({ index, value }));
  }
  if (isObject(v)) {
    if (typeof (v as unknown as TableLike).toArray === "function") {
      return (v as unknown as TableLike).toArray().map((r) => (isObject(r) && typeof (r as { toJSON?: unknown }).toJSON === "function" ? (r as { toJSON(): Row }).toJSON() : (r as Row)));
    }
    const values = Object.values(v);
    // Columns hold scalars. An array of objects is a row list inside an envelope
    // (`{ data: [{...}] }`, `{ data: [...], errors: [] }`), not a column.
    const isRowList = (c: unknown) => Array.isArray(c) && isObject(c[0]);
    if (values.length && values.every((c) => Array.isArray(c) || ArrayBuffer.isView(c)) && !values.some(isRowList)) return columnarToRows(v as Columnar);
    // Common API envelopes.
    for (const key of ["data", "rows", "results", "items", "records"]) {
      if (Array.isArray(v[key])) return toRows(v[key]);
    }
  }
  throw new Error("InsightCharts: could not find an array of rows in the data. Pass `path` to point at it, e.g. { url, path: 'data.results' }.");
}

/**
 * Resolve data that is already in memory. Returns `null` when the input needs async work
 * (a URL, promise or function), in which case use `loadData`.
 */
export function resolveSync(input: DataInput | null | undefined): Row[] | null {
  if (input == null) return [];
  if (typeof input === "string") return isUrl(input) ? null : parseCsv(input);
  if (typeof input === "function" || input instanceof Promise) return null;
  if (isObject(input)) {
    if (typeof (input as unknown as RemoteSource).url === "string") return null;
    if (typeof (input as { csv?: unknown }).csv === "string") {
      const { csv, delimiter } = input as { csv: string; delimiter?: string };
      return parseCsv(csv, { delimiter });
    }
    if ("json" in input) return toRows((input as { json: unknown }).json, (input as { path?: string }).path);
  }
  return toRows(input);
}

const cache = new Map<string, Promise<Row[]>>();

async function fetchRows(source: RemoteSource): Promise<Row[]> {
  // A relative URL has nothing to resolve against outside a browser.
  if (/^(\/|\.\.?\/)/.test(source.url) && typeof location === "undefined") {
    throw new Error(`InsightCharts: "${source.url}" is a relative URL, which cannot be fetched on the server. Pass an absolute URL, or read the file and pass its text: loadData(await readFile(path, "utf8")).`);
  }
  const res = await fetch(source.url, source.init);
  if (!res.ok) throw new Error(`InsightCharts: ${source.url} responded ${res.status} ${res.statusText}`);
  const type = res.headers.get("content-type") ?? "";
  const ext = source.url.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  const format = source.format ?? (ext === "csv" || ext === "tsv" || ext === "ndjson" || ext === "json" ? ext : /csv/.test(type) ? "csv" : /tab-separated/.test(type) ? "tsv" : /ndjson|jsonl/.test(type) ? "ndjson" : /json/.test(type) ? "json" : undefined);
  const text = await res.text();
  if (format === "csv") return parseCsv(text);
  if (format === "tsv") return parseCsv(text, { delimiter: "\t" });
  if (format === "ndjson")
    return text
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l) as Row);
  if (format === "json") return toRows(JSON.parse(text), source.path);
  // Unknown: sniff.
  const head = text.trimStart()[0];
  return head === "{" || head === "[" ? toRows(JSON.parse(text), source.path) : parseCsv(text);
}

/**
 * Load any `DataInput` to rows. Works in the browser, Node and React Server Components.
 * URL loads are de-duplicated; pass `{ fresh: true }` to bypass the cache.
 */
export async function loadData(input: DataInput | null | undefined, options: { fresh?: boolean } = {}): Promise<Row[]> {
  const sync = resolveSync(input);
  if (sync) return sync;
  if (typeof input === "function") return loadData(await input(), options);
  if (input instanceof Promise) return loadData(await input, options);
  const source: RemoteSource = typeof input === "string" ? { url: input.trim() } : (input as RemoteSource);
  const key = source.init ? null : `${source.url}|${source.format ?? ""}|${source.path ?? ""}`;
  if (key && !options.fresh && !source.refresh) {
    let hit = cache.get(key);
    if (!hit) {
      hit = fetchRows(source);
      cache.set(key, hit);
      hit.catch(() => cache.delete(key));
    }
    return hit;
  }
  return fetchRows(source);
}
