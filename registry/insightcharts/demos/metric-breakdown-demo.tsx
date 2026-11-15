import { MetricBreakdown } from "@/components/insightcharts/molecules/metric-breakdown";

const data = [
  { sector: "Energy supply", mt: 862 },
  { sector: "Transport", mt: 804 },
  { sector: "Industry", mt: 701 },
  { sector: "Buildings", mt: 437 },
  { sector: "Agriculture", mt: 378 },
  { sector: "Waste", mt: 109 },
];

export function MetricBreakdownDemo() {
  return (
    <MetricBreakdown
      label="Greenhouse gas emissions, EU-27, 2022"
      context="Million tonnes of CO2 equivalent. 31% below the 1990 level."
      data={data}
      name="sector"
      value="mt"
      format="integer"
      source="European Environment Agency"
      note="Rounded, approximate figures for illustration"
    />
  );
}
