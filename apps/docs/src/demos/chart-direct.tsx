"use client";

import { RadarChart } from "echarts/charts";
import { RadarComponent } from "echarts/components";
import { alpha, Chart, echarts, Figure } from "insightcharts";

// Series types outside the core set are registered once, exactly as in plain ECharts.
echarts.use([RadarChart, RadarComponent]);

const axes = ["Speed", "Reliability", "Docs", "Price", "Support"];

export default function ChartDirect() {
  return (
    <Figure title="Current and new plan scores on five criteria" subtitle="Internal scoring, 1 to 5" note="Illustrative data">
      <Chart
        height={300}
        alt="Radar chart of two plans scored from 1 to 5 on five criteria. The new plan scores 5 on reliability, 4 on support and 2 on price. The current plan scores 3 on reliability, 2 on support and 4 on price."
        option={({ tokens }) => ({
          radar: {
            indicator: axes.map((name) => ({ name, max: 5 })),
            axisName: { color: tokens.inkSecondary },
            splitLine: { lineStyle: { color: tokens.grid } },
            axisLine: { lineStyle: { color: tokens.grid } },
            splitArea: { show: false },
          },
          series: [
            {
              type: "radar",
              symbolSize: 6,
              data: [
                { name: "Current", value: [4, 3, 4, 4, 2], lineStyle: { color: tokens.context }, itemStyle: { color: tokens.context } },
                { name: "New", value: [4, 5, 4, 2, 4], lineStyle: { color: tokens.accent }, itemStyle: { color: tokens.accent }, areaStyle: { color: alpha(tokens.accent, 0.1) } },
              ],
            },
          ],
        })}
      />
    </Figure>
  );
}
