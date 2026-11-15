"use client";

import { LineChart, type ModeInput } from "insightcharts";

const latency = [
  { day: "Mon", p50: 120, p95: 310 },
  { day: "Tue", p50: 118, p95: 295 },
  { day: "Wed", p50: 131, p95: 420 },
  { day: "Thu", p50: 122, p95: 330 },
  { day: "Fri", p50: 117, p95: 290 },
];

// A forced mode that disagrees with the page stops reading the page's --background and
// --foreground, so the ink is right on its own. The chart does not paint a background,
// so each forced panel supplies one.
const panels: { mode: ModeInput; background: string; label: string }[] = [
  { mode: "auto", background: "var(--background)", label: 'mode="auto" follows the page' },
  { mode: "light", background: "#fcfcfb", label: 'mode="light" on a light panel' },
  { mode: "dark", background: "#1a1a19", label: 'mode="dark" on a dark panel' },
];

export default function ColorModes() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      {panels.map((p) => (
        <div key={p.mode} style={{ background: p.background, border: "1px solid var(--border)", borderRadius: 10, padding: 16, minWidth: 0 }}>
          <LineChart data={latency} x="day" y={["p50", "p95"]} mode={p.mode} format="{value} ms" height={180} title="p95 latency was 420 ms on Wednesday" subtitle={p.label} />
        </div>
      ))}
    </div>
  );
}
