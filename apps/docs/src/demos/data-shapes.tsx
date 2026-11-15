"use client";

import { useState } from "react";
import { BarChart, type DataInput } from "insightcharts";

// The same four rows, in every shape the `data` prop accepts.
const shapes: Record<string, DataInput> = {
  "Row objects": [
    { team: "Design", headcount: 14 },
    { team: "Engineering", headcount: 46 },
    { team: "Sales", headcount: 23 },
    { team: "Support", headcount: 17 },
  ],
  Columns: { team: ["Design", "Engineering", "Sales", "Support"], headcount: [14, 46, 23, 17] },
  "CSV text": "team,headcount\nDesign,14\nEngineering,46\nSales,23\nSupport,17",
  "{ csv }": { csv: "team;headcount\nDesign;14\nEngineering;46\nSales;23\nSupport;17", delimiter: ";" },
  "{ json, path }": { json: { meta: { year: 2025 }, result: { teams: [["team", "headcount"], ["Design", 14], ["Engineering", 46], ["Sales", 23], ["Support", 17]] } }, path: "result.teams" },
  "Async function": async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return [
      { team: "Design", headcount: 14 },
      { team: "Engineering", headcount: 46 },
      { team: "Sales", headcount: 23 },
      { team: "Support", headcount: 17 },
    ];
  },
};

export default function DataShapes() {
  const [shape, setShape] = useState("Row objects");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div role="group" aria-label="Data shape" style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13 }}>
        {Object.keys(shapes).map((name) => (
          <button key={name} type="button" aria-pressed={shape === name} onClick={() => setShape(name)} style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid var(--border)", background: shape === name ? "var(--accent)" : "transparent" }}>
            {name}
          </button>
        ))}
      </div>
      <BarChart data={shapes[shape]} x="team" y="headcount" orientation="horizontal" height={200} title="Engineering has 46 people" subtitle={`Headcount, passed as: ${shape}`} />
    </div>
  );
}
