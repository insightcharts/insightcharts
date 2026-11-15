import { UnitBlocks } from "@/components/insightcharts/atoms/unit-blocks";

const data = [
  { age: "Under 30", finishers: 4180 },
  { age: "30 to 39", finishers: 6920 },
  { age: "40 to 49", finishers: 5340 },
  { age: "50 to 59", finishers: 2760 },
  { age: "60 and over", finishers: 1150 },
];

export function UnitBlocksDemo() {
  return (
    <UnitBlocks
      data={data}
      name="age"
      value="finishers"
      unit={10}
      unitLabel="10 finishers"
      format="integer"
      title="6,920 of the 20,350 finishers were aged 30 to 39"
      subtitle="Finishers of the Lakeshore Marathon by age group, 2025"
      source="Illustrative data"
      note="Invented figures for a fictional race"
    />
  );
}
