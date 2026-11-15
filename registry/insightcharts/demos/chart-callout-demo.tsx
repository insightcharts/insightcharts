import { ChartCallout } from "@/components/insightcharts/molecules/chart-callout";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";

export function ChartCalloutDemo() {
  return (
    <ChartCallout
      theme="ledger"
      chart={<LineChart
        data={[
          { "2023": 4.4, "2024": 4.2, month: "Jan" },
          { "2023": 4.3, "2024": 4.3, month: "Feb" },
          { "2023": 4.4, "2024": 4.1, month: "Mar" },
          { "2023": 4.2, "2024": 3.6, month: "Apr" },
          { "2023": 4.3, "2024": 3.1, month: "May" },
          { "2023": 4.1, "2024": 2.9, month: "Jun" },
          { "2023": 4.2, "2024": 2.6, month: "Jul" },
          { "2023": 4.3, "2024": 2.4, month: "Aug" },
          { "2023": 4.1, "2024": 2.3, month: "Sep" },
          { "2023": 4.2, "2024": 2.2, month: "Oct" },
          { "2023": 4.3, "2024": 2.1, month: "Nov" },
          { "2023": 4.2, "2024": 2.1, month: "Dec" },
        ]}
        x="month"
        y={["2024", "2023"]}
        highlight="2024"
        contextLabels
        format="{value}%"
        zero
        height={280}
        title="Monthly churn fell from 4.2% to 2.1% in 2024"
        subtitle="Monthly customer churn, 2024 and 2023"
        source="Internal analytics"
        note="Illustrative data"
        annotations={[{ type: "line", axis: "x", value: "Mar", label: "New onboarding" }]}
      />}
      label="Takeaway"
      lead="Churn fell 2 points after March"
      body="Churn was 4.1% in March 2024, when the new onboarding launched. It was 2.1% in December 2024. It was 4.2% in December 2023."
    />
  );
}
