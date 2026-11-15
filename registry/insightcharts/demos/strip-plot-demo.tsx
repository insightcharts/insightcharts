import { StripPlot } from "@/components/insightcharts/atoms/strip-plot";

const data = [
  { day: "Mon", minutes: 42 },
  { day: "Mon", minutes: 44 },
  { day: "Mon", minutes: 45 },
  { day: "Mon", minutes: 47 },
  { day: "Mon", minutes: 47 },
  { day: "Mon", minutes: 48 },
  { day: "Mon", minutes: 49 },
  { day: "Mon", minutes: 51 },
  { day: "Mon", minutes: 52 },
  { day: "Mon", minutes: 55 },
  { day: "Mon", minutes: 58 },
  { day: "Mon", minutes: 63 },
  { day: "Tue", minutes: 40 },
  { day: "Tue", minutes: 41 },
  { day: "Tue", minutes: 43 },
  { day: "Tue", minutes: 43 },
  { day: "Tue", minutes: 44 },
  { day: "Tue", minutes: 45 },
  { day: "Tue", minutes: 46 },
  { day: "Tue", minutes: 46 },
  { day: "Tue", minutes: 48 },
  { day: "Tue", minutes: 49 },
  { day: "Tue", minutes: 53 },
  { day: "Tue", minutes: 57 },
  { day: "Wed", minutes: 39 },
  { day: "Wed", minutes: 41 },
  { day: "Wed", minutes: 42 },
  { day: "Wed", minutes: 44 },
  { day: "Wed", minutes: 44 },
  { day: "Wed", minutes: 45 },
  { day: "Wed", minutes: 45 },
  { day: "Wed", minutes: 47 },
  { day: "Wed", minutes: 48 },
  { day: "Wed", minutes: 50 },
  { day: "Wed", minutes: 52 },
  { day: "Wed", minutes: 61 },
  { day: "Thu", minutes: 41 },
  { day: "Thu", minutes: 43 },
  { day: "Thu", minutes: 44 },
  { day: "Thu", minutes: 46 },
  { day: "Thu", minutes: 47 },
  { day: "Thu", minutes: 47 },
  { day: "Thu", minutes: 49 },
  { day: "Thu", minutes: 50 },
  { day: "Thu", minutes: 52 },
  { day: "Thu", minutes: 54 },
  { day: "Thu", minutes: 59 },
  { day: "Thu", minutes: 66 },
  { day: "Fri", minutes: 36 },
  { day: "Fri", minutes: 37 },
  { day: "Fri", minutes: 38 },
  { day: "Fri", minutes: 39 },
  { day: "Fri", minutes: 40 },
  { day: "Fri", minutes: 40 },
  { day: "Fri", minutes: 41 },
  { day: "Fri", minutes: 42 },
  { day: "Fri", minutes: 43 },
  { day: "Fri", minutes: 44 },
  { day: "Fri", minutes: 46 },
  { day: "Fri", minutes: 49 },
];

export function StripPlotDemo() {
  return (
    <StripPlot
      data={data}
      value="minutes"
      group="day"
      median
      highlight="Fri"
      format="{value} min"
      title="The median Friday commute took 40.5 minutes"
      subtitle="Door-to-door commute time, 12 weeks of trips by weekday. The heavy tick is the median."
      note="Illustrative data"
    />
  );
}
