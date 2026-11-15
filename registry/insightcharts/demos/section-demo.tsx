import { Section } from "@/components/insightcharts/molecules/section";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";

export function SectionDemo() {
  return (
    <Section
      theme="ocean"
      step={2}
      total={4}
      title="First-quarter churn was 2.0% for customers who joined after March"
      intro="Monthly churn fell from 4.2% in January to 2.1% in December 2024. The new onboarding launched in March. Customers who joined after March had first-quarter churn of **2.0%**. Customers who joined before March had 4.1%."
      columns={2}
      body={[
        <LineChart
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
          height={240}
          title="Monthly churn fell from 4.2% to 2.1% in 2024"
          subtitle="Monthly customer churn, 2024"
          annotations={[{ type: "line", axis: "x", value: "2024-03-01", label: "New onboarding" }]}
        />,
        <BarChart
          data={[{ cohort: "Before March", churn: 4.1 }, { cohort: "After March", churn: 2 }]}
          x="cohort"
          y="churn"
          format="{value}%"
          height={240}
          highlight="After March"
          title="First-quarter churn was 4.1% for customers who joined before March"
          subtitle="First-quarter churn by sign-up cohort, 2024"
        />,
      ]}
      outro="The next section covers the first 90 days after sign-up."
    />
  );
}
