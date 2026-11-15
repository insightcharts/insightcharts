import { beforeAll, describe, expect, it } from "vitest";
import { applyAnnotations, type Annotation } from "../src/core/annotations";
import type { EChartsOption } from "../src/core/echarts";
import { makeCtx, stubCanvas } from "./helpers";

beforeAll(stubCanvas);

type Obj = Record<string, any>;
const ctx = makeCtx();
const base = (): EChartsOption => ({ series: [{ id: "a", type: "line", data: [1, 2] }, { id: "b", type: "line", data: [3, 4] }] });
const first = (o: EChartsOption) => (o.series as Obj[])[0];

describe("applyAnnotations", () => {
  it("returns the same option when there is nothing to add", () => {
    const o = base();
    expect(applyAnnotations(o, undefined, ctx)).toBe(o);
    expect(applyAnnotations(o, [], ctx)).toBe(o);
  });

  it("returns the option unchanged when it has no series to attach to", () => {
    const o: EChartsOption = { series: [] };
    expect(applyAnnotations(o, [{ type: "line", axis: "y", value: 1 }], ctx)).toBe(o);
    const none: EChartsOption = {};
    expect(applyAnnotations(none, [{ type: "line", axis: "y", value: 1 }], ctx)).toBe(none);
  });

  it("draws a line annotation as a markLine on the right axis, dashed by default", () => {
    const out = applyAnnotations(base(), [{ type: "line", axis: "y", value: 50, label: "Target" }, { type: "line", axis: "x", value: "2023-10-01", dashed: false }], ctx);
    const [y, x] = first(out).markLine.data;
    expect(y.yAxis).toBe(50);
    expect(y.lineStyle.type).toBe("dashed");
    expect(y.label).toMatchObject({ show: true, formatter: "Target" });
    expect(x.xAxis).toBe("2023-10-01");
    expect(x.lineStyle.type).toBe("solid");
    expect(x.label.show).toBe(false);
    expect(first(out).markLine).toMatchObject({ silent: true, symbol: "none" });
  });

  it("emphasis draws the line in ink instead of muted", () => {
    const out = applyAnnotations(base(), [{ type: "line", axis: "y", value: 1, emphasis: true }, { type: "line", axis: "y", value: 2 }], ctx);
    const [strong, quiet] = first(out).markLine.data;
    expect(strong.lineStyle.color).toBe(ctx.tokens.ink);
    expect(quiet.lineStyle.color).toBe(ctx.tokens.muted);
  });

  it("draws a band as a markArea pair from..to", () => {
    const out = applyAnnotations(base(), [{ type: "band", axis: "x", from: "2022-06-01", to: "2022-09-01", label: "Beta" }, { type: "band", axis: "y", from: 10, to: 20 }], ctx);
    const [xBand, yBand] = first(out).markArea.data;
    expect(xBand[0]).toMatchObject({ xAxis: "2022-06-01", name: "Beta" });
    expect(xBand[0].label.show).toBe(true);
    expect(xBand[1]).toEqual({ xAxis: "2022-09-01" });
    expect(yBand[0].yAxis).toBe(10);
    expect(yBand[1]).toEqual({ yAxis: 20 });
    expect(yBand[0].label.show).toBe(false);
  });

  it("draws a point as a markPoint in data coordinates with its label", () => {
    const out = applyAnnotations(base(), [{ type: "point", x: "2024-12-01", y: 266, label: "2.4x the\nrunner-up", position: "left" }, { type: "point", x: 3, y: 1, label: "n", dot: false }], ctx);
    const [p, q] = first(out).markPoint.data;
    expect(p.coord).toEqual(["2024-12-01", 266]);
    expect(p.label).toMatchObject({ show: true, formatter: "2.4x the\nrunner-up", position: "left" });
    expect(p.symbol).toBe("circle");
    // A hidden dot is a transparent 1px symbol: symbol "none" would drop the label too.
    expect(q.symbolSize).toBe(1);
    expect(q.itemStyle.color).toBe("transparent");
    expect(q.label.position).toBe("top");
  });

  it("labels use ink colours from the theme, never a series colour", () => {
    const out = applyAnnotations(base(), [{ type: "line", axis: "y", value: 1, label: "x" }, { type: "point", x: 1, y: 1, label: "p" }], ctx);
    expect(first(out).markLine.data[0].label.color).toBe(ctx.tokens.inkSecondary);
    expect(first(out).markPoint.data[0].label.color).toBe(ctx.tokens.ink);
    expect(ctx.tokens.categorical).not.toContain(first(out).markPoint.data[0].label.color);
  });

  it("attaches to the first series only and leaves the others identical", () => {
    const o = base();
    const out = applyAnnotations(o, [{ type: "line", axis: "y", value: 1 }], ctx);
    const series = out.series as Obj[];
    expect(series).toHaveLength(2);
    expect(series[1]).toBe((o.series as Obj[])[1]);
    expect(series[1]).not.toHaveProperty("markLine");
    expect(series[0]).toMatchObject({ id: "a", type: "line", data: [1, 2] });
  });

  it("keeps marks the chart already put on the first series", () => {
    const o: EChartsOption = { series: [{ type: "bar", data: [1], markLine: { data: [{ yAxis: 0 }] }, markPoint: { data: [{ coord: [0, 0] }] } }] } as EChartsOption;
    const out = applyAnnotations(o, [{ type: "line", axis: "y", value: 5 }, { type: "point", x: 0, y: 1, label: "p" }], ctx);
    expect(first(out).markLine.data.map((d: Obj) => d.yAxis)).toEqual([0, 5]);
    expect(first(out).markPoint.data).toHaveLength(2);
  });

  it("accepts a single series object as well as an array", () => {
    const out = applyAnnotations({ series: { type: "line", data: [1] } } as EChartsOption, [{ type: "line", axis: "y", value: 5 }], ctx);
    expect(first(out).markLine.data).toHaveLength(1);
  });

  it("only adds the mark kinds that are used, and does not mutate its input", () => {
    const o = base();
    const annotations: Annotation[] = [{ type: "band", axis: "y", from: 1, to: 2 }];
    const before = JSON.stringify([o, annotations]);
    const out = applyAnnotations(o, annotations, ctx);
    expect(first(out)).toHaveProperty("markArea");
    expect(first(out)).not.toHaveProperty("markLine");
    expect(first(out)).not.toHaveProperty("markPoint");
    expect(JSON.stringify([o, annotations])).toBe(before);
  });

  it("switches mark animation off with the chart's", () => {
    const still = applyAnnotations(base(), [{ type: "line", axis: "y", value: 1 }], makeCtx({ animate: false }));
    const moving = applyAnnotations(base(), [{ type: "line", axis: "y", value: 1 }], makeCtx({ animate: true }));
    expect(first(still).markLine.animation).toBe(false);
    expect(first(moving).markLine.animation).toBe(true);
  });
});
