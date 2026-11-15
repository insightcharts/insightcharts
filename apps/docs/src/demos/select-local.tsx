"use client";

import { useState } from "react";
import { BarChart } from "insightcharts";

const data = [
  { channel: "Search", signups: 420 },
  { channel: "Referral", signups: 310 },
  { channel: "Social", signups: 180 },
  { channel: "Email", signups: 95 },
];

export default function SelectLocal() {
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <BarChart data={data} x="channel" y="signups" select onSelect={(values) => setPicked(values)} orientation="horizontal" height={200} title="Search brought in 420 signups" subtitle="Click a bar to select it. Click the empty plot area to clear." />
      <p aria-live="polite" style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
        onSelect: {picked.length ? JSON.stringify(picked) : "[]"}
      </p>
    </div>
  );
}
