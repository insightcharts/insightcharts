import { AnnotatedTimeline } from "@/components/insightcharts/molecules/annotated-timeline";
import { BigNumber } from "@/components/insightcharts/atoms/big-number";
import { Sparkline } from "@/components/insightcharts/atoms/sparkline";

export function AnnotatedTimelineDemo() {
  return (
    <AnnotatedTimeline
      title="The ECB raised its deposit rate from −0.5% to 4% between July 2022 and September 2023"
      subtitle="Euro area deposit facility rate and annual inflation, 2021 to 2024"
      events={[
        {
          date: "July 2021",
          title: "Inflation reaches 2.2%",
          text: "The ECB's target is 2%. The bank kept its deposit rate at −0.5%.",
        },
        {
          date: "July 2022",
          title: "The deposit rate rises from −0.5% to 0%",
          emphasis: true,
          text: "This was the ECB's first rate rise in eleven years. Inflation was 8.9%.",
          figure: <BigNumber value="8.9%" label="Annual inflation, July 2022" context="The target is 2%" />,
        },
        {
          date: "October 2022",
          title: "Inflation reaches 10.6%",
          text: "This was the highest monthly figure of 2022. The ECB raised rates by 0.75 points at each of two consecutive meetings.",
          figure: <Sparkline
            data={[
              { month: "2022-01", rate: 5.1 },
              { month: "2022-02", rate: 5.9 },
              { month: "2022-03", rate: 7.4 },
              { month: "2022-04", rate: 7.4 },
              { month: "2022-05", rate: 8.1 },
              { month: "2022-06", rate: 8.6 },
              { month: "2022-07", rate: 8.9 },
              { month: "2022-08", rate: 9.1 },
              { month: "2022-09", rate: 9.9 },
              { month: "2022-10", rate: 10.6 },
              { month: "2022-11", rate: 10.1 },
              { month: "2022-12", rate: 9.2 },
            ]}
            x="month"
            y="rate"
            format="{value}%"
            extremes
            showValue
            style={{ maxWidth: 260 }}
          />,
        },
        {
          date: "September 2023",
          title: "The deposit rate reaches 4%",
          text: "This was the tenth rise in a row. Inflation was 4.3%.",
        },
        {
          date: "June 2024",
          title: "The deposit rate is cut to 3.75%",
          emphasis: true,
          text: "The cut was 0.25 points. Inflation was 2.5%.",
        },
      ]}
      source="European Central Bank; Eurostat"
      note="Figures are approximate, for illustration"
    />
  );
}
