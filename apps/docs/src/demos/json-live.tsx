"use client";

import { useState } from "react";
import { Insight, type InsightSpec } from "insightcharts";

const initial = `{
  "type": "bar-chart",
  "title": "Support tickets fell from 84 in March to 43 in June",
  "subtitle": "Tickets per 1,000 accounts",
  "data": [
    { "month": "Mar", "tickets": 84 },
    { "month": "Apr", "tickets": 79 },
    { "month": "May", "tickets": 51 },
    { "month": "Jun", "tickets": 43 }
  ],
  "x": "month",
  "y": "tickets",
  "highlight": "Jun",
  "annotations": [{ "type": "line", "axis": "y", "value": 60, "label": "Target: 60" }],
  "height": 260
}`;

export default function JsonLive() {
  const [text, setText] = useState(initial);
  const [spec, setSpec] = useState<InsightSpec>(() => JSON.parse(initial));
  const [error, setError] = useState("");

  function edit(next: string) {
    setText(next);
    try {
      const parsed = JSON.parse(next);
      // Keep the last valid spec on screen while the JSON is mid-edit.
      if (parsed && typeof parsed.type === "string") setSpec(parsed);
      setError(typeof parsed?.type === "string" ? "" : 'A spec needs a "type".');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" }}>
      <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
        <textarea
          value={text}
          onChange={(e) => edit(e.target.value)}
          spellCheck={false}
          aria-label="JSON spec"
          rows={19}
          style={{ width: "100%", resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.6, padding: 12, borderRadius: 8, border: "1px solid var(--border)", background: "transparent" }}
        />
        <p role="status" style={{ fontSize: 12, minHeight: 18, margin: 0, opacity: 0.7 }}>
          {error || "Valid spec. Try changing the type to line-chart or the highlight to Mar."}
        </p>
      </div>
      <div style={{ minWidth: 0 }}>
        <Insight spec={spec} />
      </div>
    </div>
  );
}
