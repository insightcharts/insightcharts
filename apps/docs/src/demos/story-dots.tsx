"use client";

import { BeeswarmChart } from "insightcharts";
import { StoryFrame, type StoryOptions } from "./stories/frame";

// 96 invented schools: a reading score out of 100 and the kind of place each school is in.
const AREAS = [
  { area: "City", centre: 74, count: 38 },
  { area: "Town", centre: 67, count: 34 },
  { area: "Village", centre: 59, count: 24 },
];
const schools = AREAS.flatMap(({ area, centre, count }, a) =>
  Array.from({ length: count }, (_, i) => {
    // A fixed pattern of offsets, so the same dots are drawn on the server and in the browser.
    const spread = Math.sin((i + 1) * 12.9898 + a * 78.233) * 43758.5453;
    const offset = (spread - Math.floor(spread) - 0.5) * 30 + Math.sin(i * 1.7) * 6;
    return { school: `${area} school ${i + 1}`, area, score: Math.round(Math.min(96, Math.max(38, centre + offset))) };
  }),
);

// Each step changes one prop of the same chart.
const steps = [
  { id: "all", content: "Each dot is one of 96 schools, placed by its reading score out of 100." },
  { id: "median", median: true, content: "The line marks the median school, which scored 68." },
  { id: "rows", median: true, group: "area", content: "The same dots in three rows, by the kind of place the school is in." },
  { id: "colour", median: true, group: "area", series: "area", content: "Each row takes a colour. The median was 75 in cities, 67 in towns and 59 in villages." },
  { id: "village", median: true, group: "area", series: "area", highlight: "Village", content: "24 of the 96 schools are in villages. 7 of them scored above the overall median of 68." },
];

export default function StoryDots(options: StoryOptions) {
  return (
    <StoryFrame name="dots" theme="dusk" steps={steps} {...options}>
      {({ step }) => (
        <BeeswarmChart
          data={schools}
          value="score"
          label="school"
          group={step.group}
          series={step.series}
          median={step.median}
          highlight={step.highlight}
          theme="dusk"
          frame={false}
          height={380}
          title="Reading scores at 96 schools"
          subtitle="Score out of 100, one dot per school"
          note="Illustrative data"
        />
      )}
    </StoryFrame>
  );
}
