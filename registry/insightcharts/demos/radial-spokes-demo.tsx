import { RadialSpokes } from "@/components/insightcharts/atoms/radial-spokes";

const data = [
  { use: "Space heating", share: 42 },
  { use: "Hot water", share: 17 },
  { use: "Cooking", share: 6 },
  { use: "Fridge and freezer", share: 8 },
  { use: "Laundry", share: 7 },
  { use: "Lighting", share: 5 },
  { use: "Screens and computers", share: 9 },
  { use: "Everything else", share: 6 },
];

export function RadialSpokesDemo() {
  return (
    <RadialSpokes
      theme="forest"
      data={data}
      name="use"
      value="share"
      format="{value}%"
      icon="house"
      highlight="Space heating"
      title="Space heating uses 42% of a home's energy"
      subtitle="Share of household energy by end use, a typical home in a cool climate"
      note="Illustrative figures"
    />
  );
}
