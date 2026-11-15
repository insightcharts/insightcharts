"use client";

import { BarChart, Scrolly } from "insightcharts";

// Each step changes one thing: the grouping field or the highlight.
const steps = [
  { id: "sources", x: "source", highlight: undefined, content: "Renewable generation in three regions, grouped by source. Hydro generated 11,520 TWh, 53% of the total." },
  { id: "solar", x: "source", highlight: "Solar", content: "Solar generated 3,870 TWh, 18% of the total." },
  { id: "regions", x: "region", highlight: undefined, content: "The same rows grouped by region." },
  { id: "asia", x: "region", highlight: "Asia", content: "Asia generated 10,590 TWh, 49% of the total." },
];

export default function ScrollStory({ stickyTop = 72, stepHeight = "70vh" }: { stickyTop?: number; stepHeight?: string }) {
  return (
    <Scrolly steps={steps} mode="scroll" stickyTop={stickyTop} stepHeight={stepHeight}>
      {({ step }) => (
        <BarChart
          data="/data/energy.csv"
          x={step.x}
          y="twh"
          transform={{ type: "aggregate", groupBy: step.x, measures: { twh: { op: "sum", field: "twh" } } }}
          highlight={step.highlight}
          sort="desc"
          orientation="horizontal"
          format="compact"
          height={280}
          title="Renewable generation, TWh"
          subtitle="2020, 2022 and 2024 combined"
          note="Illustrative data"
        />
      )}
    </Scrolly>
  );
}
