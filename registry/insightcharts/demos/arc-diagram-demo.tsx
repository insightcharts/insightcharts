import { ArcDiagram } from "@/components/insightcharts/atoms/arc-diagram";

const data = [
  { a: "Harbour", b: "Market", trips: 4200 },
  { a: "Harbour", b: "Quay", trips: 900 },
  { a: "Quay", b: "Market", trips: 1300 },
  { a: "Market", b: "Town Hall", trips: 2600 },
  { a: "Market", b: "University", trips: 3100 },
  { a: "Town Hall", b: "University", trips: 1500 },
  { a: "Town Hall", b: "Hospital", trips: 1100 },
  { a: "University", b: "Park", trips: 800 },
  { a: "University", b: "Airport", trips: 1900 },
  { a: "Park", b: "Hospital", trips: 600 },
  { a: "Hospital", b: "Stadium", trips: 700 },
  { a: "Stadium", b: "Airport", trips: 1200 },
  { a: "Harbour", b: "Airport", trips: 2300 },
  { a: "Market", b: "Stadium", trips: 1700 },
  { a: "Quay", b: "University", trips: 500 },
];

export function ArcDiagramDemo() {
  return (
    <ArcDiagram
      data={data}
      from="a"
      to="b"
      value="trips"
      order={[
        "Harbour",
        "Quay",
        "Market",
        "Town Hall",
        "University",
        "Park",
        "Hospital",
        "Stadium",
        "Airport",
      ]}
      colorBy="none"
      format="integer"
      title="Harbour and Market stations exchanged 4,200 trips a day"
      subtitle="Daily trips between pairs of stations on one tram line, both directions; dots show each station's total"
      note="Illustrative figures for an invented line."
    />
  );
}
