import { FunnelChart } from "@/components/insightcharts/atoms/funnel-chart";

const data = [
  { step: "Visited the pricing page", users: 48200 },
  { step: "Started a free trial", users: 9640 },
  { step: "Connected a data source", users: 5310 },
  { step: "Invited a teammate", users: 2230 },
  { step: "Became a paying customer", users: 1480 },
];

export function FunnelChartDemo() {
  return (
    <FunnelChart
      data={data}
      stage="step"
      value="users"
      format="integer"
      title="20% of pricing-page visitors started a free trial"
      subtitle="Users reaching each step of the sign-up funnel, last 90 days"
      source="Product analytics"
      note="Illustrative data"
    />
  );
}
