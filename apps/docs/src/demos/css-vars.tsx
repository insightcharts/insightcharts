"use client";

import type { CSSProperties } from "react";
import { BarChart } from "insightcharts";

const data = [
  { browser: "Chrome", share: 64 },
  { browser: "Safari", share: 19 },
  { browser: "Edge", share: 5 },
  { browser: "Firefox", share: 3 },
];

// Any ancestor can set --ic-* variables; the chart resolves them against its own DOM node.
const brand = { "--ic-accent": "#0f766e", "--ic-grid": "color-mix(in oklch, #0f766e 18%, transparent)", "--ic-font-display": "Georgia, serif" } as CSSProperties;

export default function CssVars() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
      <BarChart data={data} x="browser" y="share" format="{value}%" orientation="horizontal" height={190} title="Default tokens" />
      <div style={brand}>
        <BarChart data={data} x="browser" y="share" format="{value}%" orientation="horizontal" height={190} title="Scoped --ic-* overrides" />
      </div>
    </div>
  );
}
