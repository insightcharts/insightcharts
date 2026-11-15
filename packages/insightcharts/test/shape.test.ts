import { describe, expect, it } from "vitest";
import { describeExtremes, shapeSeries } from "../src/core/shape";

describe("shapeSeries", () => {
  it("wide: one series per y column, aligned to x", () => {
    const rows = [
      { year: 2020, solar: 1, wind: 2 },
      { year: 2021, solar: 3, wind: 4 },
    ];
    const s = shapeSeries(rows, { x: "year", y: ["solar", "wind"] });
    expect(s.x).toEqual([2020, 2021]);
    expect(s.labels).toEqual(["2020", "2021"]);
    expect(s.series).toEqual([
      { key: "solar", name: "solar", values: [1, 3] },
      { key: "wind", name: "wind", values: [2, 4] },
    ]);
    expect(s.temporal).toBe(false);
  });

  it("long: one series per distinct value of the series field, in first-seen order", () => {
    const rows = [
      { year: 2020, source: "wind", twh: 2 },
      { year: 2020, source: "solar", twh: 1 },
      { year: 2021, source: "wind", twh: 4 },
      { year: 2021, source: "solar", twh: 3 },
    ];
    const s = shapeSeries(rows, { x: "year", y: "twh", series: "source" });
    expect(s.series.map((x) => x.key)).toEqual(["wind", "solar"]);
    expect(s.series[0].values).toEqual([2, 4]);
    expect(s.series[1].values).toEqual([1, 3]);
  });

  it("single: one series named after the y field", () => {
    const s = shapeSeries([{ country: "NO", gdp: 5 }, { country: "SE", gdp: 6 }], { x: "country", y: "gdp" });
    expect(s.series).toEqual([{ key: "gdp", name: "gdp", values: [5, 6] }]);
    expect(s.labels).toEqual(["NO", "SE"]);
  });

  it("long: combinations missing from the data stay null, so gaps stay gaps and series stay aligned", () => {
    const rows = [
      { year: 2020, source: "solar", twh: 1 },
      { year: 2021, source: "wind", twh: 4 },
      { year: 2022, source: "solar", twh: 5 },
    ];
    const s = shapeSeries(rows, { x: "year", y: "twh", series: "source" });
    expect(s.x).toEqual([2020, 2021, 2022]);
    expect(s.series).toEqual([
      { key: "solar", name: "solar", values: [1, null, 5] },
      { key: "wind", name: "wind", values: [null, 4, null] },
    ]);
  });

  it("missing, empty and non-numeric cells become null, never 0 or NaN", () => {
    const rows = [
      { x: "a", v: null },
      { x: "b", v: "" },
      { x: "c", v: "n/a" },
      { x: "d" },
      { x: "e", v: 0 },
      { x: "f", v: "12.5" },
    ];
    expect(shapeSeries(rows, { x: "x", y: "v" }).series[0].values).toEqual([null, null, null, null, 0, 12.5]);
  });

  it("wide: a column absent from some rows is null there", () => {
    const s = shapeSeries([{ x: 1, a: 1 }, { x: 2, a: 2, b: 5 }], { x: "x", y: ["a", "b"] });
    expect(s.series[1].values).toEqual([null, 5]);
  });

  it("keeps x in first-seen order and merges repeated x values into one position", () => {
    const rows = [
      { m: "Mar", k: "a", v: 3 },
      { m: "Jan", k: "a", v: 1 },
      { m: "Mar", k: "b", v: 30 },
      { m: "Jan", k: "b", v: 10 },
    ];
    const s = shapeSeries(rows, { x: "m", y: "v", series: "k" });
    expect(s.labels).toEqual(["Mar", "Jan"]);
    expect(s.series.map((x) => x.values)).toEqual([
      [3, 1],
      [30, 10],
    ]);
  });

  it("applies display names without changing the stable key", () => {
    const s = shapeSeries([{ x: 1, rev: 1, cost: 2 }], { x: "x", y: ["rev", "cost"] }, { rev: "Revenue" });
    expect(s.series.map((x) => [x.key, x.name])).toEqual([
      ["rev", "Revenue"],
      ["cost", "cost"],
    ]);
  });

  it("in long format uses the first y field when given a list", () => {
    const s = shapeSeries([{ x: 1, k: "a", v: 7, w: 9 }], { x: "x", y: ["v", "w"], series: "k" });
    expect(s.series).toEqual([{ key: "a", name: "a", values: [7] }]);
  });

  it("detects temporal x from ISO strings and Date objects, skipping leading nulls", () => {
    expect(shapeSeries([{ d: "2024-01-01", v: 1 }], { x: "d", y: "v" }).temporal).toBe(true);
    expect(shapeSeries([{ d: null, v: 1 }, { d: "2024-01", v: 1 }], { x: "d", y: "v" }).temporal).toBe(true);
    const dated = shapeSeries([{ d: new Date("2024-03-05T00:00:00Z"), v: 1 }], { x: "d", y: "v" });
    expect(dated.temporal).toBe(true);
    expect(dated.labels).toEqual(["2024-03-05"]);
  });

  it("does not put years, quarters or category names on a time axis", () => {
    for (const x of [2024, "2024", "Q1 2024", "North"]) expect(shapeSeries([{ x, v: 1 }], { x: "x", y: "v" }).temporal, String(x)).toBe(false);
  });

  it("returns empty, well-formed output for no rows", () => {
    expect(shapeSeries([], { x: "x", y: ["a", "b"] })).toEqual({ x: [], labels: [], series: [{ key: "a", name: "a", values: [] }, { key: "b", name: "b", values: [] }], temporal: false });
    expect(shapeSeries([], { x: "x", y: "v", series: "k" }).series).toEqual([]);
  });
});

describe("describeExtremes", () => {
  const fmt = (v: unknown) => String(v);

  it("names the highest and lowest, ignoring gaps", () => {
    expect(describeExtremes(["a", "b", "c", "d"], [3, null, 9, 1], fmt)).toBe("Highest: c (9). Lowest: d (1).");
  });

  it("describes a single value plainly and returns '' when there is nothing", () => {
    expect(describeExtremes(["a", "b"], [null, 4], fmt)).toBe("b: 4.");
    expect(describeExtremes(["a"], [null], fmt)).toBe("");
  });
});
