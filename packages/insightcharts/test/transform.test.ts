import { describe, expect, it } from "vitest";
import { aggregateValues, applyTransform, distinct, extent, groupRows, matches, niceStep, toNumber, transformRows } from "../src/data/transform";
import type { Row, TransformSpec } from "../src/data/types";

const sales: Row[] = [
  { region: "North", product: "A", year: 2023, units: 10, price: 2 },
  { region: "South", product: "A", year: 2023, units: 30, price: 2 },
  { region: "North", product: "B", year: 2023, units: 20, price: 5 },
  { region: "South", product: "B", year: 2024, units: null, price: 5 },
  { region: "North", product: "A", year: 2024, units: 40, price: 3 },
];

const deepFreeze = <T>(v: T): T => {
  if (v && typeof v === "object") {
    Object.freeze(v);
    for (const child of Object.values(v)) deepFreeze(child);
  }
  return v;
};
const col = (rows: Row[], field: string) => rows.map((r) => r[field]);

describe("toNumber", () => {
  it("converts numbers, numeric strings and dates; null, undefined and '' are NaN, never 0", () => {
    expect(toNumber(5)).toBe(5);
    expect(toNumber("5.5")).toBe(5.5);
    expect(toNumber(new Date(1000))).toBe(1000);
    for (const v of [null, undefined, "", "abc"]) expect(toNumber(v)).toBeNaN();
  });
});

describe("filter", () => {
  const f = (op: string | undefined, value: unknown, field = "units") => applyTransform(sales, { type: "filter", field, op, value } as TransformSpec);

  it("defaults to equality", () => {
    expect(f(undefined, "North", "region")).toHaveLength(3);
  });

  it("== and != compare loosely across number and string, as CSV and URL params need", () => {
    expect(f("==", "2023", "year")).toHaveLength(3);
    expect(f("==", 2023, "year")).toHaveLength(3);
    expect(f("!=", "2023", "year")).toHaveLength(2);
  });

  it("== null matches only missing values, and != null only present ones", () => {
    expect(col(f("==", null), "product")).toEqual(["B"]);
    expect(f("!=", null)).toHaveLength(4);
  });

  it(">, >=, <, <= compare numerically", () => {
    expect(col(f(">", 20), "units")).toEqual([30, 40]);
    expect(col(f(">=", 20), "units")).toEqual([30, 20, 40]);
    expect(col(f("<", 20), "units")).toEqual([10]);
    expect(col(f("<=", 20), "units")).toEqual([10, 20]);
  });

  it("ordering comparisons never match a missing value", () => {
    for (const op of [">", ">=", "<", "<="]) expect(col(f(op, 0), "units")).not.toContain(null);
    expect(matches(null, ">", 5)).toBe(false);
    expect(matches(undefined, ">=", 5)).toBe(false);
    expect(matches(null, "<", 5)).toBe(false);
    expect(matches(null, "between", [0, 10])).toBe(false);
    // ...and a missing comparison target matches nothing, instead of "< null" matching everything.
    for (const op of [">", ">=", "<", "<="] as const) expect(matches(5, op, null)).toBe(false);
  });

  it("compares numeric strings as numbers and ISO dates in order", () => {
    expect(matches("10", ">", 9)).toBe(true);
    expect(matches("9", ">", "10")).toBe(false);
    expect(matches("2024-03-01", ">=", "2024-01-15")).toBe(true);
    expect(matches("2023-12-31", ">=", "2024-01-15")).toBe(false);
  });

  it("compares Date values against ISO strings, the only date form JSON specs can carry", () => {
    const d = new Date("2024-03-01T00:00:00Z");
    expect(matches(d, ">=", "2024-01-15")).toBe(true);
    expect(matches(d, "<", "2024-01-15")).toBe(false);
    expect(matches(d, "between", ["2024-01-01", "2024-12-31"])).toBe(true);
    expect(matches(d, "between", ["2025-01-01", "2025-12-31"])).toBe(false);
    expect(matches(d, ">", new Date("2024-02-01T00:00:00Z"))).toBe(true);
    const rows = transformRows(
      [{ date: "2023-06-01" }, { date: "2024-06-01" }],
      [
        { type: "parse", fields: { date: "date" } },
        { type: "filter", field: "date", op: ">=", value: "2024-01-01" },
      ],
    );
    expect(rows).toHaveLength(1);
  });

  it("in / not-in", () => {
    expect(col(f("in", [10, "30"]), "units")).toEqual([10, 30]);
    expect(col(f("not-in", [10, 30]), "units")).toEqual([20, null, 40]);
    expect(f("in", "North", "region")).toEqual([]);
  });

  it("between is inclusive at both ends", () => {
    expect(col(f("between", [20, 40]), "units")).toEqual([30, 20, 40]);
  });

  it("contains is case-insensitive and safe on missing values", () => {
    expect(f("contains", "ORT", "region")).toHaveLength(3);
    expect(matches(null, "contains", "x")).toBe(false);
  });

  it("exists keeps present values; value:false keeps the missing ones", () => {
    expect(f("exists", undefined)).toHaveLength(4);
    expect(f("exists", true)).toHaveLength(4);
    expect(col(f("exists", false), "product")).toEqual(["B"]);
    expect(matches("", "exists", true)).toBe(false);
    expect(matches(0, "exists", true)).toBe(true);
  });

  it("keeps the original order", () => {
    expect(col(f(">=", 10), "units")).toEqual([10, 30, 20, 40]);
  });
});

describe("aggregate", () => {
  it("groups by one field, in first-seen group order", () => {
    const out = applyTransform(sales, { type: "aggregate", groupBy: "region", measures: { total: { op: "sum", field: "units" }, n: { op: "count" } } });
    expect(out).toEqual([
      { region: "North", total: 70, n: 3 },
      { region: "South", total: 30, n: 2 },
    ]);
  });

  it("groups by several fields", () => {
    const out = applyTransform(sales, { type: "aggregate", groupBy: ["region", "product"], measures: { total: { op: "sum", field: "units" } } });
    expect(out).toEqual([
      { region: "North", product: "A", total: 50 },
      { region: "South", product: "A", total: 30 },
      { region: "North", product: "B", total: 20 },
      { region: "South", product: "B", total: null },
    ]);
  });

  it("collapses to one row without groupBy", () => {
    expect(applyTransform(sales, { type: "aggregate", measures: { total: { op: "sum", field: "units" }, n: { op: "count" } } })).toEqual([{ total: 100, n: 5 }]);
  });

  it("keeps group keys in their original type", () => {
    const out = applyTransform(sales, { type: "aggregate", groupBy: "year", measures: { n: { op: "count" } } });
    expect(out.map((r) => r.year)).toEqual([2023, 2024]);
  });

  it("supports every op and ignores missing values in numeric ones", () => {
    const values = [10, 30, 20, null, 40];
    expect(aggregateValues(values, "sum")).toBe(100);
    expect(aggregateValues(values, "mean")).toBe(25);
    expect(aggregateValues(values, "median")).toBe(25);
    expect(aggregateValues([5, 1, 3], "median")).toBe(3);
    expect(aggregateValues(values, "min")).toBe(10);
    expect(aggregateValues(values, "max")).toBe(40);
    expect(aggregateValues(values, "first")).toBe(10);
    expect(aggregateValues(values, "last")).toBe(40);
    expect(aggregateValues(["a", "b", "a"], "distinct")).toBe(2);
    expect(aggregateValues(values, "count")).toBe(5);
  });

  it("returns null, not 0 or NaN, when a group has no numeric values", () => {
    for (const op of ["sum", "mean", "median", "min", "max"] as const) expect(aggregateValues([null, undefined, ""], op)).toBeNull();
  });

  it("sums numeric strings", () => {
    expect(aggregateValues(["1", "2.5"], "sum")).toBe(3.5);
  });

  // `count` with a `field` counts rows, including those where the field is missing. SQL's
  // COUNT(field) skips nulls; which is intended is not documented.
  it.todo("count with a field skips rows where that field is missing");
});

describe("sort, limit, top", () => {
  it("sorts ascending by default and descending on request, without mutating the input", () => {
    const input = deepFreeze([{ v: 3 }, { v: 1 }, { v: 2 }]);
    expect(col(applyTransform(input, { type: "sort", by: "v" }), "v")).toEqual([1, 2, 3]);
    expect(col(applyTransform(input, { type: "sort", by: "v", order: "desc" }), "v")).toEqual([3, 2, 1]);
  });

  it("sorts strings naturally (item2 before item10) and dates chronologically", () => {
    expect(col(applyTransform([{ k: "item10" }, { k: "item2" }, { k: "item1" }], { type: "sort", by: "k" }), "k")).toEqual(["item1", "item2", "item10"]);
    const d1 = new Date("2024-01-01");
    const d2 = new Date("2023-01-01");
    expect(col(applyTransform([{ d: d1 }, { d: d2 }], { type: "sort", by: "d" }), "d")).toEqual([d2, d1]);
  });

  it("is stable: ties keep their input order", () => {
    const rows = [
      { g: 1, id: "a" },
      { g: 0, id: "b" },
      { g: 1, id: "c" },
      { g: 0, id: "d" },
    ];
    expect(col(applyTransform(rows, { type: "sort", by: "g" }), "id")).toEqual(["b", "d", "a", "c"]);
    expect(col(applyTransform(rows, { type: "sort", by: "g", order: "desc" }), "id")).toEqual(["a", "c", "b", "d"]);
  });

  it("puts missing values last when ascending", () => {
    expect(col(applyTransform(sales, { type: "sort", by: "units" }), "units")).toEqual([10, 20, 30, 40, null]);
  });

  // Descending currently puts nulls FIRST, so `sort desc` + `limit 3` leads with an empty
  // row. Postgres does the same, most charting tools do not; `top` already keeps nulls last.
  it("puts missing values last when descending too", () => {
    const rows = [{ v: 2 }, { v: null }, { v: 5 }, { v: 1 }];
    expect(applyTransform(rows, { type: "sort", by: "v", order: "desc" }).map((r) => r.v)).toEqual([5, 2, 1, null]);
    expect(applyTransform(rows, { type: "sort", by: "v" }).map((r) => r.v)).toEqual([1, 2, 5, null]);
  });

  it("limit takes the first n, with an optional offset", () => {
    expect(col(applyTransform(sales, { type: "limit", n: 2 }), "units")).toEqual([10, 30]);
    expect(col(applyTransform(sales, { type: "limit", n: 2, offset: 1 }), "units")).toEqual([30, 20]);
    expect(applyTransform(sales, { type: "limit", n: 99 })).toHaveLength(5);
  });

  it("top keeps the n largest, largest first, with missing values last", () => {
    expect(col(applyTransform(sales, { type: "top", n: 2, by: "units" }), "units")).toEqual([40, 30]);
    expect(col(applyTransform(sales, { type: "top", n: 5, by: "units" }), "units")).toEqual([40, 30, 20, 10, null]);
  });

  it("top folds the remainder into one labelled row when `other` and `label` are given", () => {
    const rows = [
      { name: "a", v: 5 },
      { name: "b", v: 50 },
      { name: "c", v: 20 },
      { name: "d", v: 3 },
      { name: "e", v: null },
    ];
    expect(applyTransform(rows, { type: "top", n: 2, by: "v", other: "Other", label: "name" })).toEqual([
      { name: "b", v: 50 },
      { name: "c", v: 20 },
      { name: "Other", v: 8 },
    ]);
  });

  it("top adds no Other row when nothing is left over", () => {
    expect(applyTransform([{ name: "a", v: 1 }], { type: "top", n: 3, by: "v", other: "Other", label: "name" })).toEqual([{ name: "a", v: 1 }]);
  });

  // With `other` but no `label`, the remainder is silently dropped: totals shrink and the
  // chart no longer adds up. Either infer the label field or make `label` required with `other`.
  it.todo("top with `other` but no `label` still folds the remainder (or reports the missing label)");
});

describe("fold and pivot", () => {
  const wide = [
    { year: 2020, solar: 1, wind: 2 },
    { year: 2021, solar: 3, wind: null },
  ];

  it("fold turns columns into key/value rows and keeps the other fields", () => {
    expect(applyTransform(wide, { type: "fold", fields: ["solar", "wind"] })).toEqual([
      { year: 2020, key: "solar", value: 1 },
      { year: 2020, key: "wind", value: 2 },
      { year: 2021, key: "solar", value: 3 },
      { year: 2021, key: "wind", value: null },
    ]);
  });

  it("fold honours custom key and value names", () => {
    const out = applyTransform(wide, { type: "fold", fields: ["solar"], key: "source", value: "twh" });
    expect(out[0]).toEqual({ year: 2020, wind: 2, source: "solar", twh: 1 });
  });

  it("pivot spreads a key column into one column per value, one row per index", () => {
    const long = [
      { year: 2020, source: "solar", twh: 1 },
      { year: 2020, source: "wind", twh: 2 },
      { year: 2021, source: "solar", twh: 3 },
    ];
    expect(applyTransform(long, { type: "pivot", index: "year", key: "source", value: "twh" })).toEqual([
      { year: 2020, solar: 1, wind: 2 },
      { year: 2021, solar: 3 },
    ]);
  });

  it("pivot sums duplicates by default and accepts another op", () => {
    const long = [
      { g: "a", k: "x", v: 1 },
      { g: "a", k: "x", v: 3 },
    ];
    expect(applyTransform(long, { type: "pivot", index: "g", key: "k", value: "v" })).toEqual([{ g: "a", x: 4 }]);
    expect(applyTransform(long, { type: "pivot", index: "g", key: "k", value: "v", op: "mean" })).toEqual([{ g: "a", x: 2 }]);
  });

  it("fold then pivot returns the original table", () => {
    const full = [
      { year: 2020, solar: 1, wind: 2 },
      { year: 2021, solar: 3, wind: 4 },
    ];
    expect(transformRows(full, [{ type: "fold", fields: ["solar", "wind"] }, { type: "pivot", index: "year", key: "key", value: "value" }])).toEqual(full);
  });
});

describe("bin", () => {
  const rows = [{ v: 1 }, { v: 12 }, { v: 25 }, { v: null }, { v: 30 }];

  it("assigns the lower and upper bin edge with an explicit step", () => {
    const out = applyTransform(rows, { type: "bin", field: "v", step: 10 });
    expect(col(out, "v_bin")).toEqual([0, 10, 20, null, 30]);
    expect(col(out, "v_bin_end")).toEqual([10, 20, 30, null, 40]);
  });

  it("derives a nice step from a bin count", () => {
    const out = applyTransform(rows, { type: "bin", field: "v", bins: 3 });
    // (30 - 1) / 3 = 9.67 → 10
    expect(col(out, "v_bin")).toEqual([0, 10, 20, null, 30]);
  });

  it("honours `as`", () => {
    const out = applyTransform(rows, { type: "bin", field: "v", step: 10, as: "bucket" });
    expect(out[1]).toEqual({ v: 12, bucket: 10, bucket_end: 20 });
  });

  it("bins negative values downwards and survives a constant column", () => {
    expect(col(applyTransform([{ v: -5 }], { type: "bin", field: "v", step: 10 }), "v_bin")).toEqual([-10]);
    expect(col(applyTransform([{ v: 4 }, { v: 4 }], { type: "bin", field: "v" }), "v_bin")).toEqual([4, 4]);
  });

  it("returns rows unchanged when nothing is numeric", () => {
    const none = [{ v: null }, { v: "x" }];
    expect(applyTransform(none, { type: "bin", field: "v" })).toBe(none);
  });
});

describe("derive", () => {
  const d = (op: string, extra: object = {}, rows: Row[] = sales, fields = ["units"]) => col(applyTransform(rows, { type: "derive", as: "out", op, fields, ...extra } as TransformSpec), "out");
  const series = [{ v: 50 }, { v: 100 }, { v: 75 }, { v: 0 }, { v: 30 }];

  it("add, subtract, multiply, divide work row by row", () => {
    const rows = [{ a: 6, b: 3 }];
    expect(d("add", {}, rows, ["a", "b"])).toEqual([9]);
    expect(d("subtract", {}, rows, ["a", "b"])).toEqual([3]);
    expect(d("multiply", {}, rows, ["a", "b"])).toEqual([18]);
    expect(d("divide", {}, rows, ["a", "b"])).toEqual([2]);
  });

  it("divide by zero gives null, not Infinity", () => {
    expect(d("divide", {}, [{ a: 1, b: 0 }], ["a", "b"])).toEqual([null]);
  });

  it("arithmetic on a missing operand gives null, never NaN", () => {
    expect(d("multiply", {}, sales, ["units", "price"])).toEqual([20, 60, 100, null, 120]);
    expect(d("add", {}, [{ a: 1 }], ["a", "b"])).toEqual([null]);
    expect(d("divide", {}, [{ a: null, b: 2 }], ["a", "b"])).toEqual([null]);
  });

  it("percent-of-total sums to 1 and gives null for missing values", () => {
    expect(d("percent-of-total")).toEqual([0.1, 0.3, 0.2, null, 0.4]);
  });

  it("percent-of-total restarts within groups", () => {
    expect(d("percent-of-total", { groupBy: "region" })).toEqual([10 / 70, 1, 20 / 70, null, 40 / 70]);
  });

  it("cumulative carries the running total across missing values", () => {
    expect(d("cumulative")).toEqual([10, 40, 60, 60, 100]);
  });

  it("cumulative restarts within groups while keeping the original row order", () => {
    const out = applyTransform(sales, { type: "derive", as: "run", op: "cumulative", fields: ["units"], groupBy: "region" });
    expect(col(out, "run")).toEqual([10, 30, 30, 30, 70]);
    expect(col(out, "region")).toEqual(col(sales, "region"));
  });

  it("rank is 1 for the largest, ties share a rank, missing values are unranked", () => {
    expect(d("rank")).toEqual([4, 2, 3, null, 1]);
    expect(d("rank", {}, [{ v: 5 }, { v: 9 }, { v: 5 }, { v: 1 }], ["v"])).toEqual([2, 1, 2, 4]);
  });

  it("rank is correct with several missing values scattered through the column", () => {
    const rows = [null, 3, null, 9, 1, null, 7, 5, null, 2].map((v) => ({ v }));
    expect(d("rank", {}, rows, ["v"])).toEqual([null, 4, null, 1, 6, null, 2, 3, null, 5]);
  });

  it("change is the difference from the previous row; the first is null", () => {
    expect(d("change", {}, series, ["v"])).toEqual([null, 50, -25, -75, 30]);
  });

  it("percent-change is relative to the previous row, null after a zero", () => {
    expect(d("percent-change", {}, series, ["v"])).toEqual([null, 1, -0.25, -1, null]);
  });

  it("percent-change from a negative base keeps the sign of the move", () => {
    expect(d("percent-change", {}, [{ v: -10 }, { v: -5 }], ["v"])).toEqual([null, 0.5]);
  });

  it("change and percent-change next to a missing value are null, never NaN", () => {
    expect(d("change")).toEqual([null, 20, -10, null, null]);
    expect(d("percent-change")).toEqual([null, 2, -1 / 3, null, null]);
  });

  it("index rebases the first row to 100, or to `base`", () => {
    expect(d("index", {}, series, ["v"])).toEqual([100, 200, 150, 0, 60]);
    expect(d("index", { base: 1 }, series, ["v"])).toEqual([1, 2, 1.5, 0, 0.6]);
  });

  it("index is null throughout when the first value is zero, and restarts per group", () => {
    expect(d("index", {}, [{ v: 0 }, { v: 5 }], ["v"])).toEqual([null, null]);
    expect(d("index", { groupBy: "region" })).toEqual([100, 100, 200, null, 400]);
  });

  it("keeps every other column and does not mutate the input", () => {
    const input = deepFreeze(sales.map((r) => ({ ...r })));
    const out = applyTransform(input, { type: "derive", as: "revenue", op: "multiply", fields: ["units", "price"] });
    expect(out[0]).toEqual({ ...sales[0], revenue: 20 });
    expect(input[0]).not.toHaveProperty("revenue");
  });
});

describe("rename, select, parse", () => {
  it("rename changes the named keys and leaves the rest", () => {
    expect(applyTransform([{ a: 1, b: 2 }], { type: "rename", fields: { a: "alpha" } })).toEqual([{ alpha: 1, b: 2 }]);
  });

  it("select keeps only the named fields, in the given order", () => {
    const out = applyTransform([{ a: 1, b: 2, c: 3 }], { type: "select", fields: ["c", "a"] });
    expect(out).toEqual([{ c: 3, a: 1 }]);
    expect(Object.keys(out[0])).toEqual(["c", "a"]);
  });

  it("parse number strips currency symbols, separators, percent signs and spaces", () => {
    const out = applyTransform([{ a: "$1,200", b: "45%", c: " 3 000 ", d: 7 }], { type: "parse", fields: { a: "number", b: "number", c: "number", d: "number" } });
    expect(out).toEqual([{ a: 1200, b: 45, c: 3000, d: 7 }]);
  });

  it("parse date, boolean and string", () => {
    const [row] = applyTransform([{ d: "2024-01-05", t: "true", f: "no", one: 1, n: 5 }], { type: "parse", fields: { d: "date", t: "boolean", f: "boolean", one: "boolean", n: "string" } });
    expect(row.d).toBeInstanceOf(Date);
    expect((row.d as Date).toISOString()).toBe("2024-01-05T00:00:00.000Z");
    expect(row).toMatchObject({ t: true, f: false, one: true, n: "5" });
  });

  it("parse leaves missing values as null in every type", () => {
    const out = applyTransform([{ a: null, b: undefined, c: null, d: null }], { type: "parse", fields: { a: "number", b: "date", c: "boolean", d: "string" } });
    expect(out).toEqual([{ a: null, b: null, c: null, d: null }]);
  });
});

describe("transformRows: pipelines", () => {
  it("returns the same array when there is nothing to do", () => {
    expect(transformRows(sales)).toBe(sales);
    expect(transformRows(sales, null)).toBe(sales);
  });

  it("accepts a single spec or a single function", () => {
    expect(transformRows(sales, { type: "limit", n: 1 })).toHaveLength(1);
    expect(transformRows(sales, (rows) => rows.slice(0, 2))).toHaveLength(2);
  });

  it("runs specs and functions in order", () => {
    const out = transformRows(sales, [
      { type: "filter", field: "units", op: "exists" },
      (rows) => rows.map((r) => ({ ...r, revenue: (r.units as number) * (r.price as number) })),
      { type: "aggregate", groupBy: "region", measures: { revenue: { op: "sum", field: "revenue" } } },
      { type: "sort", by: "revenue", order: "desc" },
      { type: "derive", as: "share", op: "percent-of-total", fields: ["revenue"] },
    ]);
    expect(out).toEqual([
      { region: "North", revenue: 240, share: 0.8 },
      { region: "South", revenue: 60, share: 0.2 },
    ]);
  });

  it("no spec mutates its input rows or array", () => {
    const specs: TransformSpec[] = [
      { type: "filter", field: "units", op: ">", value: 10 },
      { type: "aggregate", groupBy: "region", measures: { t: { op: "sum", field: "units" } } },
      { type: "sort", by: "units", order: "desc" },
      { type: "limit", n: 2 },
      { type: "top", n: 2, by: "units", other: "Other", label: "region" },
      { type: "fold", fields: ["units", "price"] },
      { type: "pivot", index: "region", key: "product", value: "units" },
      { type: "bin", field: "units", step: 10 },
      { type: "derive", as: "x", op: "cumulative", fields: ["units"] },
      { type: "derive", as: "x", op: "rank", fields: ["units"], groupBy: "region" },
      { type: "rename", fields: { units: "u" } },
      { type: "select", fields: ["region"] },
      { type: "parse", fields: { year: "string" } },
    ];
    const frozen = deepFreeze(sales.map((r) => ({ ...r })));
    for (const spec of specs) expect(() => applyTransform(frozen, spec), spec.type).not.toThrow();
    expect(frozen).toEqual(sales);
  });

  it("every spec copes with an empty table", () => {
    const specs: TransformSpec[] = [
      { type: "filter", field: "a", value: 1 },
      { type: "aggregate", groupBy: "a", measures: { n: { op: "count" } } },
      { type: "sort", by: "a" },
      { type: "limit", n: 3 },
      { type: "top", n: 3, by: "a", other: "Other", label: "b" },
      { type: "fold", fields: ["a"] },
      { type: "pivot", index: "a", key: "b", value: "c" },
      { type: "bin", field: "a" },
      { type: "derive", as: "x", op: "index", fields: ["a"] },
      { type: "rename", fields: { a: "b" } },
      { type: "select", fields: ["a"] },
      { type: "parse", fields: { a: "number" } },
    ];
    for (const spec of specs) expect(applyTransform([], spec), spec.type).toEqual([]);
  });
});

describe("helpers", () => {
  it("niceStep rounds up to 1, 2, 2.5, 5 or 10 times a power of ten", () => {
    const cases: [number, number][] = [
      [1, 1],
      [1.5, 2],
      [2.2, 2.5],
      [3, 5],
      [7, 10],
      [9.67, 10],
      [230, 250],
      [0.03, 0.05],
      [0.0012, 0.002],
      [40000, 50000],
    ];
    for (const [raw, nice] of cases) expect(niceStep(raw), String(raw)).toBeCloseTo(nice, 10);
  });

  it("niceStep never returns 0, NaN or a negative step", () => {
    for (const raw of [0, -5, NaN, -Infinity]) expect(niceStep(raw)).toBe(1);
  });

  it("distinct lists values in first-seen order as strings, skipping missing ones", () => {
    expect(distinct(sales, "region")).toEqual(["North", "South"]);
    expect(distinct(sales, "year")).toEqual(["2023", "2024"]);
    expect(distinct(sales, "units")).toEqual(["10", "30", "20", "40"]);
    expect(distinct(sales, "nope")).toEqual([]);
  });

  it("extent ignores missing and non-numeric values and reads numeric strings", () => {
    expect(extent(sales, "units")).toEqual([10, 40]);
    expect(extent([{ v: "5" }, { v: "x" }, { v: -2 }], "v")).toEqual([-2, 5]);
  });

  it("extent of nothing is [Infinity, -Infinity], so callers must check before using it as a domain", () => {
    expect(extent([], "v")).toEqual([Infinity, -Infinity]);
  });

  it("groupRows keeps first-seen group order and row order within groups", () => {
    const groups = groupRows(sales, "region");
    expect([...groups.keys()]).toEqual(["North", "South"]);
    expect(col(groups.get("North")!, "units")).toEqual([10, 20, 40]);
    expect(groupRows(sales, undefined).size).toBe(1);
  });
});
