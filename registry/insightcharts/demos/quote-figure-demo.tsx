import { QuoteFigure } from "@/components/insightcharts/molecules/quote-figure";
import { Sparkline } from "@/components/insightcharts/atoms/sparkline";

export function QuoteFigureDemo() {
  return (
    <QuoteFigure
      theme="magenta"
      quote="Solar met more than half of demand on 41% of summer afternoons in 2024. We do not have enough storage for the midday surplus yet."
      attribution="Marta Keller"
      role="Grid planner, quoted in the 2024 system adequacy review"
      stat={{
        value: 0.41,
        format: "percent",
        label: "Summer afternoons when solar met over half of demand",
        context: "It was 6% of afternoons in 2019",
      }}
      figure={<Sparkline
        data={[
          { year: "2019", share: 6 },
          { year: "2020", share: 9 },
          { year: "2021", share: 14 },
          { year: "2022", share: 22 },
          { year: "2023", share: 31 },
          { year: "2024", share: 41 },
        ]}
        x="year"
        y="share"
        format="{value}%"
        area
      />}
      source="National grid operator, hourly generation data"
      note="Illustrative data"
    />
  );
}
