import { useState, type ComponentType } from "react";
import { InsightProvider, posterBackgrounds, posterThemes, type ComponentMeta } from "insightcharts";

// Poster primitives (set B) on poster themes: `?lab-poster-b`, `&themes=noir,paper` (or `&theme=`)
// to pick, `&mode=dark` for the dark variants, `&only=circle-pack` for one atom, `&w=380` for a
// phone width, `&all` for every entry of `examples`, `&animate` for entrance and update
// animation, `&noselect` to turn click selection off, `&mutate` for a button that changes
// every numeric value (to watch a data change tween).
// Every chart registers its ECharts instance on `window.__ic["theme/name"]` so a test can find marks.
const modules = import.meta.glob("../../../packages/insightcharts/src/atoms/{circle-pack,bubble-scale,bubble-network,pill-rank,radial-spokes,orbit-chart,stat-circles}.tsx", { eager: true }) as Record<string, Record<string, unknown>>;

const reg = (key: string) => (chart: unknown) => {
  const w = window as unknown as { __ic?: Record<string, unknown> };
  (w.__ic ??= {})[key] = chart;
};

// Deterministic change to every numeric field that is not a year or an id-like integer key.
const mutate = (props: Record<string, unknown>) => {
  if (!Array.isArray(props.data)) return props;
  return {
    ...props,
    data: (props.data as Record<string, unknown>[]).map((row, i) => Object.fromEntries(Object.entries(row).map(([k, v]) => (typeof v === "number" && !/year|id$/i.test(k) ? [k, Math.round(v * (0.55 + ((i * 37) % 10) / 10) * 100) / 100] : [k, v])))),
  };
};

export function LabPosterB() {
  const params = new URLSearchParams(location.search);
  const [changed, setChanged] = useState(false);
  const mode = params.get("mode") === "dark" ? "dark" : "light";
  const names = ((params.get("themes") ?? params.get("theme"))?.split(",") ?? ["noir", "magenta", "paper"]).filter((n) => n in posterThemes) as (keyof typeof posterThemes)[];
  const only = params.get("only");
  const width = Number(params.get("w")) || 900;
  const cards: { key: string; Component: ComponentType<any>; props: Record<string, unknown> }[] = [];
  for (const mod of Object.values(modules)) {
    for (const value of Object.values(mod)) {
      const meta = (value as { meta?: ComponentMeta } | null)?.meta;
      if (!meta?.example || (only && meta.name !== only)) continue;
      const { type: _type, ...props } = meta.example;
      cards.push({ key: meta.name, Component: value as ComponentType<any>, props });
      if (params.has("all")) for (const [label, extra] of Object.entries((mod.examples as Record<string, Record<string, unknown>> | undefined) ?? {})) cards.push({ key: `${meta.name}: ${label}`, Component: value as ComponentType<any>, props: extra });
    }
  }
  return (
    <main style={{ display: "grid", gap: 32, padding: 16, justifyContent: "center" }}>
      {params.has("mutate") && (
        <button id="mutate" type="button" onClick={() => setChanged((c) => !c)} style={{ position: "fixed", top: 4, left: 4, zIndex: 10 }}>
          {changed ? "Original data" : "Change data"}
        </button>
      )}
      {names.map((name) => (
        <InsightProvider key={name} theme={posterThemes[name]} mode={mode} lazy={false} animate={params.has("animate")}>
          <section data-theme={name} style={{ background: posterBackgrounds[name][mode], padding: width < 480 ? 12 : 32, width, boxSizing: "border-box", display: "grid", gap: 40 }}>
            {cards.map((c) => (
              <div key={c.key} data-component={c.key}>
                <c.Component {...(changed ? mutate(c.props) : c.props)} select={!params.has("noselect")} onReady={reg(`${name}/${c.key}`)} />
              </div>
            ))}
          </section>
        </InsightProvider>
      ))}
    </main>
  );
}
