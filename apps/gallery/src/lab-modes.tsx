import { useEffect } from "react";
import { BarChart, BigNumber, DataTable, ExecutiveBrief, InsightProvider, KpiGrid, LineChart, SocialCard } from "insightcharts";

// Forced colour mode: components whose `mode` disagrees with the page, each inside a
// container painted in the forced mode's surface. `?lab-modes` is a light page with dark
// components; `?lab-modes&mode=dark` is the reverse. `&card` shows the social-card export fixture.
const ex = (c: { meta: { example?: Record<string, unknown> } }) => {
  const { type: _type, ...props } = c.meta.example ?? {};
  return props as any;
};

const bars = [
  { region: "North", y2023: 42, y2024: 57 },
  { region: "South", y2023: 38, y2024: 41 },
  { region: "East", y2023: 51, y2024: 66 },
  { region: "West", y2023: 29, y2024: 35 },
];

export function LabModes() {
  const params = new URLSearchParams(location.search);
  const pageDark = params.get("mode") === "dark";
  const forced = pageDark ? "light" : "dark";
  useEffect(() => void document.documentElement.classList.toggle("dark", pageDark), [pageDark]);
  // `&gradient` paints the same colour as a background-image, which the engine's mode
  // detection (it reads background-color) does not see: the container then still looks like the page.
  const paint = forced === "dark" ? "#121211" : "#ffffff";
  const box = { ...(params.has("gradient") ? { backgroundImage: `linear-gradient(${paint}, ${paint})` } : { backgroundColor: paint }), padding: 24, borderRadius: 12 } as const;
  if (params.has("card"))
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: 24 }}>
        <InsightProvider lazy={false} animate={false}>
          <SocialCard
            kicker="Digital divide"
            title="33 of every 100 people have never used the internet"
            exhibit={{ type: "proportion-statement", value: 33, total: 100, text: "people in the world have never used the internet." }}
            source="Illustrative figures"
            onExport={(blob: Blob) => {
              const reader = new FileReader();
              reader.onload = () => ((window as any).__png = reader.result);
              reader.readAsDataURL(blob);
            }}
          />
        </InsightProvider>
      </main>
    );
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, display: "grid", gap: 32 }}>
      <p id="lab-modes-info">
        Page is {pageDark ? "dark" : "light"}; every component below is forced to mode="{forced}".
      </p>
      <InsightProvider lazy={false} animate={false}>
        <section id="m-bar" style={box}>
          <BarChart mode={forced} data={bars} x="region" y={["y2023", "y2024"]} names={{ y2023: "2023", y2024: "2024" }} orientation="vertical" title="Forced-mode bar chart with gridlines" subtitle="Value axis, gridlines, legend and labels" source="Illustrative" annotations={[{ type: "line", axis: "y", value: 50, label: "Target" }]} />
        </section>
        <section id="m-line" style={box}>
          <LineChart mode={forced} {...ex(LineChart)} height={220} />
        </section>
        <section id="m-big" style={box}>
          <BigNumber mode={forced} {...ex(BigNumber)} />
        </section>
        <section id="m-table" style={box}>
          <DataTable mode={forced} {...ex(DataTable)} />
        </section>
        <section id="m-kpi" style={box}>
          <KpiGrid mode={forced} {...ex(KpiGrid)} />
        </section>
        <section id="m-brief" style={box}>
          <ExecutiveBrief mode={forced} {...ex(ExecutiveBrief)} />
        </section>
      </InsightProvider>
    </main>
  );
}
