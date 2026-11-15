import { ProportionalArea } from "@/components/insightcharts/atoms/proportional-area";

const data = [
  { lake: "Superior", area: 82100 },
  { lake: "Victoria", area: 68900 },
  { lake: "Tanganyika", area: 32900 },
  { lake: "Erie", area: 25700 },
  { lake: "Titicaca", area: 8370 },
];

export function ProportionalAreaDemo() {
  return (
    <ProportionalArea
      data={data}
      name="lake"
      value="area"
      format="integer"
      ratio
      title="Lake Superior covers 82,100 km², 9.8 times Lake Titicaca"
      subtitle="Surface area of five lakes, square kilometres"
      source="Approximate published figures"
      note="Rounded, for illustration"
    />
  );
}
