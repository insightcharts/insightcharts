"use client";

import { Insight as PackageInsight, registerComponents, type InsightProps } from "insightcharts";

// <Insight spec={{ type: "bar-chart", ... }} /> renders any InsightCharts component from JSON.
// By default every type resolves to the component shipped in the insightcharts package.
// To make specs render a copy you installed and customised from the registry, import it
// and pass it to registerComponents: the last registration for a name wins.
//
//   import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
//   registerComponents({ BarChart });

export { registerComponents };
export type { InsightProps };

export function Insight(props: InsightProps) {
  return <PackageInsight {...props} />;
}
