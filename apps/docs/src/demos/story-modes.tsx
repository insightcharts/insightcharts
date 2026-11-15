"use client";

import { useState } from "react";
import { LineChart, Scrolly } from "insightcharts";

const visits = [
  { month: "Jan", Search: 42, Social: 30, Email: 12 },
  { month: "Feb", Search: 44, Social: 34, Email: 13 },
  { month: "Mar", Search: 47, Social: 41, Email: 13 },
  { month: "Apr", Search: 49, Social: 52, Email: 14 },
  { month: "May", Search: 50, Social: 61, Email: 15 },
  { month: "Jun", Search: 53, Social: 58, Email: 21 },
];

const steps = [
  { id: "search", highlight: "Search", content: "Search visits rose from 42,000 in January to 53,000 in June." },
  { id: "social", highlight: "Social", content: "Social visits rose from 30,000 in January to 58,000 in June." },
  { id: "email", highlight: "Email", content: "Email visits rose from 15,000 in May to 21,000 in June." },
];

export default function StoryModes() {
  const [mode, setMode] = useState<"steps" | "swipe">("steps");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div role="group" aria-label="Story mode" style={{ display: "flex", gap: 8, fontSize: 13 }}>
        {(["steps", "swipe"] as const).map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid var(--border)", background: mode === m ? "var(--accent)" : "transparent" }}>
            mode="{m}"
          </button>
        ))}
      </div>
      <Scrolly steps={steps} mode={mode}>
        {({ step }) => <LineChart data={visits} x="month" y={["Search", "Social", "Email"]} highlight={step.highlight} title="Monthly visits by channel" subtitle="Thousands of visits per month" note="Illustrative data" height={240} />}
      </Scrolly>
    </div>
  );
}
