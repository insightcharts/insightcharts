"use client";

import { RibbonChart } from "insightcharts";
import { StoryFrame, type StoryOptions } from "./stories/frame";

// Recorded-music revenue of one invented label by format, in millions.
const revenue = [
  { year: "2004", CD: 82, Download: 6, Vinyl: 2, Streaming: 0.5 },
  { year: "2008", CD: 54, Download: 31, Vinyl: 2, Streaming: 3 },
  { year: "2012", CD: 30, Download: 44, Vinyl: 4, Streaming: 12 },
  { year: "2016", CD: 15, Download: 26, Vinyl: 9, Streaming: 41 },
  { year: "2020", CD: 7, Download: 9, Vinyl: 16, Streaming: 78 },
  { year: "2024", CD: 4, Download: 3, Vinyl: 24, Streaming: 96 },
];

// Each step adds one period. The ribbons keep their colour and re-rank at each year.
const steps = [
  { id: "2008", to: "2008", content: "CDs earned 82 million in 2004 and 54 million in 2008." },
  { id: "2012", to: "2012", content: "Downloads earned 44 million in 2012, more than CDs for the first time." },
  { id: "2016", to: "2016", content: "Streaming earned 41 million in 2016, up from 12 million in 2012." },
  { id: "2020", to: "2020", content: "Vinyl earned 16 million in 2020, more than CDs and downloads together." },
  { id: "2024", to: "2024", content: "Streaming earned 96 million of the label's 127 million in 2024." },
];

export default function StoryRibbon(options: StoryOptions) {
  return (
    <StoryFrame name="ribbon" theme="magenta" steps={steps} {...options}>
      {({ step }) => (
        <RibbonChart
          data={revenue}
          x="year"
          y={["CD", "Download", "Vinyl", "Streaming"]}
          transform={{ type: "filter", field: "year", op: "<=", value: step.to }}
          format="{value}m"
          theme="magenta"
          frame={false}
          height={400}
          title="One label's revenue by format"
          subtitle="Millions a year, largest format at the top"
          note="Illustrative data"
        />
      )}
    </StoryFrame>
  );
}
