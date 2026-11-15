import { useState, type ComponentType } from "react";
import { InsightProvider, posterBackgrounds, posterThemes, type ComponentMeta, type PosterThemeName } from "insightcharts";

// The six count-and-area poster primitives on a poster theme's own ground.
//   ?lab-poster-a                 dusk            ?lab-poster-a&theme=magenta   another theme
//   &all                          every example, not only meta.example
//   &w=380                        constrain width &only=unit-blocks             one atom
//   &select                       click selection on    &eager                  no entrance animation
//   &mode=dark                    the theme's dark half (paper has a night variant)
//   &mutate                       a button that changes every numeric value, to watch a data change tween
// Every chart registers its ECharts instance on `window.__ic[key]` so a test can find marks.
const modules = import.meta.glob("../../../packages/insightcharts/src/atoms/{unit-blocks,proportional-area,nested-shares,shape-fill,block-bar,icon-array-grid}.tsx", { eager: true }) as Record<string, Record<string, unknown>>;

const reg = (key: string) => (chart: unknown) => {
  const w = window as unknown as { __ic?: Record<string, unknown> };
  (w.__ic ??= {})[key] = chart;
};

// Deterministic change to every numeric field that is not a year or an id-like key.
const mutate = (props: Record<string, unknown>) => {
  if (!Array.isArray(props.data)) return props;
  return {
    ...props,
    data: (props.data as Record<string, unknown>[]).map((row, i) => Object.fromEntries(Object.entries(row).map(([k, v]) => (typeof v === "number" && !/year|id$/i.test(k) ? [k, Math.round(v * (0.55 + ((i * 37) % 10) / 10) * 100) / 100] : [k, v])))),
  };
};

export function LabPosterA() {
  const params = new URLSearchParams(location.search);
  const [changed, setChanged] = useState(false);
  const name = (params.get("theme") ?? "dusk") as PosterThemeName;
  const theme = posterThemes[name] ?? posterThemes.dusk;
  const mode = params.get("mode") === "dark" ? "dark" : "light";
  const width = params.get("w");
  const only = params.get("only");
  const select = params.has("select");
  const t = theme[mode];
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
    <main style={{ minHeight: "100vh", background: posterBackgrounds[name]?.[mode] ?? t.surface, padding: width ? 12 : 40 }}>
      {params.has("mutate") && (
        <button id="mutate" type="button" onClick={() => setChanged((c) => !c)} style={{ position: "fixed", top: 4, left: 4, zIndex: 10 }}>
          {changed ? "Original data" : "Change data"}
        </button>
      )}
      <InsightProvider theme={theme} mode={mode} lazy={false} animate={!params.has("eager")}>
        <div style={{ maxWidth: width ? Number(width) : 860, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 56 }}>
          {cards.map((c) => (
            <section key={c.key} data-component={c.key}>
              <c.Component {...(changed ? mutate(c.props) : c.props)} {...(select ? { select: true } : null)} onReady={reg(c.key)} />
            </section>
          ))}
        </div>
      </InsightProvider>
    </main>
  );
}
