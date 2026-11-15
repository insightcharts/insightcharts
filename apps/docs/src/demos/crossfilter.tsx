"use client";

import { BarChart, InsightData, useInsightData } from "insightcharts";

const sum = (groupBy: string | string[]) => ({
  type: "aggregate" as const,
  groupBy,
  measures: { twh: { op: "sum" as const, field: "twh" } },
});

function Reset() {
  const store = useInsightData();
  const active = Object.values(store?.selections ?? {}).flatMap((s) => s.values ?? []);
  return (
    <p style={{ display: "flex", gap: 12, alignItems: "center", minHeight: 28, margin: 0, fontSize: 13 }}>
      <span style={{ opacity: 0.7 }}>{active.length ? `Filtered to ${active.join(", ")}` : "Click a bar to filter the other charts."}</span>
      {active.length ? (
        <button type="button" onClick={() => store?.clear()} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
          Reset
        </button>
      ) : null}
    </p>
  );
}

export default function Crossfilter() {
  return (
    <InsightData data="/data/energy.csv">
      <div style={{ display: "grid", gap: 20 }}>
        <Reset />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          <BarChart id="by-region" select x="region" y="twh" transform={sum("region")} format="compact" height={180} title="By region" />
          <BarChart id="by-source" select x="source" y="twh" transform={sum("source")} format="compact" height={180} title="By source" />
        </div>
        <BarChart
          x="year"
          y="twh"
          series="source"
          stack
          orientation="vertical"
          transform={sum(["year", "source"])}
          format="compact"
          height={240}
          title="Renewable generation by year"
          subtitle="TWh, stacked by source. Follows both selections above."
          note="Illustrative data"
        />
      </div>
    </InsightData>
  );
}
