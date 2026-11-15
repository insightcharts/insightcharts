import { useState, type ComponentType } from "react";
import { BarChart, DonutChart, Heatmap, InsightData, InsightProvider, LineChart, ScatterChart, Treemap, WaffleChart, type ComponentMeta } from "insightcharts";

// Integration fixture for the chart atoms: selection on every chart, crossfiltering across
// forms and morphing between states. Annotations are checked through &props.
//   ?lab-atoms            crossfilter + morph
//   ?lab-atoms=select     every chart atom with `select` on   (&only=bar-chart,treemap  &ex=1 extra examples  &props={json}  &still no animation)
// Every chart registers its ECharts instance on `window.__ic[key]` so a test can find marks.
const modules = import.meta.glob("../../../packages/insightcharts/src/atoms/*.tsx", { eager: true }) as Record<string, Record<string, unknown>>;
const sources = import.meta.glob("../../../packages/insightcharts/src/atoms/*.tsx", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

type Entry = { meta: ComponentMeta; Component: ComponentType<any>; examples: Record<string, Record<string, unknown>> };
const charts: Entry[] = [];
for (const [file, mod] of Object.entries(modules)) {
  if (!sources[file]?.includes("defineChart<")) continue;
  for (const value of Object.values(mod)) {
    const meta = (value as { meta?: ComponentMeta } | null)?.meta;
    if (meta?.name) charts.push({ meta, Component: value as ComponentType<any>, examples: (mod.examples as Entry["examples"]) ?? {} });
  }
}
charts.sort((a, b) => a.meta.name.localeCompare(b.meta.name));

const reg = (key: string) => (chart: unknown) => {
  const w = window as unknown as { __ic?: Record<string, unknown> };
  (w.__ic ??= {})[key] = chart;
};
const sum = (groupBy: string | string[]) => ({ type: "aggregate" as const, groupBy, measures: { twh: { op: "sum" as const, field: "twh" } } });

function SelectAll({ params }: { params: URLSearchParams }) {
  const only = params.get("only")?.split(",");
  const shown = only ? charts.filter((c) => only.includes(c.meta.name)) : charts;
  // &props={"annotations":[...]} merges extra props over every shown example; &noselect drops `select`.
  const extra = { select: !params.has("noselect"), ...(JSON.parse(params.get("props") ?? "{}") as Record<string, unknown>) };
  return (
    <>
      {shown.map(({ meta, Component, examples }) => {
        const { type: _type, ...props } = meta.example ?? {};
        const extras = params.has("ex") ? Object.entries(examples) : [];
        return (
          <section key={meta.name} data-component={meta.name} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>{meta.name}</div>
            <Component {...props} {...extra} onReady={reg(meta.name)} />
            {extras.map(([name, p], i) => (
              <div key={name} data-example={name} style={{ marginTop: 32 }}>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>{name}</div>
                <Component {...p} {...extra} onReady={reg(`${meta.name}#${i}`)} />
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}

function Crossfilter() {
  return (
    <section id="crossfilter">
      <h2 style={{ fontSize: 16 }}>Crossfilter test. Click any mark.</h2>
      <InsightData data="/energy.csv">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
          <BarChart id="cf-bar" x="region" y="twh" transform={sum("region")} select title="Bar chart by region" format="compact" height={240} onReady={reg("cf-bar")} />
          <DonutChart id="cf-donut" name="source" value="twh" transform={sum("source")} select title="Donut chart by source" format="compact" height={240} onReady={reg("cf-donut")} />
          <Treemap id="cf-treemap" name="year" value="twh" transform={sum("year")} select title="Treemap by year" format="compact" height={240} onReady={reg("cf-treemap")} />
          <ScatterChart id="cf-scatter" x="year" y="twh" series="source" select title="Scatter chart of rows by source" format="compact" height={240} onReady={reg("cf-scatter")} />
          <Heatmap id="cf-heatmap" x="year" y="region" value="twh" transform={sum(["year", "region"])} select title="Heatmap of region by year" format="compact" height={240} onReady={reg("cf-heatmap")} />
          <WaffleChart id="cf-waffle" name="source" value="twh" transform={sum("source")} select title="Waffle chart by source" format="compact" height={240} onReady={reg("cf-waffle")} />
        </div>
      </InsightData>
    </section>
  );
}

const A = [{ k: "Solar", v: 30, g: "New" }, { k: "Wind", v: 45, g: "New" }, { k: "Hydro", v: 60, g: "Old" }, { k: "Nuclear", v: 25, g: "Old" }];
const B = [{ k: "Solar", v: 70, g: "New" }, { k: "Wind", v: 55, g: "New" }, { k: "Hydro", v: 58, g: "Old" }, { k: "Nuclear", v: 20, g: "Old" }, { k: "Biomass", v: 12, g: "New" }];
const trend = (m: number) => Array.from({ length: 12 }, (_, i) => ({ month: `2024-${String(i + 1).padStart(2, "0")}-01`, Solar: 20 + i * 3 * m, Wind: 40 + Math.round(Math.sin(i / 2) * 8) * m, Hydro: 55 - i * m }));

function Morph() {
  const [alt, setAlt] = useState(false);
  const [hl, setHl] = useState(false);
  const data = alt ? B : A;
  const highlight = hl ? "Solar" : undefined;
  return (
    <section id="morph">
      <h2 style={{ fontSize: 16 }}>Morph test. Toggle data and highlight.</h2>
      <p style={{ display: "flex", gap: 8 }}>
        <button id="toggle-data" onClick={() => setAlt((v) => !v)}>Data: {alt ? "B" : "A"}</button>
        <button id="toggle-highlight" onClick={() => setHl((v) => !v)}>Highlight: {hl ? "Solar" : "none"}</button>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
        <BarChart data={data} x="k" y="v" highlight={highlight} title="Bar" height={240} onReady={reg("m-bar")} />
        <DonutChart data={data} name="k" value="v" highlight={highlight} title="Donut" height={240} onReady={reg("m-donut")} />
        <Treemap data={data} name="k" value="v" highlight={highlight} title="Treemap" height={240} onReady={reg("m-treemap")} />
        <LineChart data={trend(alt ? 2 : 1)} x="month" y={["Solar", "Wind", "Hydro"]} highlight={highlight} title="Line" height={240} onReady={reg("m-line")} />
        <ScatterChart data={data} x="v" y="v" series="k" highlight={highlight} title="Scatter" height={240} onReady={reg("m-scatter")} />
        <WaffleChart data={data} name="k" value="v" highlight={highlight} title="Waffle" height={240} onReady={reg("m-waffle")} />
      </div>
    </section>
  );
}

export function LabAtoms() {
  const params = new URLSearchParams(location.search);
  const section = params.get("lab-atoms");
  const width = params.get("w");
  if (params.get("mode") === "dark") document.documentElement.classList.add("dark");
  return (
    <main style={{ maxWidth: width ? Number(width) : 1100, margin: "0 auto", padding: width ? 12 : 24, display: "grid", gap: 40, gridTemplateColumns: "minmax(0, 1fr)" }}>
      <InsightProvider lazy={false} animate={!params.has("still")}>
        {section === "select" ? (
          <SelectAll params={params} />
        ) : (
          <>
            <Crossfilter />
            <Morph />
          </>
        )}
      </InsightProvider>
    </main>
  );
}
