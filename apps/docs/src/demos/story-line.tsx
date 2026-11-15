"use client";

import { LineChart } from "insightcharts";
import { StoryFrame, type StoryOptions } from "./stories/frame";

// Share of new cars sold that were electric, in four invented countries.
const sales = [
  { year: "2014", Norland: 3, Estia: 1, Sudria: 1, Westmark: 0 },
  { year: "2015", Norland: 5, Estia: 1, Sudria: 1, Westmark: 1 },
  { year: "2016", Norland: 8, Estia: 2, Sudria: 1, Westmark: 1 },
  { year: "2017", Norland: 12, Estia: 3, Sudria: 2, Westmark: 1 },
  { year: "2018", Norland: 19, Estia: 5, Sudria: 2, Westmark: 2 },
  { year: "2019", Norland: 27, Estia: 8, Sudria: 3, Westmark: 2 },
  { year: "2020", Norland: 38, Estia: 13, Sudria: 5, Westmark: 3 },
  { year: "2021", Norland: 51, Estia: 19, Sudria: 8, Westmark: 4 },
  { year: "2022", Norland: 64, Estia: 26, Sudria: 12, Westmark: 6 },
  { year: "2023", Norland: 76, Estia: 34, Sudria: 17, Westmark: 8 },
  { year: "2024", Norland: 84, Estia: 41, Sudria: 23, Westmark: 11 },
];

const ALL = ["Norland", "Estia", "Sudria", "Westmark"];
const rebate = { type: "line" as const, axis: "x" as const, value: "2019", label: "Purchase rebate starts", dashed: true };
const peak = { type: "point" as const, x: "2024", y: 84, label: "84%", position: "left" as const };

// Each step changes one thing: the series drawn, the highlight, the annotations or the years shown.
const steps = [
  { id: "one", y: ["Norland"], content: "Electric cars were 3% of new cars sold in Norland in 2014 and 84% in 2024." },
  { id: "all", y: ALL, content: "Three neighbouring countries on the same axis. Estia reached 41% in 2024." },
  { id: "focus", y: ALL, highlight: "Norland", content: "Norland in colour, the other three in grey." },
  { id: "notes", y: ALL, highlight: "Norland", annotations: [rebate, peak], content: "Norland introduced a purchase rebate in 2019. The share was 27% that year." },
  { id: "zoom", y: ALL, highlight: "Norland", annotations: [rebate, peak], from: "2018", content: "The years from 2018 only. Norland's share rose from 19% to 84% in six years." },
];

export default function StoryLine(options: StoryOptions) {
  return (
    <StoryFrame name="line" theme="ledger" steps={steps} {...options}>
      {({ step }) => (
        <LineChart
          data={sales}
          x="year"
          y={step.y}
          highlight={step.highlight}
          annotations={step.annotations}
          transform={step.from ? { type: "filter", field: "year", op: ">=", value: step.from } : undefined}
          format="{value}%"
          theme="ledger"
          frame={false}
          height={380}
          title="Electric share of new car sales"
          subtitle="Percent of new cars sold, four countries, 2014 to 2024"
          note="Illustrative data"
        />
      )}
    </StoryFrame>
  );
}
