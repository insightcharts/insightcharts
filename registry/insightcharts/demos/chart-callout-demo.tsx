import { ChartCallout } from "@/components/insightcharts/molecules/chart-callout";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";

export function ChartCalloutDemo() {
  return (
    <ChartCallout
      chart={<LineChart
        data={[
          { month: "2024-01-01", rate: 4.2 },
          { month: "2024-02-01", rate: 4.3 },
          { month: "2024-03-01", rate: 4.1 },
          { month: "2024-04-01", rate: 3.6 },
          { month: "2024-05-01", rate: 3.1 },
          { month: "2024-06-01", rate: 2.9 },
          { month: "2024-07-01", rate: 2.6 },
          { month: "2024-08-01", rate: 2.4 },
          { month: "2024-09-01", rate: 2.3 },
          { month: "2024-10-01", rate: 2.2 },
          { month: "2024-11-01", rate: 2.1 },
          { month: "2024-12-01", rate: 2.1 },
        ]}
        x="month"
        y="rate"
        format="{value}%"
        zero
        height={280}
        title="Monthly churn fell from 4.2% to 2.1% in 2024"
        subtitle="Monthly customer churn, 2024"
        source="Internal analytics"
        note="Illustrative data"
        annotations={[{ type: "line", axis: "x", value: "2024-03-01", label: "New onboarding" }]}
      />}
      label="Takeaway"
      lead="Churn fell 2 points after March"
      body="Churn was 4.1% in March, when the new onboarding launched. It fell every month from April to November. It was 2.1% in December."
    />
  );
}
