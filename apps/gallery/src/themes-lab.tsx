import { BarChart, BigNumber, InsightProvider, LineChart, themes, type InsightTheme } from "insightcharts";

// Theme check page (?themes): every preset on the surface it was designed for, light and
// dark side by side, with the charts that stress a theme most: many-series lines, a
// stacked bar (touching fills), a highlight against context grey, and the three ramps.
//   ?themes            all presets        ?themes=ledger   one preset, full width
const years = [2019, 2020, 2021, 2022, 2023, 2024];
const names = ["Solar", "Wind", "Hydro", "Nuclear", "Gas", "Coal", "Bio", "Other"];
const lines = years.map((year, i) => ({ year: `${year}-01-01`, ...Object.fromEntries(names.map((n, k) => [n, Math.round(40 + k * 14 + i * (9 - k * 2.2) + Math.sin(i + k) * 6)])) }));
const stacked = ["Asia", "Europe", "Americas", "Africa"].flatMap((region, r) => names.map((source, k) => ({ region, source, twh: Math.round(30 + ((r * 7 + k * 11) % 23) * 4 + (4 - r) * 12) })));
const ranked = [
  { country: "Norway", share: 0.98 },
  { country: "Brazil", share: 0.89 },
  { country: "Canada", share: 0.68 },
  { country: "Germany", share: 0.52 },
  { country: "China", share: 0.31 },
  { country: "India", share: 0.2 },
];

function Ramp({ label, colors }: { label: string; colors: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "5.5rem 1fr", alignItems: "center", gap: 8, fontSize: 12, color: "var(--_p-muted)" }}>
      <span>{label}</span>
      <div style={{ display: "flex", height: 18, gap: label === "categorical" ? 2 : 0 }}>
        {colors.map((c, i) => (
          <span key={i} title={c} style={{ flex: 1, background: c, borderRadius: label === "categorical" ? 3 : 0 }} />
        ))}
      </div>
    </div>
  );
}

function Panel({ theme, mode }: { theme: InsightTheme; mode: "light" | "dark" }) {
  const t = theme[mode];
  const count = t.categorical.length;
  return (
    // The mode class lets the page-following themes (insight, shadcn) pick up the gallery's
    // --background; the presets ignore it and paint their own surface.
    <div className={mode} data-theme-panel={`${theme.name}-${mode}`} style={{ background: t.surface, color: t.ink, padding: 20, borderRadius: 12, border: `1px solid ${t.grid}`, display: "grid", gap: 28, minWidth: 0, ["--_p-muted" as string]: t.muted }}>
      <InsightProvider theme={theme} mode={mode} lazy={false}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }}>
          <BigNumber value={0.317} format="percent" label="Renewable share of electricity" delta={0.021} deltaLabel="vs 2023" context="Up from 19% in 2010" />
          <BigNumber value={412} format="{value} g/kWh" label="Grid carbon intensity" delta={-0.06} deltaLabel="vs 2023" upIsGood={false} />
        </div>
        <LineChart data={lines} x="year" y={names.slice(0, count)} title={`All ${count} categorical colours as lines`} subtitle="Generation by source, TWh (illustrative)" source="Illustrative data" height={260} />
        <LineChart data={lines} x="year" y={names.slice(0, 5)} highlight="Wind" title="One highlighted series" annotations={[{ type: "line", axis: "y", value: 80, label: "Target" }]} height={220} />
        <BarChart data={stacked.filter((r) => names.indexOf(r.source as string) < count)} x="region" y="twh" series="source" stack orientation="vertical" title="Stacked bars with adjacent palette colours" format="compact" height={260} />
        <BarChart data={ranked} x="country" y="share" format="percent" sort="desc" orientation="horizontal" title="Single series takes the accent" height={220} />
        <div style={{ display: "grid", gap: 8 }}>
          <Ramp label="categorical" colors={t.categorical} />
          <Ramp label="sequential" colors={t.sequential} />
          <Ramp label="diverging" colors={t.diverging} />
        </div>
      </InsightProvider>
    </div>
  );
}

export function ThemesLab() {
  const only = new URLSearchParams(location.search).get("themes");
  const shown = Object.values(themes).filter((t) => !only || t.name === only);
  return (
    <main style={{ maxWidth: 1500, margin: "0 auto", padding: 24, display: "grid", gap: 48 }}>
      <header style={{ display: "flex", gap: 16, fontSize: 14, flexWrap: "wrap" }}>
        <strong>Theme presets</strong>
        <a href="?themes">All</a>
        {Object.keys(themes).map((name) => (
          <a key={name} href={`?themes=${name}`}>
            {name}
          </a>
        ))}
      </header>
      {shown.length === 0 ? <p>No theme named “{only}”.</p> : null}
      {shown.map((theme) => (
        <section key={theme.name} id={theme.name}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>{theme.name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))", gap: 16 }}>
            <Panel theme={theme} mode="light" />
            <Panel theme={theme} mode="dark" />
          </div>
        </section>
      ))}
    </main>
  );
}
