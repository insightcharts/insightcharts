import { useEffect, useRef, useState } from "react";
import { BarChart, BigNumber, InsightData, LineChart, Scrolly, type ChartHandle } from "insightcharts";

// Integration fixture for the engine: remote CSV, transforms, crossfilter, highlight,
// annotations, export and scroll-driven morphing, all on one page.
const months = Array.from({ length: 36 }, (_, i) => {
  const d = new Date(Date.UTC(2022, i, 1)).toISOString().slice(0, 10);
  const base = 100 + i * 2;
  return { date: d, Acme: Math.round(base + Math.sin(i / 3) * 12 + (i > 20 ? (i - 20) * 6 : 0)), Globex: Math.round(base * 0.9 + Math.cos(i / 4) * 10), Initech: Math.round(base * 0.8 + Math.sin(i / 5) * 8), Umbrella: Math.round(base * 0.7 + Math.cos(i / 2) * 6), Hooli: Math.round(base * 0.95 - i) };
});

const steps = [
  { id: "all", content: "Renewable generation by source, all regions and years.", x: "source", highlight: undefined as string | undefined },
  { id: "solar", content: "Solar generated 3,870 TWh, 18% of the total.", x: "source", highlight: "Solar" },
  { id: "region", content: "Asia generated 10,590 TWh, 49% of the total.", x: "region", highlight: "Asia" },
];

export function Lab() {
  const chart = useRef<ChartHandle>(null);
  const [exported, setExported] = useState("");
  useEffect(() => {
    (window as any).__export = async (format: string) => {
      const blob = await chart.current!.export({ format: format as any, download: false });
      const info = `${format}:${blob.type}:${blob.size}`;
      setExported(info);
      return info;
    };
  }, []);
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, display: "grid", gap: 48 }}>
      <section id="highlight">
        <LineChart ref={chart} data={months} x="date" y={["Acme", "Globex", "Initech", "Umbrella", "Hooli"]} highlight="Acme" title="Acme had 251 active teams in December 2024, 1.7 times Globex" subtitle="Monthly active teams, 2022 to 2024" source="Internal analytics" note="Illustrative data" annotations={[{ type: "line", axis: "x", value: "2023-10-01", label: "Pricing change" }, { type: "band", axis: "x", from: "2022-06-01", to: "2022-09-01", label: "Beta" }, { type: "point", x: "2024-12-01", y: 251, label: "251 in\nDecember 2024", position: "left" }]} exportable table />
        <p id="exported">{exported}</p>
      </section>

      <section id="crossfilter">
        <InsightData data="/energy.csv">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <BarChart id="by-region" x="region" y="twh" transform={{ type: "aggregate", groupBy: "region", measures: { twh: { op: "sum", field: "twh" } } }} select title="By region" subtitle="Click a bar to filter" format="compact" height={220} />
            <BarChart id="by-source" x="source" y="twh" transform={{ type: "aggregate", groupBy: "source", measures: { twh: { op: "sum", field: "twh" } } }} select title="By source" subtitle="Click a bar to filter" format="compact" height={220} />
          </div>
          <BarChart x="year" y="twh" series="source" stack transform={[{ type: "aggregate", groupBy: ["year", "source"], measures: { twh: { op: "sum", field: "twh" } } }]} orientation="vertical" title="Stacked by year" format="compact" height={260} />
        </InsightData>
      </section>

      <section id="stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        <BigNumber size="hero" value={8500} label="TWh of renewable power, 2024" context="Up from 6,050 TWh in 2020" />
        <BigNumber value={0.459} format="percent" label="Hydro share of renewable power, 2024" delta="-17.8 pts" deltaLabel="vs 2020" upIsGood={false} />
        <BigNumber value="2.7x" label="Solar generation, 2024 vs 2020" delta="+172%" />
      </section>

      <section id="scrolly">
        <Scrolly steps={steps} stepHeight="70vh" stickyTop={16}>
          {({ step }) => <BarChart data="/energy.csv" x={step.x as string} y="twh" transform={{ type: "aggregate", groupBy: step.x as string, measures: { twh: { op: "sum", field: "twh" } } }} highlight={step.highlight as string | undefined} sort="desc" orientation="horizontal" format="compact" title="Renewable generation, TWh" height={300} />}
        </Scrolly>
      </section>
      <div style={{ height: "60vh" }} />
    </main>
  );
}
