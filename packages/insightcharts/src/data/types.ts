/** A single record. InsightCharts works on plain arrays of plain objects. */
export type Row = Record<string, unknown>;

/** Column-oriented data: `{ year: [2020, 2021], value: [1, 2] }`. */
export type Columnar = Record<string, ArrayLike<unknown>>;

/** Anything with `toArray()` returning row objects: Apache Arrow tables, DuckDB results, Arquero tables. */
export interface TableLike {
  toArray(): unknown[];
}

export interface RemoteSource {
  /** URL of a CSV, TSV, JSON or NDJSON resource. */
  url: string;
  /** Inferred from the extension or content type when omitted. */
  format?: "csv" | "tsv" | "json" | "ndjson";
  /** Dot path to the row array inside a JSON response, e.g. `"data.results"`. */
  path?: string;
  /** Passed to `fetch` (headers, method, body). */
  init?: RequestInit;
  /** Re-fetch interval in milliseconds (client only). */
  refresh?: number;
}

/**
 * Every shape a chart accepts as `data`:
 * - row objects, column arrays, or an Arrow/DuckDB/Arquero table
 * - a URL string, or CSV text
 * - `{ url, format, path }`, `{ csv }`, `{ json }`
 * - an async function or promise resolving to any of the above (database queries, SDK calls)
 */
export type InlineData = Row[] | Columnar | TableLike | string | RemoteSource | { csv: string; delimiter?: string } | { json: unknown; path?: string };

export type DataInput = InlineData | (() => InlineData | Promise<InlineData>) | Promise<InlineData>;

export type FilterOp = "==" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "not-in" | "between" | "contains" | "exists";

export type AggregateOp = "sum" | "mean" | "median" | "min" | "max" | "count" | "distinct" | "first" | "last";

/**
 * JSON-serialisable transforms, so an agent can describe a data pipeline without writing code.
 * A plain function `(rows) => rows` is also accepted anywhere a transform is.
 */
export type TransformSpec =
  | { type: "filter"; field: string; op?: FilterOp; value?: unknown }
  | { type: "aggregate"; groupBy?: string | string[]; measures: Record<string, { op: AggregateOp; field?: string }> }
  | { type: "sort"; by: string; order?: "asc" | "desc" }
  | { type: "limit"; n: number; offset?: number }
  /** Keep the top `n` rows by `by`; with `other`, fold the rest into one row labelled `other`. */
  | { type: "top"; n: number; by: string; other?: string; label?: string }
  /** Wide to long: columns `fields` become rows with `key` and `value` columns. */
  | { type: "fold"; fields: string[]; key?: string; value?: string }
  /** Long to wide: one row per `index`, one column per distinct `key`. */
  | { type: "pivot"; index: string; key: string; value: string; op?: AggregateOp }
  | { type: "bin"; field: string; step?: number; bins?: number; as?: string }
  | {
      type: "derive";
      as: string;
      op: "add" | "subtract" | "multiply" | "divide" | "percent-of-total" | "cumulative" | "rank" | "change" | "percent-change" | "index";
      /** One field for running ops, two for arithmetic. */
      fields: string[];
      /** Restart running ops within each group. */
      groupBy?: string;
      /** For `index`: the value the first row is rebased to. Default 100. */
      base?: number;
    }
  | { type: "rename"; fields: Record<string, string> }
  | { type: "select"; fields: string[] }
  | { type: "parse"; fields: Record<string, "number" | "date" | "string" | "boolean"> };

export type Transform = TransformSpec | ((rows: Row[]) => Row[]);
