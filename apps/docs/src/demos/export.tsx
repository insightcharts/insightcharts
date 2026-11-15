"use client";

import { useRef, useState } from "react";
import { LineChart, type ChartHandle, type ExportFormat } from "insightcharts";

const signups = [
  { week: "W1", Organic: 310, Paid: 120 },
  { week: "W2", Organic: 340, Paid: 180 },
  { week: "W3", Organic: 365, Paid: 260 },
  { week: "W4", Organic: 372, Paid: 410 },
  { week: "W5", Organic: 401, Paid: 455 },
  { week: "W6", Organic: 420, Paid: 470 },
];

const formats: ExportFormat[] = ["png", "jpeg", "svg", "pdf", "csv", "json"];

export default function Export() {
  const chart = useRef<ChartHandle>(null);
  const [last, setLast] = useState("");

  async function save(format: ExportFormat) {
    // Downloads the file and resolves to the same Blob.
    const blob = await chart.current!.export({ format });
    setLast(`${format.toUpperCase()} · ${blob.type || "file"} · ${(blob.size / 1024).toFixed(1)} kB`);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <LineChart ref={chart} data={signups} x="week" y={["Organic", "Paid"]} title="Paid signups rose from 120 in week 1 to 470 in week 6" subtitle="New accounts per week" source="Product analytics" note="Illustrative data" height={260} exportable />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", fontSize: 13 }}>
        {formats.map((f) => (
          <button key={f} type="button" onClick={() => save(f)} style={{ padding: "4px 12px", borderRadius: 999, border: "1px solid var(--border)" }}>
            {f.toUpperCase()}
          </button>
        ))}
        <span aria-live="polite" style={{ opacity: 0.7 }}>
          {last}
        </span>
      </div>
    </div>
  );
}
