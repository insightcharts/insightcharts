import { FanFlow } from "@/components/insightcharts/atoms/fan-flow";

const data = [
  { use: "Shower", litres: 128 },
  { use: "Toilet", litres: 97 },
  { use: "Washing machine", litres: 62 },
  { use: "Kitchen tap", litres: 45 },
  { use: "Dishwasher", litres: 24 },
  { use: "Garden", litres: 21 },
  { use: "Bathroom tap", litres: 19 },
  { use: "Leaks", litres: 16 },
];

export function FanFlowDemo() {
  return (
    <FanFlow
      data={data}
      name="use"
      value="litres"
      trunk="Litres a day"
      tagged={["Shower", "Washing machine", "Dishwasher"]}
      tagLabel="Uses heated water"
      title="Showers used 128 of a household's 412 litres of water a day"
      subtitle="Daily water use of one four-person household by use, litres"
      note="Illustrative figures."
    />
  );
}
