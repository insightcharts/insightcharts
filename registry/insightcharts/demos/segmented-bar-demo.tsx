import { SegmentedBar } from "@/components/insightcharts/atoms/segmented-bar";

const data = [
  { party: "Labour", seats: 411 },
  { party: "Conservative", seats: 121 },
  { party: "Liberal Democrat", seats: 72 },
  { party: "SNP", seats: 9 },
  { party: "Others", seats: 37 },
];

export function SegmentedBarDemo() {
  return (
    <SegmentedBar
      theme="ledger"
      data={data}
      name="party"
      value="seats"
      title="Labour won 411 of 650 seats in the 2024 general election"
      subtitle="Seats in the House of Commons by party after the 2024 general election"
      source="House of Commons Library"
      note="Figures are approximate, for illustration"
    />
  );
}
