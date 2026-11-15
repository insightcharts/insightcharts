import { TrendCard } from "@/components/insightcharts/molecules/trend-card";

const data = [
  { month: "2024-01-01", users: 38100 },
  { month: "2024-02-01", users: 39400 },
  { month: "2024-03-01", users: 39000 },
  { month: "2024-04-01", users: 40800 },
  { month: "2024-05-01", users: 42200 },
  { month: "2024-06-01", users: 41900 },
  { month: "2024-07-01", users: 43500 },
  { month: "2024-08-01", users: 44100 },
  { month: "2024-09-01", users: 44500 },
  { month: "2024-10-01", users: 46000 },
  { month: "2024-11-01", users: 47200 },
  { month: "2024-12-01", users: 48210 },
];

export function TrendCardDemo() {
  return (
    <TrendCard
      label="Monthly active users"
      data={data}
      x="month"
      y="users"
      format="compact"
      style={{ maxWidth: 300 }}
    />
  );
}
