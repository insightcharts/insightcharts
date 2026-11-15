import { useEffect } from "react";
import { Icon, Poster, posterBackgrounds, posterThemes, type PosterPanel } from "insightcharts";

// The poster frame on every poster theme, with one of each kind of mark, so a chart can be
// checked against every ground.
//   ?lab-posters                  all themes        ?lab-posters&theme=dusk   one theme
//   &mode=dark                    dark HOST page (the posters must not change)
//   &pmode=dark                   the posters' own dark variant (only `paper` differs)
//   &w=380                        constrain width   &download   show the PNG control

const regions = [
  { region: "North", a: 42, b: 31, c: 18, d: 12, e: 9 },
  { region: "East", a: 35, b: 38, c: 22, d: 15, e: 11 },
  { region: "South", a: 28, b: 24, c: 30, d: 19, e: 7 },
  { region: "West", a: 22, b: 29, c: 14, d: 21, e: 13 },
];
const long = regions.flatMap((r) => (["a", "b", "c", "d", "e"] as const).map((k) => ({ region: r.region, series: `Series ${k.toUpperCase()}`, value: r[k] })));
const parts = [
  { name: "Alpha", value: 38 },
  { name: "Beta", value: 24 },
  { name: "Gamma", value: 17 },
  { name: "Delta", value: 12 },
  { name: "Epsilon", value: 9 },
];
const trend = Array.from({ length: 12 }, (_, i) => ({ month: `2025-${String(i + 1).padStart(2, "0")}-01`, first: 20 + i * 3 + (i % 3) * 4, second: 48 - i * 2 + (i % 4) * 3 }));
const grid = ["Mon", "Tue", "Wed", "Thu", "Fri"].flatMap((day, d) => ["06", "09", "12", "15", "18", "21"].map((hour, h) => ({ day, hour, value: Math.round(10 + 80 * Math.abs(Math.sin((d + 1) * (h + 2) * 0.37))) })));

function Swatches({ name, mode }: { name: keyof typeof posterThemes; mode: "light" | "dark" }) {
  const t = posterThemes[name][mode];
  const row = (label: string, colors: string[]) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <span style={{ width: 84, flex: "none", fontSize: 12, color: t.muted }}>{label}</span>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {colors.map((c, i) => (
          <span key={i} title={c} style={{ width: 30, height: 30, borderRadius: 6, background: c }} />
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {row("categorical", t.categorical)}
      {row("sequential", t.sequential)}
      {row("diverging", t.diverging)}
      {row("chrome", [t.grid, t.axis, t.context, t.muted, t.inkSecondary, t.ink])}
      <div style={{ display: "flex", gap: 14, alignItems: "center", color: t.ink, flexWrap: "wrap" }}>
        {(["person", "house", "bike", "wind-turbine", "wheat", "coin", "heart", "globe"] as const).map((n, i) => (
          <Icon key={n} name={n} size={28} color={t.categorical[i % t.categorical.length]} />
        ))}
      </div>
      <p style={{ margin: 0, fontFamily: t.displayFamily, fontWeight: 300, fontSize: 40, lineHeight: 1.05, color: t.ink }}>48.6% of 1,270</p>
      <p style={{ margin: 0, fontSize: 13, color: t.inkSecondary }}>
        Secondary text in inkSecondary. <span style={{ color: t.muted }}>Muted text for sources and axis labels.</span>
      </p>
    </div>
  );
}

function panelsFor(name: keyof typeof posterThemes, mode: "light" | "dark"): PosterPanel[] {
  return [
    { span: 5, title: "Tokens", content: <Swatches name={name} mode={mode} /> },
    { span: 7, title: "Categorical, five series", content: { type: "bar-chart", data: long, x: "region", y: "value", series: "series", orientation: "vertical", height: 260 } },
    { span: 6, title: "Treemap", content: { type: "treemap", data: parts, name: "name", value: "value", height: 240 } },
    { span: 6, title: "Lines with a highlight", content: { type: "line-chart", data: trend, x: "month", y: ["first", "second"], height: 240 } },
    { span: 4, title: "Donut", content: { type: "donut-chart", data: parts, name: "name", value: "value", centerValue: "100", centerLabel: "Total", height: 220 } },
    { span: 4, title: "Sequential", content: { type: "heatmap", data: grid, x: "hour", y: "day", value: "value", height: 220 } },
    { span: 4, title: "Pictogram and number", content: { type: "pictogram-chart", data: parts.slice(0, 3), name: "name", value: "value", unit: 4, icon: "person" }, source: "Test data" },
    { span: 6, content: { type: "segmented-bar", data: parts, name: "name", value: "value" } },
    { span: 6, valign: "center", content: { type: "big-number", value: 0.486, format: "percent", label: "A big number on this ground", delta: 0.021, deltaLabel: "vs last year" } },
  ];
}

export function LabPosters() {
  const params = new URLSearchParams(location.search);
  const dark = params.get("mode") === "dark";
  const pmode = params.get("pmode") === "dark" ? "dark" : "light";
  const only = params.get("theme");
  const width = params.get("w");
  useEffect(() => void document.documentElement.classList.toggle("dark", dark), [dark]);
  const names = (Object.keys(posterThemes) as (keyof typeof posterThemes)[]).filter((n) => !only || n === only);
  return (
    <main style={{ maxWidth: width ? Number(width) : 1280, margin: "0 auto", padding: width ? 8 : 24, display: "grid", gap: 40 }}>
      {names.map((name) => (
        <section key={name} data-poster-theme={name} style={{ display: "grid", gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontFamily: "ui-monospace, monospace", color: "var(--muted-foreground)" }}>
            {name} · {pmode} · surface {posterThemes[name][pmode].surface} · background {posterBackgrounds[name][pmode]}
          </div>
          <Poster theme={name} mode={pmode} download={params.has("download")} kicker={`Poster theme: ${name}`} title="Every kind of mark on this ground, 2025" subtitle="Test data. Check contrast, the gaps between touching marks, labels inside fills and the tooltip." panels={panelsFor(name, pmode)} sources="Test data" credit="InsightCharts" />
        </section>
      ))}
    </main>
  );
}
