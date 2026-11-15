import { KpiGrid } from "@/components/insightcharts/molecules/kpi-grid";

const data = [
  { month: "2024-01-01", users: 38100, mrr: 412000, churn: 4.2, response: 4.1 },
  { month: "2024-02-01", users: 39400, mrr: 428000, churn: 4, response: 3.9 },
  { month: "2024-03-01", users: 39000, mrr: 431000, churn: 3.9, response: 3.8 },
  { month: "2024-04-01", users: 40800, mrr: 455000, churn: 3.6, response: 3.2 },
  { month: "2024-05-01", users: 42200, mrr: 470000, churn: 3.1, response: 3.4 },
  { month: "2024-06-01", users: 41900, mrr: 476000, churn: 2.9, response: 2.9 },
  { month: "2024-07-01", users: 43500, mrr: 498000, churn: 2.6, response: 2.7 },
  { month: "2024-08-01", users: 44100, mrr: 511000, churn: 2.4, response: 2.6 },
  { month: "2024-09-01", users: 44500, mrr: 524000, churn: 2.3, response: 2.4 },
  { month: "2024-10-01", users: 46000, mrr: 548000, churn: 2.2, response: 2.3 },
  { month: "2024-11-01", users: 47200, mrr: 566000, churn: 2.1, response: 2.2 },
  { month: "2024-12-01", users: 48200, mrr: 589000, churn: 2.1, response: 2.2 },
];

export function KpiGridDemo() {
  return (
    <KpiGrid
      title="Monthly active users rose from 38,100 to 48,200 in 2024"
      subtitle="Four product metrics by month, 2024. Change is measured against January."
      data={data}
      x="month"
      metrics={[
        { y: "users", label: "Monthly active users", format: "compact" },
        { y: "mrr", label: "Recurring revenue", format: "currency:USD" },
        {
          y: "churn",
          label: "Monthly churn",
          format: "{value}%",
          change: "absolute",
          upIsGood: false,
        },
        { y: "response", label: "Median first response", format: "{value} h", upIsGood: false },
      ]}
      source="Internal analytics"
      note="Illustrative data"
    />
  );
}
