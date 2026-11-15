"use client";

import { Treemap } from "insightcharts";
import { StoryFrame, type StoryOptions } from "./stories/frame";

// One household's spending in 2019 and 2024, in an invented currency, by category.
const spending = [
  { group: "Home", item: "Rent", y2019: 9600, y2024: 13200 },
  { group: "Home", item: "Energy", y2019: 1500, y2024: 2700 },
  { group: "Home", item: "Repairs", y2019: 700, y2024: 900 },
  { group: "Food", item: "Groceries", y2019: 4800, y2024: 6300 },
  { group: "Food", item: "Eating out", y2019: 2100, y2024: 1800 },
  { group: "Transport", item: "Car", y2019: 3900, y2024: 2200 },
  { group: "Transport", item: "Train and bus", y2019: 900, y2024: 1700 },
  { group: "Transport", item: "Bike", y2019: 100, y2024: 600 },
  { group: "Leisure", item: "Holidays", y2019: 2600, y2024: 3100 },
  { group: "Leisure", item: "Streaming", y2019: 300, y2024: 700 },
  { group: "Leisure", item: "Sport", y2019: 800, y2024: 900 },
];

// Each step changes one prop: the year measured or the highlight.
const steps = [
  { id: "2019", value: "y2019", content: "Eleven things one household paid for in 2019, sized by what they cost. Home took 11,800 of the 27,300." },
  { id: "2024", value: "y2024", content: "The same household in 2024. The total was 34,100 and Home took 16,800." },
  { id: "transport", value: "y2024", highlight: ["Car", "Train and bus", "Bike"], content: "Transport in colour. Spending on the car fell from 3,900 to 2,200." },
  { id: "rent", value: "y2024", highlight: ["Rent"], content: "Rent in colour. It rose from 9,600 to 13,200, which is 39% of all spending in 2024." },
];

export default function StoryTreemap(options: StoryOptions) {
  return (
    <StoryFrame name="treemap" theme="forest" steps={steps} {...options}>
      {({ step }) => (
        <Treemap
          data={spending}
          name="item"
          value={step.value}
          group="group"
          highlight={step.highlight}
          format="integer"
          theme="forest"
          frame={false}
          height={400}
          title="One household's spending by category"
          subtitle="Spending in the year, 2019 and 2024"
          note="Illustrative data"
        />
      )}
    </StoryFrame>
  );
}
