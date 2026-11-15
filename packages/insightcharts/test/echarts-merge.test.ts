import { describe, expect, it } from "vitest";
import { mergeOption } from "../src/core/echarts";

describe("mergeOption", () => {
  it("merges objects key by key, deeply", () => {
    const base = { grid: { left: 4, right: 12 }, tooltip: { show: true, textStyle: { color: "#000", fontSize: 12 } } };
    expect(mergeOption(base, { grid: { left: 40 }, tooltip: { textStyle: { color: "#fff" } }, legend: { show: false } })).toEqual({
      grid: { left: 40, right: 12 },
      tooltip: { show: true, textStyle: { color: "#fff", fontSize: 12 } },
      legend: { show: false },
    });
  });

  it("merges arrays of objects by index, so a patch tweaks one series without replacing all", () => {
    const base = { series: [{ id: "a", type: "line", data: [1, 2] }, { id: "b", type: "line", data: [3, 4] }] };
    const out = mergeOption(base, { series: [{ smooth: true }] });
    expect(out.series).toEqual([
      { id: "a", type: "line", data: [1, 2], smooth: true },
      { id: "b", type: "line", data: [3, 4] },
    ]);
  });

  it("skips undefined holes in a patch array and appends entries beyond the base", () => {
    const base = { series: [{ id: "a" }, { id: "b" }] };
    const out = mergeOption(base, { series: [undefined, { smooth: true }, { id: "c" }] });
    expect(out.series).toEqual([{ id: "a" }, { id: "b", smooth: true }, { id: "c" }]);
  });

  it("broadcasts an object patch over an array of objects (style every series at once)", () => {
    const base = { series: [{ id: "a", symbol: "circle" }, { id: "b" }], yAxis: [{ type: "value" }] };
    const out = mergeOption(base, { series: { symbol: "none", lineStyle: { width: 3 } }, yAxis: { max: 10 } });
    expect(out.series).toEqual([
      { id: "a", symbol: "none", lineStyle: { width: 3 } },
      { id: "b", symbol: "none", lineStyle: { width: 3 } },
    ]);
    expect(out.yAxis).toEqual([{ type: "value", max: 10 }]);
  });

  it("replaces primitives, and arrays of primitives, outright", () => {
    const base = { color: ["#111", "#222", "#333"], animation: true, series: [{ data: [1, 2, 3] }], title: { text: "a" } };
    const out = mergeOption(base, { color: ["#f00"], animation: false, series: [{ data: [9] }], title: { text: "b" } });
    expect(out).toEqual({ color: ["#f00"], animation: false, series: [{ data: [9] }], title: { text: "b" } });
  });

  it("replaces data arrays of objects' parents correctly: a series' data points are replaced, not merged by index", () => {
    const base = { series: [{ data: [1, 2, 3, 4] }] };
    expect(mergeOption(base, { series: [{ data: [5] }] }).series[0].data).toEqual([5]);
  });

  it("lets null and false switch something off, and ignores undefined", () => {
    const base = { tooltip: { show: true }, grid: { left: 4 } };
    expect(mergeOption(base, { tooltip: null, grid: undefined })).toEqual({ tooltip: null, grid: { left: 4 } });
    expect(mergeOption(base, undefined)).toBe(base);
    expect(mergeOption(base, { tooltip: false })).toEqual({ tooltip: false, grid: { left: 4 } });
  });

  it("replaces a value with a different shape instead of trying to merge", () => {
    expect(mergeOption({ xAxis: { type: "category" } }, { xAxis: [{ type: "value" }, { type: "value" }] })).toEqual({ xAxis: [{ type: "value" }, { type: "value" }] });
    expect(mergeOption({ a: 1 }, { a: { b: 2 } })).toEqual({ a: { b: 2 } });
    expect(mergeOption({ a: { b: 2 } }, { a: "x" })).toEqual({ a: "x" });
  });

  it("keeps functions and class instances by reference", () => {
    const formatter = () => "x";
    const date = new Date(0);
    const out = mergeOption({ tooltip: { formatter: () => "old" }, min: new Date(1) }, { tooltip: { formatter }, min: date });
    expect(out.tooltip.formatter).toBe(formatter);
    expect(out.min).toBe(date);
  });

  it("does not mutate the base or the patch", () => {
    const base = { grid: { left: 4 }, series: [{ id: "a", lineStyle: { width: 1 } }] };
    const patch = { grid: { right: 1 }, series: [{ lineStyle: { width: 3 } }] };
    const before = [JSON.stringify(base), JSON.stringify(patch)];
    mergeOption(base, patch);
    expect([JSON.stringify(base), JSON.stringify(patch)]).toEqual(before);
  });
});
