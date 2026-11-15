import { useState, type ComponentType } from "react";
import { InsightProvider, posterBackgrounds, posterThemes, type ComponentMeta, type PosterThemeName } from "insightcharts";

// The six flow-and-scale poster primitives on a poster theme's own ground.
//   ?lab-poster-c                 ocean           ?lab-poster-c&theme=magenta   another theme
//   &all                          every example, not only meta.example
//   &w=380                        constrain width &only=fan-flow                one atom
//   &select                       click selection on    &eager                  no entrance animation
//   &q=Ten                        only examples whose label contains the text
//   &mutate                       a #mutate button that changes every numeric value, to watch a data change tween
// Every chart registers its ECharts instance on `window.__ic[name]` so a test can find marks.
const modules = import.meta.glob("../../../packages/insightcharts/src/atoms/{fan-flow,curve-rank,glyph-table,ribbon-chart,arc-diagram,scale-ladder}.tsx", { eager: true }) as Record<string, Record<string, unknown>>;

const reg = (key: string) => (chart: unknown) => {
  const w = window as unknown as { __ic?: Record<string, unknown> };
  (w.__ic ??= {})[key] = chart;
};

// Deterministic change to every numeric field that is not a year.
const mutate = (props: Record<string, unknown>) => {
  const change = (rows: unknown) => (Array.isArray(rows) ? (rows as Record<string, unknown>[]).map((row, i) => Object.fromEntries(Object.entries(row).map(([k, v]) => (typeof v === "number" && !/year|id$/i.test(k) ? [k, Math.round(v * (0.55 + ((i * 37) % 10) / 10) * 100) / 100] : [k, v])))) : rows);
  return { ...props, ...(props.data ? { data: change(props.data) } : null), ...(props.rows ? { rows: change(props.rows) } : null) };
};

export function LabPosterC() {
  const params = new URLSearchParams(location.search);
  const [changed, setChanged] = useState(false);
  const q = params.get("q");
  // &props={"bandWidth":120} merges extra props into every card, to try an optional prop without editing an example.
  let extra: Record<string, unknown> = {};
  try {
    extra = JSON.parse(params.get("props") ?? "{}");
  } catch {
    extra = {};
  }
  const name = (params.get("theme") ?? "ocean") as PosterThemeName;
  const theme = posterThemes[name] ?? posterThemes.ocean;
  const width = params.get("w");
  const only = params.get("only");
  const select = params.has("select");
  const cards: { key: string; Component: ComponentType<any>; props: Record<string, unknown> }[] = [];
  for (const mod of Object.values(modules)) {
    for (const value of Object.values(mod)) {
      const meta = (value as { meta?: ComponentMeta } | null)?.meta;
      if (!meta?.example || (only && meta.name !== only)) continue;
      const { type: _type, ...props } = meta.example;
      if (!q) cards.push({ key: meta.name, Component: value as ComponentType<any>, props });
      if (params.has("all") || q) for (const [label, extra] of Object.entries((mod.examples as Record<string, Record<string, unknown>> | undefined) ?? {})) if (!q || label.includes(q)) cards.push({ key: `${meta.name}: ${label}`, Component: value as ComponentType<any>, props: extra });
    }
  }
  return (
    <main style={{ minHeight: "100vh", background: posterBackgrounds[name]?.light ?? theme.light.surface, padding: width ? 12 : 40 }}>
      {params.has("mutate") && (
        <button id="mutate" type="button" onClick={() => setChanged((c) => !c)} style={{ position: "fixed", top: 4, left: 4, zIndex: 10 }}>
          {changed ? "Original data" : "Change data"}
        </button>
      )}
      <InsightProvider theme={theme} mode="light" lazy={false} animate={!params.has("eager")}>
        <div style={{ maxWidth: width ? Number(width) : 860, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 56 }}>
          {cards.map((c) => (
            <section key={c.key} data-component={c.key}>
              <c.Component {...(changed ? mutate(c.props) : c.props)} {...extra} {...(select ? { select: true } : null)} onReady={reg(c.key)} />
            </section>
          ))}
        </div>
      </InsightProvider>
    </main>
  );
}
