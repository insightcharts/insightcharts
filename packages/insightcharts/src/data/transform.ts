import type { AggregateOp, FilterOp, Row, Transform, TransformSpec } from "./types";

export const toNumber = (v: unknown): number => (typeof v === "number" ? v : v instanceof Date ? v.getTime() : v == null || v === "" ? NaN : Number(v));

const toTime = (v: unknown): number => (typeof v === "string" ? new Date(v).getTime() : toNumber(v));

const compare = (a: unknown, b: unknown): number => {
  if (a == null) return b == null ? 0 : 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  // A Date against an ISO string (the only date form a JSON spec can carry) compares as time.
  if (a instanceof Date || b instanceof Date) return toTime(a) - toTime(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true });
};

export function aggregateValues(values: unknown[], op: AggregateOp): unknown {
  if (op === "count") return values.length;
  if (op === "distinct") return new Set(values).size;
  if (op === "first") return values[0];
  if (op === "last") return values[values.length - 1];
  const nums = values.map(toNumber).filter((n) => !Number.isNaN(n));
  if (!nums.length) return null;
  switch (op) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "mean":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
    case "median": {
      const s = [...nums].sort((a, b) => a - b);
      const m = s.length >> 1;
      return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    }
  }
}

export function matches(value: unknown, op: FilterOp, target: unknown): boolean {
  switch (op) {
    case "==":
      return value === target || (value != null && target != null && String(value) === String(target));
    case "!=":
      return !matches(value, "==", target);
    // `compare` orders nulls last for sorting; a missing value must not pass an ordering filter.
    case ">":
      return value != null && target != null && compare(value, target) > 0;
    case ">=":
      return value != null && target != null && compare(value, target) >= 0;
    case "<":
      return value != null && target != null && compare(value, target) < 0;
    case "<=":
      return value != null && target != null && compare(value, target) <= 0;
    case "in":
      return Array.isArray(target) && target.some((t) => matches(value, "==", t));
    case "not-in":
      return !matches(value, "in", target);
    case "between":
      return Array.isArray(target) && value != null && compare(value, target[0]) >= 0 && compare(value, target[1]) <= 0;
    case "contains":
      return String(value ?? "").toLowerCase().includes(String(target ?? "").toLowerCase());
    case "exists":
      return (value != null && value !== "") === (target !== false);
  }
}

export function groupRows(rows: Row[], by: string | string[] | undefined): Map<string, Row[]> {
  const keys = by == null ? [] : Array.isArray(by) ? by : [by];
  const groups = new Map<string, Row[]>();
  for (const row of rows) {
    const k = keys.map((key) => String(row[key])).join("\u0000");
    const g = groups.get(k);
    if (g) g.push(row);
    else groups.set(k, [row]);
  }
  return groups;
}

// A missing operand yields null, never NaN (NaN does not survive JSON and prints as "NaN").
const orNull = (n: number | null): number | null => (n == null || Number.isNaN(n) ? null : n);

function derive(rows: Row[], t: Extract<TransformSpec, { type: "derive" }>): Row[] {
  const [a, b] = t.fields;
  const arithmetic = { add: (x: number, y: number) => x + y, subtract: (x: number, y: number) => x - y, multiply: (x: number, y: number) => x * y, divide: (x: number, y: number) => (y === 0 ? null : x / y) } as const;
  if (t.op in arithmetic) {
    const fn = arithmetic[t.op as keyof typeof arithmetic];
    return rows.map((r) => ({ ...r, [t.as]: orNull(fn(toNumber(r[a]), toNumber(r[b]))) }));
  }
  const out: Row[] = [];
  const groups = t.groupBy ? groupRows(rows, t.groupBy) : new Map([["", rows]]);
  const position = new Map<Row, Row>();
  for (const group of groups.values()) {
    const values = group.map((r) => toNumber(r[a]));
    const total = values.reduce((s, v) => s + (Number.isNaN(v) ? 0 : v), 0);
    // NaN in a numeric comparator leaves the order undefined, so rank only the real numbers.
    const sorted = t.op === "rank" ? values.filter((x) => !Number.isNaN(x)).sort((x, y) => y - x) : [];
    let running = 0;
    group.forEach((r, i) => {
      const v = values[i];
      let d: number | null;
      if (t.op === "percent-of-total") d = total === 0 ? null : v / total;
      else if (t.op === "cumulative") d = running += Number.isNaN(v) ? 0 : v;
      else if (t.op === "rank") d = Number.isNaN(v) ? null : sorted.indexOf(v) + 1;
      else if (t.op === "change") d = i === 0 ? null : v - values[i - 1];
      else if (t.op === "percent-change") d = i === 0 || values[i - 1] === 0 ? null : (v - values[i - 1]) / Math.abs(values[i - 1]);
      else d = values[0] === 0 ? null : (v / values[0]) * (t.base ?? 100);
      position.set(r, { ...r, [t.as]: orNull(d) });
    });
  }
  // Preserve original row order.
  for (const r of rows) out.push(position.get(r)!);
  return out;
}

export function applyTransform(rows: Row[], t: Transform): Row[] {
  if (typeof t === "function") return t(rows);
  switch (t.type) {
    case "filter":
      return rows.filter((r) => matches(r[t.field], t.op ?? "==", t.value));
    case "aggregate": {
      const keys = t.groupBy == null ? [] : Array.isArray(t.groupBy) ? t.groupBy : [t.groupBy];
      return Array.from(groupRows(rows, t.groupBy).values(), (group) => {
        const out: Row = {};
        for (const k of keys) out[k] = group[0][k];
        for (const [name, m] of Object.entries(t.measures)) out[name] = aggregateValues(m.field ? group.map((r) => r[m.field!]) : group, m.op);
        return out;
      });
    }
    case "sort":
      // Missing values go last in either direction.
      return [...rows].sort((x, y) => {
        const a = x[t.by];
        const b = y[t.by];
        if (a == null || b == null) return a == null ? (b == null ? 0 : 1) : -1;
        return compare(a, b) * (t.order === "desc" ? -1 : 1);
      });
    case "limit":
      return rows.slice(t.offset ?? 0, (t.offset ?? 0) + t.n);
    case "top": {
      // Largest first, missing values last: a null must never take one of the top slots.
      const sorted = [...rows].sort((x, y) => (x[t.by] == null || y[t.by] == null ? compare(x[t.by], y[t.by]) : compare(y[t.by], x[t.by])));
      const head = sorted.slice(0, t.n);
      const rest = sorted.slice(t.n);
      if (!t.other || !rest.length || !t.label) return head;
      return [...head, { [t.label]: t.other, [t.by]: rest.reduce((s, r) => s + (toNumber(r[t.by]) || 0), 0) }];
    }
    case "fold": {
      const key = t.key ?? "key";
      const value = t.value ?? "value";
      return rows.flatMap((r) => {
        const base: Row = {};
        for (const k of Object.keys(r)) if (!t.fields.includes(k)) base[k] = r[k];
        return t.fields.map((f) => ({ ...base, [key]: f, [value]: r[f] }));
      });
    }
    case "pivot":
      return Array.from(groupRows(rows, t.index).values(), (group) => {
        const out: Row = { [t.index]: group[0][t.index] };
        for (const [k, g] of groupRows(group, t.key)) out[k] = aggregateValues(g.map((r) => r[t.value]), t.op ?? "sum");
        return out;
      });
    case "bin": {
      const values = rows.map((r) => toNumber(r[t.field])).filter((n) => !Number.isNaN(n));
      if (!values.length) return rows;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const step = t.step ?? niceStep((max - min) / (t.bins ?? Math.max(5, Math.ceil(Math.log2(values.length) + 1))));
      const as = t.as ?? `${t.field}_bin`;
      return rows.map((r) => {
        const v = toNumber(r[t.field]);
        return { ...r, [as]: Number.isNaN(v) ? null : Math.floor(v / step) * step, [`${as}_end`]: Number.isNaN(v) ? null : Math.floor(v / step) * step + step };
      });
    }
    case "derive":
      return derive(rows, t);
    case "rename":
      return rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [t.fields[k] ?? k, v])));
    case "select":
      return rows.map((r) => Object.fromEntries(t.fields.map((f) => [f, r[f]])));
    case "parse":
      return rows.map((r) => {
        const out = { ...r };
        for (const [f, type] of Object.entries(t.fields)) {
          const v = r[f];
          out[f] = v == null ? null : type === "number" ? toNumber(typeof v === "string" ? v.replace(/[,$%\s]/g, "") : v) : type === "date" ? new Date(v as string | number) : type === "boolean" ? v === true || v === "true" || v === 1 : String(v);
        }
        return out;
      });
  }
}

/** Round a raw step to 1, 2, 2.5 or 5 times a power of ten. */
export function niceStep(raw: number): number {
  if (!(raw > 0)) return 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
}

/** Run rows through a pipeline of transform specs and/or functions. */
export function transformRows(rows: Row[], transforms?: Transform | Transform[] | null): Row[] {
  if (!transforms) return rows;
  return (Array.isArray(transforms) ? transforms : [transforms]).reduce(applyTransform, rows);
}

/** Distinct values of a field in first-seen order. Entity order drives colour assignment, so it must be stable. */
export function distinct(rows: Row[], field: string): string[] {
  const seen = new Set<string>();
  for (const r of rows) if (r[field] != null) seen.add(String(r[field]));
  return [...seen];
}

export function extent(rows: Row[], field: string): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const r of rows) {
    const v = toNumber(r[field]);
    if (Number.isNaN(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min, max];
}
