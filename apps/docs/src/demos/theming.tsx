"use client";

import { useRef, useState } from "react";
import { BarChart, BigNumber, InsightProvider, LineChart, useColorMode } from "insightcharts";
import { createTheme, posterBackgrounds, themes, themeSurfaces } from "insightcharts/themes";

const revenue = [
  { quarter: "Q1", Subscriptions: 42, Services: 18, Hardware: 9 },
  { quarter: "Q2", Subscriptions: 48, Services: 19, Hardware: 11 },
  { quarter: "Q3", Subscriptions: 55, Services: 21, Hardware: 10 },
  { quarter: "Q4", Subscriptions: 63, Services: 20, Hardware: 14 },
];

const accents = ["#2a78d6", "#0f766e", "#7c3aed", "#c2410c"];

export default function Theming() {
  const [preset, setPreset] = useState("insight");
  const [accent, setAccent] = useState<string | null>(null);
  // A preset is a complete theme; createTheme layers a partial one over it.
  const base = themes[preset] ?? themes.insight;
  const theme = accent ? createTheme({ accent }, base) : base;
  // Presets other than insight and shadcn are designed for a surface of their own, and poster
  // themes for a painted ground: paint it.
  const box = useRef<HTMLDivElement>(null);
  const { mode } = useColorMode(box, "auto");
  const grounds = { ...themeSurfaces, ...posterBackgrounds } as Record<string, { light: string; dark: string } | undefined>;
  const surface = grounds[preset]?.[mode];
  const chip = { padding: "4px 12px", borderRadius: 999, border: "1px solid var(--border)", fontSize: 13 };
  return (
    <div ref={box} style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {Object.keys(themes).map((name) => (
          <button key={name} type="button" aria-pressed={preset === name} onClick={() => setPreset(name)} style={{ ...chip, background: preset === name ? "var(--accent)" : "transparent" }}>
            {name}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
        {accents.map((color) => (
          <button key={color} type="button" aria-label={`Accent ${color}`} aria-pressed={accent === color} onClick={() => setAccent(accent === color ? null : color)} style={{ width: 22, height: 22, borderRadius: 999, background: color, outline: accent === color ? "2px solid var(--foreground)" : "none", outlineOffset: 2 }} />
        ))}
      </div>
      <InsightProvider theme={theme}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28, alignItems: "start", background: surface, borderRadius: 12, padding: surface ? 20 : 0 }}>
          <div style={{ display: "grid", gap: 20 }}>
            <BigNumber value={97} format="currency:USD" label="Revenue, Q4 ($m)" delta={0.128} deltaLabel="vs Q3" context="Subscriptions were 65% of the total" />
            <BarChart data={revenue} x="quarter" y="Subscriptions" format="{value}m" height={170} title="Subscription revenue rose from $42m in Q1 to $63m in Q4" />
          </div>
          <LineChart data={revenue} x="quarter" y={["Subscriptions", "Services", "Hardware"]} format="{value}m" height={300} title="Revenue by line of business" subtitle="$ millions per quarter" note="Illustrative data" />
        </div>
      </InsightProvider>
    </div>
  );
}
