import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { CustomChart } from "echarts/charts";
import { createRef } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChartHandle } from "../src/core/chart";
import { defineChart, type BuildContext } from "../src/core/define";
import { InsightData, useInsightData, type InsightDataStore } from "../src/core/store";
import { defaultTheme, resolveTokens } from "../src/core/theme";
import type { Row } from "../src/data/types";
import { stubCanvas } from "./helpers";

// ECharts needs a laid-out container. jsdom has no layout, so every element reports a fixed
// box; the SVG renderer then runs for real and `build` receives a genuine context.
beforeAll(() => {
  stubCanvas();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ x: 0, y: 0, top: 0, left: 0, right: 600, bottom: 300, width: 600, height: 300, toJSON: () => ({}) }));
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 600 });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, get: () => 300 });
});
afterEach(cleanup);

interface ProbeProps {
  x: string;
  y: string;
}
let seen: { props: Record<string, unknown>; ctx: BuildContext }[] = [];
const ProbeChart = defineChart<ProbeProps>({
  name: "probe-chart",
  title: "Probe",
  category: "comparison",
  description: "Test fixture.",
  use: [CustomChart],
  props: [],
  defaults: { height: 300 },
  selectField: (p) => p.x,
  build(p, ctx) {
    seen.push({ props: p as unknown as Record<string, unknown>, ctx });
    const keys = ctx.rows.map((r) => String(r[p.x]));
    return {
      option: { xAxis: { type: "category", data: keys }, yAxis: { type: "value" }, series: [{ id: "s", type: "custom", renderItem: () => ({ type: "group" }), data: ctx.rows.map((r) => r[p.y] as number) }] },
      legend: keys.map((k, i) => ({ name: k, color: ctx.color(k, i) })),
      alt: `Probe of ${keys.length} items.`,
    };
  },
});
const rows: Row[] = [
  { k: "Solar", v: 1 },
  { k: "Wind", v: 2 },
  { k: "Hydro", v: 3 },
];
const last = () => seen.at(-1)!;
const built = async () => {
  await waitFor(() => expect(seen.length).toBeGreaterThan(0));
  await act(async () => {});
  return last().ctx;
};
const light = resolveTokens(defaultTheme.light);

beforeEach(() => {
  seen = [];
});

describe("defineChart: metadata", () => {
  it("derives the component name and level, and exposes meta for the registry", () => {
    expect(ProbeChart.meta).toMatchObject({ name: "probe-chart", component: "ProbeChart", level: "atom", category: "comparison" });
    expect(ProbeChart.displayName).toBe("ProbeChart");
    expect(ProbeChart.meta).not.toHaveProperty("build");
    expect(ProbeChart.meta).not.toHaveProperty("use");
  });
});

describe("defineChart: states", () => {
  it("shows the empty state for no rows and never calls build", async () => {
    render(<ProbeChart data={[]} x="k" y="v" title="Nothing yet" lazy={false} />);
    await act(async () => {});
    expect(document.querySelector('[data-slot="ic-state"]')!.textContent).toBe("No data to show.");
    expect(screen.getByRole("heading").textContent).toBe("Nothing yet");
    expect(seen).toHaveLength(0);
  });

  it("shows the empty state when the transform filters everything out", async () => {
    render(<ProbeChart data={rows} transform={{ type: "filter", field: "v", op: ">", value: 99 }} x="k" y="v" lazy={false} />);
    await act(async () => {});
    expect(document.querySelector('[data-slot="ic-state"]')!.textContent).toBe("No data to show.");
  });

  it("shows a skeleton while loading, then the error message when the loader rejects", async () => {
    let reject!: (e: Error) => void;
    const promise = new Promise<Row[]>((_, rej) => (reject = rej));
    const load = () => promise;
    render(<ProbeChart data={load} x="k" y="v" lazy={false} />);
    expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Loading chart");
    await act(async () => reject(new Error("query failed: relation does not exist")));
    expect(screen.getByRole("alert").textContent).toBe("query failed: relation does not exist");
  });

  it("shows a bad-data error in place instead of throwing through the page", async () => {
    render(<ProbeChart data={{ json: { nope: true } }} x="k" y="v" lazy={false} />);
    await act(async () => {});
    expect(screen.getByRole("alert").textContent).toMatch(/could not find an array of rows/);
  });
});

describe("defineChart: what build receives", () => {
  it("gets transformed rows, merged defaults and a context with resolved tokens", async () => {
    render(<ProbeChart data={rows} transform={{ type: "sort", by: "v", order: "desc" }} x="k" y="v" lazy={false} mode="light" />);
    const ctx = await built();
    expect(ctx.rows.map((r) => r.k)).toEqual(["Hydro", "Wind", "Solar"]);
    expect(last().props).toMatchObject({ x: "k", y: "v", height: 300 });
    expect(ctx).toMatchObject({ width: 600, height: 300, compact: false, mode: "light" });
    expect(ctx.tokens.accent).toBe(light.accent);
    expect(ctx.tokens.categorical).toEqual(light.categorical);
  });

  it("color(): accent for a single series, categorical order for entities, wrapping past the palette", async () => {
    render(<ProbeChart data={rows} x="k" y="v" lazy={false} mode="light" />);
    const ctx = await built();
    expect(ctx.color()).toBe(light.accent);
    expect(ctx.color("Solar", 0)).toBe(light.categorical[0]);
    expect(ctx.color("Wind", 1)).toBe(light.categorical[1]);
    expect(ctx.color("x", light.categorical.length)).toBe(light.categorical[0]);
    expect(ctx.dimmed("Solar")).toBe(false);
    expect(ctx.selected("anything")).toBe(true);
  });

  it("highlight: the highlighted entity takes the accent and everything else recedes to context grey", async () => {
    render(<ProbeChart data={rows} x="k" y="v" highlight="Wind" lazy={false} mode="light" />);
    const ctx = await built();
    expect(ctx.color("Wind", 1)).toBe(light.accent);
    expect(ctx.color("Solar", 0)).toBe(light.context);
    expect(ctx.color()).toBe(light.context);
    expect(ctx.dimmed("Wind")).toBe(false);
    expect(ctx.dimmed("Solar")).toBe(true);
    expect(ctx.dimmed()).toBe(true);
  });

  it("highlight with several entities gives each its own colour, the first the accent", async () => {
    render(<ProbeChart data={rows} x="k" y="v" highlight={["Hydro", "Solar"]} lazy={false} mode="light" />);
    const ctx = await built();
    expect(ctx.color("Hydro", 2)).toBe(light.accent);
    expect(ctx.color("Solar", 0)).toBe(light.categorical[1]);
    expect(ctx.color("Wind", 1)).toBe(light.context);
    expect(new Set([ctx.color("Hydro"), ctx.color("Solar"), ctx.color("Wind")]).size).toBe(3);
  });

  it("uses the dark tokens in dark mode and a theme override when given", async () => {
    render(<ProbeChart data={rows} x="k" y="v" lazy={false} mode="dark" theme={{ dark: { accent: "#ff00aa" } }} />);
    const ctx = await built();
    expect(ctx.mode).toBe("dark");
    expect(ctx.tokens.accent).toBe("#ff00aa");
    expect(ctx.tokens.surface).toBe(resolveTokens(defaultTheme.dark).surface);
  });

  it("fmt follows the `format` prop; formatter() builds any other", async () => {
    render(<ProbeChart data={rows} x="k" y="v" format="percent" lazy={false} />);
    const ctx = await built();
    expect(ctx.fmt(0.5)).toMatch(/^50\s?%$/);
    expect(ctx.formatter("integer")(3.7)).toBe("4");
  });
});

describe("defineChart: around build", () => {
  it("renders the legend and alt text that build returned", async () => {
    render(<ProbeChart data={rows} x="k" y="v" lazy={false} />);
    await built();
    await waitFor(() => expect(screen.getByRole("list", { name: "Legend" }).textContent).toBe("SolarWindHydro"));
    await waitFor(() => expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Probe of 3 items."));
  });

  it("legend={false} hides the legend; an explicit alt wins over the generated one", async () => {
    render(<ProbeChart data={rows} x="k" y="v" legend={false} alt="Hydro leads." lazy={false} />);
    await built();
    expect(document.querySelector('[data-slot="ic-legend"]')).toBeNull();
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Hydro leads.");
  });

  it("deep-merges the `option` escape hatch over the built option and applies annotations", async () => {
    const ref = createRef<ChartHandle>();
    render(<ProbeChart ref={ref} data={rows} x="k" y="v" lazy={false} option={{ yAxis: { max: 10 }, series: [{ name: "patched" }] }} annotations={[{ type: "line", axis: "y", value: 2, label: "Target" }]} />);
    await built();
    await waitFor(() => expect(ref.current!.getOption()).not.toBeNull());
    const option = ref.current!.getOption() as Record<string, any>;
    expect(option.yAxis).toMatchObject({ type: "value", max: 10 });
    expect(option.series[0]).toMatchObject({ id: "s", name: "patched" });
    expect(option.series[0].markLine.data[0]).toMatchObject({ yAxis: 2 });
    expect(option.xAxis.data).toEqual(["Solar", "Wind", "Hydro"]);
  });

  it("accepts `option` as a function of the built option and the build context", async () => {
    const ref = createRef<ChartHandle>();
    const patch = vi.fn((option: any, ctx: BuildContext) => ({ ...option, title: { text: `${ctx.rows.length} rows` } }));
    render(<ProbeChart ref={ref} data={rows} x="k" y="v" lazy={false} option={patch} />);
    await built();
    await waitFor(() => expect((ref.current!.getOption() as any)?.title).toEqual({ text: "3 rows" }));
  });

  it("does not rebuild when the parent re-renders with equal inline props", async () => {
    const view = render(<ProbeChart data={[{ k: "a", v: 1 }]} x="k" y="v" lazy={false} highlight={["a"]} />);
    await built();
    const count = seen.length;
    view.rerender(<ProbeChart data={[{ k: "a", v: 1 }]} x="k" y="v" lazy={false} highlight={["a"]} />);
    await act(async () => {});
    expect(seen.length).toBe(count);
    view.rerender(<ProbeChart data={[{ k: "a", v: 2 }]} x="k" y="v" lazy={false} highlight={["a"]} />);
    await waitFor(() => expect(seen.length).toBeGreaterThan(count));
    expect(last().ctx.rows).toEqual([{ k: "a", v: 2 }]);
  });
});

describe("defineChart inside <InsightData>", () => {
  let store!: InsightDataStore;
  function Grab() {
    store = useInsightData()!;
    return null;
  }
  const shared: Row[] = [
    { region: "Asia", source: "Solar", twh: 10 },
    { region: "Asia", source: "Wind", twh: 20 },
    { region: "Europe", source: "Solar", twh: 5 },
  ];

  it("reads the shared rows, and a selection elsewhere filters it but its own does not", async () => {
    render(
      <InsightData data={shared}>
        <Grab />
        <ProbeChart id="by-source" x="source" y="twh" select lazy={false} />
      </InsightData>,
    );
    expect((await built()).rows).toHaveLength(3);
    act(() => store.select("by-region", { field: "region", values: ["Europe"] }));
    await waitFor(() => expect(last().ctx.rows).toEqual([shared[2]]));
    act(() => store.select("by-source", { field: "source", values: ["Solar"] }));
    await waitFor(() => expect(last().ctx.selected("Wind")).toBe(false));
    expect(last().ctx.selected("Solar")).toBe(true);
    // Still filtered by region only; its own selection fades marks, it does not remove them.
    expect(last().ctx.rows).toEqual([shared[2]]);
    act(() => store.clear());
    await waitFor(() => expect(last().ctx.rows).toHaveLength(3));
    expect(last().ctx.selected("Wind")).toBe(true);
  });

  it("a chart with its own `data` ignores the shared store", async () => {
    render(
      <InsightData data={shared}>
        <Grab />
        <ProbeChart data={rows} x="k" y="v" lazy={false} />
      </InsightData>,
    );
    act(() => store.select("x", { field: "region", values: ["Europe"] }));
    await act(async () => {});
    expect((await built()).rows).toEqual(rows);
  });
});
