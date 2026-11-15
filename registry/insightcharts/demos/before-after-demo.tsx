import { BeforeAfter } from "@/components/insightcharts/molecules/before-after";

export function BeforeAfterDemo() {
  return (
    <BeforeAfter
      title="Solar module prices fell from $0.74 to $0.15 per watt between 2013 and 2023"
      subtitle="Average price of crystalline silicon modules, US dollars per watt"
      format={{ style: "currency", currency: "USD" }}
      before={{ heading: "2013", value: 0.74, label: "Per watt", context: "2013 average" }}
      after={{ heading: "2023", value: 0.15, label: "Per watt", context: "2023 average" }}
      deltaLabel="in ten years"
      upIsGood={false}
      source="IRENA Renewable Power Generation Costs 2023"
      note="Rounded, approximate figures for illustration"
    />
  );
}
