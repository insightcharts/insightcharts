"use client";

import { BarChart } from "insightcharts";

const data = [
  { plan: "Free", accounts: 18400 },
  { plan: "Team", accounts: 6200 },
  { plan: "Business", accounts: 1900 },
  { plan: "Enterprise", accounts: 240 },
];

export default function OptionEscape() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
      {/* An object is deep-merged over the generated option: here it patches the first series and the value axis. */}
      <BarChart data={data} x="plan" y="accounts" orientation="vertical" format="compact" height={240} title="Option as an object" option={{ series: [{ barWidth: 36, itemStyle: { borderRadius: 0 } }], yAxis: { splitLine: { show: false } } }} />
      {/* A function receives the generated option and the build context, and returns the option to draw. */}
      <BarChart
        data={data}
        x="plan"
        y="accounts"
        orientation="vertical"
        format="compact"
        height={240}
        title="Option as a function"
        option={(option, ctx) => ({
          ...option,
          graphic: [{ type: "text", right: 8, top: 8, style: { text: `${ctx.rows.length} plans · ${ctx.width}px wide`, fill: ctx.tokens.muted, fontSize: 12, fontFamily: ctx.tokens.fontFamily } }],
        })}
      />
    </div>
  );
}
