"use client";

import { useState } from "react";
import { BarChart, BigNumber, InsightProvider, LineChart } from "insightcharts";
import { themes, themeSurfaces } from "insightcharts/themes";

const fares = [
  { year: "2019", Rail: 100, Bus: 100, Air: 100 },
  { year: "2020", Rail: 103, Bus: 102, Air: 91 },
  { year: "2021", Rail: 106, Bus: 105, Air: 97 },
  { year: "2022", Rail: 110, Bus: 111, Air: 118 },
  { year: "2023", Rail: 116, Bus: 119, Air: 127 },
  { year: "2024", Rail: 121, Bus: 124, Air: 131 },
];
const trips = [
  { mode: "Rail", trips: 1.7 },
  { mode: "Bus", trips: 3.6 },
  { mode: "Air", trips: 0.3 },
];

// The presets that paint for a surface of their own. `insight` and `shadcn` follow the page.
const presets = Object.keys(themeSurfaces) as (keyof typeof themeSurfaces)[];

export default function ThemeSurfaces() {
  const [preset, setPreset] = useState<keyof typeof themeSurfaces>("editorial");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const chip = { padding: "4px 12px", borderRadius: 999, border: "1px solid var(--border)", fontSize: 13 };
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {presets.map((name) => (
          <button key={name} type="button" aria-pressed={preset === name} onClick={() => setPreset(name)} style={{ ...chip, background: preset === name ? "var(--accent)" : "transparent" }}>
            {name}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
        {(["light", "dark"] as const).map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} style={{ ...chip, background: mode === m ? "var(--accent)" : "transparent" }}>
            {m}
          </button>
        ))}
      </div>
      {/* The section is painted with the surface the preset was designed for, and the mode is
          forced to match it, so the charts do not depend on the page around them. */}
      <section style={{ background: themeSurfaces[preset][mode], borderRadius: 12, padding: 24 }}>
        <InsightProvider theme={themes[preset]} mode={mode}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28, alignItems: "start" }}>
            <div style={{ display: "grid", gap: 20 }}>
              <BigNumber value={131} format="integer" label="Air fares, index (2019 = 100)" delta={0.031} deltaLabel="vs 2023" upIsGood={false} />
              <BarChart data={trips} x="mode" y="trips" format="{value}bn" height={170} title="Buses carried 3.6bn trips" />
            </div>
            <LineChart data={fares} x="year" y={["Rail", "Bus", "Air"]} height={300} title="The air fare index rose from 97 in 2021 to 131 in 2024" subtitle="Fare index, 2019 = 100" note="Illustrative data" />
          </div>
        </InsightProvider>
      </section>
      <code style={{ fontSize: 12, opacity: 0.7 }}>
        themeSurfaces.{preset}.{mode} = {themeSurfaces[preset][mode]}
      </code>
    </div>
  );
}
