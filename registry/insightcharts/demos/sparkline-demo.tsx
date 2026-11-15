import { Sparkline } from "@/components/insightcharts/atoms/sparkline";

const data = [
  { month: "2023-07", rate: 3.9 },
  { month: "2023-08", rate: 3.8 },
  { month: "2023-09", rate: 3.8 },
  { month: "2023-10", rate: 3.6 },
  { month: "2023-11", rate: 3.5 },
  { month: "2023-12", rate: 3.6 },
  { month: "2024-01", rate: 3.4 },
  { month: "2024-02", rate: 3.7 },
  { month: "2024-03", rate: 3.8 },
  { month: "2024-04", rate: 3.9 },
  { month: "2024-05", rate: 4.1 },
  { month: "2024-06", rate: 4.3 },
  { month: "2024-07", rate: 4.2 },
  { month: "2024-08", rate: 4.1 },
  { month: "2024-09", rate: 4.2 },
  { month: "2024-10", rate: 4.4 },
];

export function SparklineDemo() {
  return (
    <Sparkline
      data={data}
      x="month"
      y="rate"
      format="{value}%"
      showValue
      extremes
      style={{ maxWidth: 220 }}
      alt="Sparkline of the unemployment rate over 16 months, July 2023 to October 2024. It started at 3.9%, fell to 3.4% in January 2024 and ended at 4.4%, the highest in the period."
    />
  );
}
