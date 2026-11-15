import { StatCircles } from "@/components/insightcharts/atoms/stat-circles";

const data = [
  { who: "per person in the United States", kg: 124 },
  { who: "per person in Brazil", kg: 100 },
  { who: "per person in China", kg: 63 },
  { who: "per person in India", kg: 6 },
];

export function StatCirclesDemo() {
  return (
    <StatCircles
      data={data}
      name="who"
      value="kg"
      unit="kg"
      title="Meat supply in the United States was 124 kg per person in 2021"
      subtitle="Meat supply per person per year, kilograms, 2021"
      source="FAO food balance sheets"
      note="Rounded, approximate figures for illustration"
    />
  );
}
