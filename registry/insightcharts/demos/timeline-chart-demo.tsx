import { TimelineChart } from "@/components/insightcharts/atoms/timeline-chart";

const data = [
  { mission: "Mercury", programme: "Crewed programmes", from: "1958-10", to: "1963-05" },
  { mission: "Gemini", programme: "Crewed programmes", from: "1961-12", to: "1966-11" },
  { mission: "Apollo", programme: "Crewed programmes", from: "1961-05", to: "1972-12" },
  { mission: "Skylab", programme: "Crewed programmes", from: "1973-05", to: "1974-02" },
  { mission: "Shuttle development", programme: "Crewed programmes", from: "1972-01", to: "1981-04" },
  { mission: "Glenn orbits Earth", programme: "Milestones", from: "1962-02-20" },
  { mission: "Apollo 1 fire", programme: "Milestones", from: "1967-01-27" },
  { mission: "First Moon landing", programme: "Milestones", from: "1969-07-20" },
  { mission: "Apollo-Soyuz", programme: "Milestones", from: "1975-07-15" },
  { mission: "First Shuttle flight", programme: "Milestones", from: "1981-04-12" },
];

export function TimelineChartDemo() {
  return (
    <TimelineChart
      data={data}
      name="mission"
      start="from"
      end="to"
      lane="programme"
      highlight={["Apollo", "First Moon landing"]}
      title="The Apollo programme ran from May 1961 to December 1972"
      subtitle="NASA human spaceflight programmes and milestones, 1958 to 1981"
      source="NASA History Office"
      note="Figures are approximate, for illustration"
    />
  );
}
