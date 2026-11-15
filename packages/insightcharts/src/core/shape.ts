import { toNumber } from "../data/transform";
import type { Row } from "../data/types";
import { isTemporal } from "./format";

export interface SeriesFields {
  /** Category or time field. */
  x: string;
  /** One value field, or several (wide data: one column per series). */
  y: string | string[];
  /** Field that splits rows into series (long data: one row per series per x). */
  series?: string;
}

export interface ShapedSeries {
  /** Stable identity, used for colour assignment and morphing. */
  key: string;
  name: string;
  /** One value per x position; null where missing, so gaps stay gaps. */
  values: (number | null)[];
}

export interface Shaped {
  /** Raw x values in first-seen order. */
  x: unknown[];
  /** x values as display strings. */
  labels: string[];
  series: ShapedSeries[];
  /** True when x looks like dates and belongs on a time axis. */
  temporal: boolean;
}

/**
 * Normalise wide or long rows into aligned series. Every cartesian chart uses this, so
 * they all accept the same data shapes:
 * - wide: `{ x: "year", y: ["solar", "wind"] }`
 * - long: `{ x: "year", y: "value", series: "source" }`
 * - single: `{ x: "country", y: "gdp" }`
 */
export function shapeSeries(rows: Row[], fields: SeriesFields, names: Record<string, string> = {}): Shaped {
  const xIndex = new Map<string, number>();
  const x: unknown[] = [];
  for (const r of rows) {
    const k = String(r[fields.x]);
    if (!xIndex.has(k)) {
      xIndex.set(k, x.length);
      x.push(r[fields.x]);
    }
  }
  const blank = () => new Array<number | null>(x.length).fill(null);
  const num = (v: unknown) => {
    const n = toNumber(v);
    return Number.isNaN(n) ? null : n;
  };
  const series: ShapedSeries[] = [];
  if (fields.series) {
    const yField = Array.isArray(fields.y) ? fields.y[0] : fields.y;
    const byKey = new Map<string, ShapedSeries>();
    for (const r of rows) {
      const key = String(r[fields.series]);
      let s = byKey.get(key);
      if (!s) {
        s = { key, name: names[key] ?? key, values: blank() };
        byKey.set(key, s);
        series.push(s);
      }
      s.values[xIndex.get(String(r[fields.x]))!] = num(r[yField]);
    }
  } else {
    for (const key of Array.isArray(fields.y) ? fields.y : [fields.y]) {
      const s: ShapedSeries = { key, name: names[key] ?? key, values: blank() };
      for (const r of rows) s.values[xIndex.get(String(r[fields.x]))!] = num(r[key]);
      series.push(s);
    }
  }
  const sample = x.find((v) => v != null);
  return { x, labels: x.map((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""))), series, temporal: isTemporal(sample) };
}

/** Sentence fragment naming the extremes of a series, for generated alt text. */
export function describeExtremes(labels: string[], values: (number | null)[], fmt: (v: unknown) => string): string {
  let hi = -1;
  let lo = -1;
  values.forEach((v, i) => {
    if (v == null) return;
    if (hi === -1 || v > values[hi]!) hi = i;
    if (lo === -1 || v < values[lo]!) lo = i;
  });
  if (hi === -1) return "";
  return hi === lo ? `${labels[hi]}: ${fmt(values[hi])}.` : `Highest: ${labels[hi]} (${fmt(values[hi])}). Lowest: ${labels[lo]} (${fmt(values[lo])}).`;
}
