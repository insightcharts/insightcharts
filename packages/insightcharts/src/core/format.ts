/**
 * How to print a number. Strings are shorthand an agent can write in JSON:
 * `"auto"`, `"compact"` (12.9K), `"percent"` (0.42 to 42%), `"percent-raw"` (42 to 42%),
 * `"currency:USD"`, `"integer"`, `"decimal:2"`, `"signed"`, `"year"`.
 * An `Intl.NumberFormatOptions` object or a function gives full control.
 */
export type FormatSpec = "auto" | "compact" | "percent" | "percent-raw" | "integer" | "signed" | "year" | `currency:${string}` | `decimal:${number}` | `${string}{value}${string}` | Intl.NumberFormatOptions | ((value: number) => string);

export type Formatter = (value: unknown) => string;

const MINUS = "−";
const typographic = (s: string) => s.replace(/^-/, MINUS);

export function makeFormatter(spec: FormatSpec = "auto", locale?: string): Formatter {
  if (typeof spec === "function") return (v) => (typeof v === "number" ? spec(v) : String(v ?? ""));
  let nf: Intl.NumberFormat | null = null;
  let scale = 1;
  let auto = false;
  let template: string | null = null;
  if (typeof spec === "object") nf = new Intl.NumberFormat(locale, spec);
  else if (spec.includes("{value}")) {
    template = spec;
    auto = true;
  } else if (spec === "compact") nf = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  else if (spec === "percent") nf = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 });
  else if (spec === "percent-raw") {
    nf = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 });
    scale = 0.01;
  } else if (spec === "integer") nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  else if (spec === "signed") nf = new Intl.NumberFormat(locale, { signDisplay: "exceptZero", maximumFractionDigits: 1 });
  else if (spec === "year") nf = new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 0 });
  else if (spec.startsWith("currency:")) nf = new Intl.NumberFormat(locale, { style: "currency", currency: spec.slice(9), notation: "compact", maximumFractionDigits: 1 });
  else if (spec.startsWith("decimal:")) {
    const d = Number(spec.slice(8));
    nf = new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  } else auto = true;

  const full = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  // Below 0.1, two decimals would round real values to "0"; keep two significant digits.
  const small = new Intl.NumberFormat(locale, { maximumSignificantDigits: 2 });
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  return (value) => {
    if (value == null || value === "") return "";
    if (value instanceof Date) return value.toLocaleDateString(locale);
    if (typeof value !== "number") return String(value);
    if (!Number.isFinite(value)) return "";
    // Auto: in full under 10,000, compact above.
    const s = auto ? (Math.abs(value) >= 10000 ? compact : value !== 0 && Math.abs(value) < 0.1 ? small : full).format(value) : nf!.format(value * scale);
    const out = typographic(s);
    return template ? template.replace("{value}", out) : out;
  };
}

/** Format a date-like value for axis ticks and tooltips. */
export function formatDate(value: unknown, locale?: string, options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }): string {
  const d = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? String(value ?? "") : d.toLocaleDateString(locale, options);
}

/** Values that should sit on a time axis: Dates and ISO date strings. Epoch numbers are ambiguous, so convert them to Dates first. */
export function isTemporal(value: unknown): boolean {
  if (value instanceof Date) return true;
  if (typeof value === "string") return /^\d{4}-\d{2}(-\d{2})?([T ]\d{2}:\d{2})?/.test(value);
  return false;
}
