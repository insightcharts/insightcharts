"use client";

import { BarChart } from "insightcharts";
import { StoryFrame, type StoryOptions } from "./stories/frame";

// Visits to seven invented museums in 2024, thousands, by the kind of ticket.
const visits = [
  { museum: "Aviation", Adult: 310, Child: 240, Member: 60 },
  { museum: "City history", Adult: 180, Child: 70, Member: 110 },
  { museum: "Design", Adult: 420, Child: 60, Member: 150 },
  { museum: "Maritime", Adult: 260, Child: 190, Member: 40 },
  { museum: "Modern art", Adult: 640, Child: 90, Member: 230 },
  { museum: "Natural history", Adult: 520, Child: 610, Member: 120 },
  { museum: "Science", Adult: 390, Child: 540, Member: 90 },
].map((m) => ({ ...m, Total: m.Adult + m.Child + m.Member }));

const TICKETS = ["Adult", "Child", "Member"];

// Each step changes one prop: the sort, the series, the stacking or the highlight.
const steps = [
  { id: "names", y: ["Total"], content: "Seven museums in alphabetical order. Together they had 6.32 million visits in 2024." },
  { id: "sorted", y: ["Total"], sort: "desc", content: "The same bars from largest to smallest. Natural history had 1.25 million visits." },
  { id: "split", y: TICKETS, sort: "desc", stack: true, content: "Each bar split by ticket. Adults made 2.72 million of the 6.32 million visits." },
  { id: "share", y: TICKETS, sort: "desc", stack: "percent", content: "Every bar stretched to 100%. Children made 49% of the visits to Natural history." },
  { id: "child", y: TICKETS, sort: "desc", stack: "percent", highlight: "Child", content: "Child tickets in colour. They were 8% of visits to Design and 53% of visits to Science." },
] as const;

export default function StoryBars(options: StoryOptions) {
  return (
    <StoryFrame name="bars" theme="editorial" steps={[...steps]} {...options}>
      {({ step }) => (
        <BarChart
          data={visits}
          x="museum"
          y={[...step.y]}
          sort={"sort" in step ? step.sort : "none"}
          stack={"stack" in step ? step.stack : false}
          highlight={"highlight" in step ? step.highlight : undefined}
          orientation="horizontal"
          theme="editorial"
          frame={false}
          height={380}
          title="Visits to seven museums in 2024"
          subtitle="Thousands of visits by ticket type"
          note="Illustrative data"
        />
      )}
    </StoryFrame>
  );
}
