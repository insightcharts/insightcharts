import { BubbleNetwork } from "@/components/insightcharts/atoms/bubble-network";

const data = [
  { airport: "Lisbon", m: 34 },
  { airport: "Madrid", m: 60 },
  { airport: "Paris", m: 67 },
  { airport: "Frankfurt", m: 59 },
  { airport: "Rome", m: 41 },
  { airport: "Athens", m: 28 },
  { airport: "Istanbul", m: 76 },
];

export function BubbleNetworkDemo() {
  return (
    <BubbleNetwork
      data={data}
      name="airport"
      value="m"
      links={[
        { from: "Istanbul", to: "Frankfurt" },
        { from: "Istanbul", to: "Paris" },
        { from: "Istanbul", to: "Rome" },
        { from: "Istanbul", to: "Athens" },
        { from: "Istanbul", to: "Madrid" },
        { from: "Istanbul", to: "Lisbon" },
        { from: "Madrid", to: "Lisbon" },
        { from: "Paris", to: "Frankfurt" },
        { from: "Rome", to: "Athens" },
      ]}
      highlight="Istanbul"
      tag="Busiest"
      format="{value}m"
      title="Istanbul handled 76 million passengers in 2023"
      subtitle="Passengers at seven airports, millions, 2023. Lines show the routes in this example."
      note="Rounded passenger figures; the routes drawn are illustrative"
    />
  );
}
