import { TimelineStory } from "@/components/insightcharts/templates/timeline-story";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { StatTile } from "@/components/insightcharts/atoms/stat-tile";

export function TimelineStoryDemo() {
  return (
    <TimelineStory
      theme="forest"
      kicker="Energy"
      title="Coal generated 39% of Britain's electricity in 2012 and 0.6% in 2024"
      deck="The first public coal power station opened in 1882. The last coal plant closed on 30 September 2024."
      byline="By the data desk"
      date="2024-10-01"
      timeline={<LineChart
        data={[
          { year: "1990-01-01", share: 65, wind: 0 },
          { year: "1994-01-01", share: 50, wind: 0 },
          { year: "1998-01-01", share: 35, wind: 0.2 },
          { year: "2002-01-01", share: 32, wind: 0.4 },
          { year: "2006-01-01", share: 38, wind: 1 },
          { year: "2010-01-01", share: 28, wind: 3 },
          { year: "2012-01-01", share: 39, wind: 6 },
          { year: "2013-01-01", share: 36, wind: 8 },
          { year: "2014-01-01", share: 30, wind: 9 },
          { year: "2015-01-01", share: 22, wind: 12 },
          { year: "2016-01-01", share: 9, wind: 11 },
          { year: "2017-01-01", share: 7, wind: 15 },
          { year: "2018-01-01", share: 5, wind: 17 },
          { year: "2019-01-01", share: 2, wind: 20 },
          { year: "2020-01-01", share: 2, wind: 24 },
          { year: "2021-01-01", share: 2, wind: 21 },
          { year: "2022-01-01", share: 1.5, wind: 27 },
          { year: "2023-01-01", share: 1, wind: 29 },
          { year: "2024-01-01", share: 0.6, wind: 30 },
        ]}
        x="year"
        y={["share", "wind"]}
        names={{ share: "Coal", wind: "Wind" }}
        format="{value}%"
        zero
        title="Coal's share of generation fell from 65% in 1990 to 0.6% in 2024"
        subtitle="Share of Great Britain's electricity generated from coal and from wind, 1990 to 2024"
        annotations={[
          {
            type: "band",
            axis: "x",
            from: "1990-01-01",
            to: "1998-01-01",
            label: "Gas plants built",
          },
          { type: "line", axis: "x", value: "2013-01-01", label: "Carbon price floor" },
          { type: "point", x: "2012-01-01", y: 39, label: "39% in 2012", position: "top" },
        ]}
        source="Department for Energy Security and Net Zero and National Grid ESO (rounded)"
        note="Figures are approximate, for illustration"
      />}
      intro="Coal's share fell in two periods. It fell from 65% to 35% between 1990 and 1998, when generators built gas plants. It fell from 39% to 9% between 2012 and 2016, after the carbon price floor was introduced."
      chapters={[
        {
          date: "1882",
          title: "The first public coal power station opens in London",
          text: "Thomas Edison's company built the plant at Holborn Viaduct. It supplied street lamps and nearby buildings.",
        },
        {
          date: "1990s",
          title: "Coal's share falls from 65% to 35% between 1990 and 1998",
          text: "Privatised generators built gas plants, which were cheaper and quicker to build than coal plants. Coal's share was between 28% and 39% from 1998 to 2013.",
        },
        {
          date: "April 2013",
          title: "The carbon price floor takes effect",
          emphasis: true,
          text: "The floor set a minimum price on power-station emissions. The rate doubled in 2015. Coal's share fell from 22% in 2015 to 9% in 2016.",
          exhibit: <BarChart
            data={[
              { year: "2012", share: 39 },
              { year: "2013", share: 36 },
              { year: "2014", share: 30 },
              { year: "2015", share: 22 },
              { year: "2016", share: 9 },
            ]}
            x="year"
            y="share"
            orientation="vertical"
            sort="none"
            highlight="2016"
            format="{value}%"
            height={170}
            subtitle="Coal share of generation, 2012 to 2016"
          />,
        },
        {
          date: "21 April 2017",
          title: "The first full day without coal since 1882",
          text: "Britain had 1 coal-free day in 2017. It had 180 in 2020.",
          exhibit: <BarChart
            data={[
              { year: "2017", days: 1 },
              { year: "2018", days: 21 },
              { year: "2019", days: 83 },
              { year: "2020", days: 180 },
            ]}
            x="year"
            y="days"
            orientation="vertical"
            sort="none"
            highlight="2020"
            height={170}
            subtitle="Coal-free days per year"
          />,
        },
        {
          date: "30 September 2024",
          title: "Ratcliffe-on-Soar, the last coal plant, shuts down",
          emphasis: true,
          text: "The plant had run since 1968. In 2024 wind generated 30% of the country's electricity and gas generated 26%.",
          exhibit: <StatTile
            variant="comparison"
            surface="borderless"
            upIsGood={false}
            value={0.6}
            comparison={39}
            valueLabel="2024"
            comparisonLabel="2012"
            format="{value}%"
            label="Coal share of generation"
            context="Britain was the first G7 country to end coal power"
          />,
        },
      ]}
      closing="Coal generated 0.6% of Britain's electricity in 2024, all of it before 30 September. Gas generated 26%."
      sources={["Digest of UK Energy Statistics", "National Grid ESO"]}
      period="1990 to 2024"
      note="Annual shares are rounded. Intermediate years before 2012 are interpolated for the chart. Figures are approximate, for illustration."
    />
  );
}
