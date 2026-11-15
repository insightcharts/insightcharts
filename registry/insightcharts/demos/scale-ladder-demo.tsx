import { ScaleLadder } from "@/components/insightcharts/atoms/scale-ladder";

const data = [
  { thing: "Fridge", c: 4 },
  { thing: "Chocolate melts", c: 34 },
  { thing: "Egg white sets", c: 62 },
  { thing: "Water boils", c: 100, icon: "drop" },
  { thing: "Sugar caramelises", c: 170 },
  { thing: "Deep-frying oil", c: 180, icon: "drop" },
  { thing: "Bread bakes", c: 220 },
  { thing: "Home oven at full heat", c: 250 },
  { thing: "Wood-fired pizza oven", c: 450 },
];

export function ScaleLadderDemo() {
  return (
    <ScaleLadder
      theme="magenta"
      data={data}
      name="thing"
      value="c"
      iconField="icon"
      format="{value}°C"
      scaleLabel="Temperature"
      min={0}
      max={500}
      zones={[
        { from: 0, to: 100, label: "Below boiling" },
        { from: 100, to: 250, label: "Home oven range" },
        { from: 250, to: 500, label: "Wood-fired oven range" },
      ]}
      title="Nine kitchen temperatures from 4°C to 450°C"
      subtitle="Typical temperatures in a kitchen, degrees Celsius"
      note="Approximate, rounded figures."
    />
  );
}
