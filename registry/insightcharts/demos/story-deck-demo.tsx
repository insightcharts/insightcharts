import { StoryDeck } from "@/components/insightcharts/templates/story-deck";
import { BarChart } from "@/components/insightcharts/atoms/bar-chart";
import { LineChart } from "@/components/insightcharts/atoms/line-chart";
import { RadialBarChart } from "@/components/insightcharts/atoms/radial-bar-chart";

export function StoryDeckDemo() {
  return (
    <StoryDeck
      aspect="4:5"
      cards={[
        {
          kind: "title",
          tone: "inverse",
          kicker: "Your 2024 on the road",
          title: "You ran 1,842 km in 2024",
          deck: "That was 23% more than in 2023. You ran 187 times.",
          byline: "Riverside Runners · member report",
        },
        {
          kind: "stat",
          kicker: "Distance",
          value: 1842,
          format: "integer",
          label: "Kilometres run in 2024",
          delta: 0.23,
          deltaLabel: "vs 2023",
          context: "An average of 154 km a month",
          text: "You ran in 46 of the year's 52 weeks.",
        },
        {
          kind: "chart",
          kicker: "Month by month",
          title: "October was your highest month at 224 km",
          chart: <BarChart
            data={[
              { month: "Jan", km: 96 },
              { month: "Feb", km: 104 },
              { month: "Mar", km: 131 },
              { month: "Apr", km: 148 },
              { month: "May", km: 162 },
              { month: "Jun", km: 171 },
              { month: "Jul", km: 120 },
              { month: "Aug", km: 158 },
              { month: "Sep", km: 196 },
              { month: "Oct", km: 224 },
              { month: "Nov", km: 181 },
              { month: "Dec", km: 151 },
            ]}
            x="month"
            y="km"
            orientation="vertical"
            sort="none"
            highlight="Oct"
            labels={false}
            format="{value} km"
            height={240}
          />,
          text: "You ran 120 km in July while you were injured. You ran 158 km in August.",
        },
        {
          kind: "chart",
          kicker: "Pace",
          title: "Your easy pace fell from 5.52 to 5.04 minutes per kilometre",
          chart: <LineChart
            data={[
              { month: "Jan", pace: 5.52 },
              { month: "Feb", pace: 5.47 },
              { month: "Mar", pace: 5.41 },
              { month: "Apr", pace: 5.36 },
              { month: "May", pace: 5.33 },
              { month: "Jun", pace: 5.28 },
              { month: "Jul", pace: 5.31 },
              { month: "Aug", pace: 5.24 },
              { month: "Sep", pace: 5.16 },
              { month: "Oct", pace: 5.09 },
              { month: "Nov", pace: 5.07 },
              { month: "Dec", pace: 5.04 },
            ]}
            x="month"
            y="pace"
            format="{value} min/km"
            height={240}
          />,
          text: "A lower number is a faster pace. Your pace in August was 5.24.",
        },
        {
          kind: "chart",
          kicker: "Habits",
          tone: "accent",
          title: "41 of your 187 runs started between 6am and 7am",
          chart: <RadialBarChart
            data={[
              { hour: "00", runs: 0 },
              { hour: "01", runs: 0 },
              { hour: "02", runs: 0 },
              { hour: "03", runs: 0 },
              { hour: "04", runs: 0 },
              { hour: "05", runs: 9 },
              { hour: "06", runs: 41 },
              { hour: "07", runs: 38 },
              { hour: "08", runs: 12 },
              { hour: "09", runs: 4 },
              { hour: "10", runs: 2 },
              { hour: "11", runs: 3 },
              { hour: "12", runs: 8 },
              { hour: "13", runs: 6 },
              { hour: "14", runs: 2 },
              { hour: "15", runs: 1 },
              { hour: "16", runs: 3 },
              { hour: "17", runs: 11 },
              { hour: "18", runs: 22 },
              { hour: "19", runs: 17 },
              { hour: "20", runs: 6 },
              { hour: "21", runs: 2 },
              { hour: "22", runs: 0 },
              { hour: "23", runs: 0 },
            ]}
            x="hour"
            y="runs"
            labelEvery={3}
            labels={false}
            height={260}
          />,
          text: "Another 38 started between 7am and 8am. 22 started between 6pm and 7pm.",
        },
        {
          kind: "quote",
          quote: "I started running before work in the spring. I have kept to it since.",
          attribution: "Club member",
          role: "Club newsletter, December 2024",
        },
        {
          kind: "closing",
          kicker: "Next year",
          title: "2,000 km in 2025 needs 167 km a month",
          text: "You averaged 154 km a month in 2024.",
          points: ["You ran 167 km or more in 4 months of 2024.", "July was 51 km below June."],
          action: { label: "Set a 2025 goal", href: "#goal" },
        },
      ]}
      sources="Club activity tracker"
      period="1 January to 31 December 2024"
      note="Illustrative data"
    />
  );
}
