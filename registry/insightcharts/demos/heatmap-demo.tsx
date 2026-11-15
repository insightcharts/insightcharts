import { Heatmap } from "@/components/insightcharts/atoms/heatmap";

const data = [
  { day: "Mon", slot: "6am", orders: 12 },
  { day: "Mon", slot: "9am", orders: 48 },
  { day: "Mon", slot: "12pm", orders: 61 },
  { day: "Mon", slot: "3pm", orders: 55 },
  { day: "Mon", slot: "6pm", orders: 38 },
  { day: "Mon", slot: "9pm", orders: 14 },
  { day: "Tue", slot: "6am", orders: 11 },
  { day: "Tue", slot: "9am", orders: 52 },
  { day: "Tue", slot: "12pm", orders: 66 },
  { day: "Tue", slot: "3pm", orders: 58 },
  { day: "Tue", slot: "6pm", orders: 41 },
  { day: "Tue", slot: "9pm", orders: 15 },
  { day: "Wed", slot: "6am", orders: 13 },
  { day: "Wed", slot: "9am", orders: 55 },
  { day: "Wed", slot: "12pm", orders: 70 },
  { day: "Wed", slot: "3pm", orders: 63 },
  { day: "Wed", slot: "6pm", orders: 44 },
  { day: "Wed", slot: "9pm", orders: 17 },
  { day: "Thu", slot: "6am", orders: 12 },
  { day: "Thu", slot: "9am", orders: 51 },
  { day: "Thu", slot: "12pm", orders: 68 },
  { day: "Thu", slot: "3pm", orders: 60 },
  { day: "Thu", slot: "6pm", orders: 47 },
  { day: "Thu", slot: "9pm", orders: 22 },
  { day: "Fri", slot: "6am", orders: 10 },
  { day: "Fri", slot: "9am", orders: 44 },
  { day: "Fri", slot: "12pm", orders: 59 },
  { day: "Fri", slot: "3pm", orders: 49 },
  { day: "Fri", slot: "6pm", orders: 52 },
  { day: "Fri", slot: "9pm", orders: 35 },
  { day: "Sat", slot: "6am", orders: 6 },
  { day: "Sat", slot: "9am", orders: 18 },
  { day: "Sat", slot: "12pm", orders: 31 },
  { day: "Sat", slot: "3pm", orders: 36 },
  { day: "Sat", slot: "6pm", orders: 40 },
  { day: "Sat", slot: "9pm", orders: 38 },
  { day: "Sun", slot: "6am", orders: 5 },
  { day: "Sun", slot: "9am", orders: 14 },
  { day: "Sun", slot: "12pm", orders: 26 },
  { day: "Sun", slot: "3pm", orders: 30 },
  { day: "Sun", slot: "6pm", orders: 28 },
  { day: "Sun", slot: "9pm", orders: 19 },
];

export function HeatmapDemo() {
  return (
    <Heatmap
      data={data}
      x="slot"
      y="day"
      value="orders"
      title="Orders peak at 70 per hour at 12pm on Wednesdays"
      subtitle="Average orders per hour by weekday and time of day"
      note="Illustrative data"
    />
  );
}
