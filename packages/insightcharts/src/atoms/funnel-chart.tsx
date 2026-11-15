import { CustomChart } from "echarts/charts";
import { alpha, luminance } from "../core/color";
import { defineChart } from "../core/define";
import { measureText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface FunnelChartProps {
  /** Stage field. Rows are read in data order: the first row is the top of the funnel. */
  stage: string;
  /** Count field. */
  value: string;
  /** State the drop-off between consecutive stages. Default true. */
  dropoff?: boolean;
  /** Word for what is lost between stages, used in the drop-off line: "dropped off", "rejected", "lost". */
  dropoffLabel?: string;
}

/**
 * A sequential funnel drawn honestly: one centred bar per stage whose length is
 * proportional to its count, joined by a light wash that shows the narrowing. Each stage
 * prints its count, its share of the first stage and its conversion from the stage before,
 * and the loss between stages is written out.
 */
export const FunnelChart = defineChart<FunnelChartProps>({
  name: "funnel-chart",
  title: "Funnel chart",
  category: "flow",
  description: "Shows how many remain at each step of a sequence, with conversion and drop-off between steps.",
  whenToUse: "A strict sequence where each stage is a subset of the one before: sign-up flows, hiring pipelines, sales stages, applications to admissions. 3 to 7 stages.",
  avoid: "Stages that are not sequential subsets, or categories with no order (use bar-chart); flows that split to several destinations (use sankey-chart); conversion tracked over time (use line-chart).",
  use: [CustomChart],
  defaults: { dropoff: true, dropoffLabel: "dropped off" },
  // One band per stage: five stages give the familiar 320px, three do not float in it, eight are not squeezed.
  height: (_p, rows) => Math.max(140, (rows.length - 1) * 62 + 72),
  selectField: (p) => p.stage,
  props: [
    { name: "stage", type: "string", required: true, description: "Stage field. Rows are read in data order; the first row is the top of the funnel." },
    { name: "value", type: "string", required: true, description: "Count field." },
    { name: "dropoff", type: "boolean", default: "true", description: "State the drop-off between consecutive stages." },
    { name: "dropoffLabel", type: "string", default: '"dropped off"', description: "Word for what is lost between stages." },
  ],
  example: {
    type: "funnel-chart",
    data: [
      { step: "Visited the pricing page", users: 48200 },
      { step: "Started a free trial", users: 9640 },
      { step: "Connected a data source", users: 5310 },
      { step: "Invited a teammate", users: 2230 },
      { step: "Became a paying customer", users: 1480 },
    ],
    stage: "step",
    value: "users",
    format: "integer",
    title: "20% of pricing-page visitors started a free trial",
    subtitle: "Users reaching each step of the sign-up funnel, last 90 days",
    source: "Product analytics",
    note: "Illustrative data",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    // Judged by the surface, not the page mode: a poster theme paints a dark ground on a light page.
    const onDark = /^(#|rgb)/.test(t.surface) ? luminance(t.surface) < 0.2 : ctx.mode === "dark";
    const stages = ctx.rows.map((r) => ({ key: String(r[p.stage] ?? ""), value: Math.max(0, toNumber(r[p.value]) || 0) }));
    const n = stages.length;
    const first = stages[0]?.value ?? 0;
    const max = Math.max(1, ...stages.map((s) => s.value));
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 1 });
    const whole = ctx.formatter({ style: "percent", maximumFractionDigits: 0 });
    const ofFirst = stages.map((s) => (first ? s.value / first : 0));
    const step = stages.map((s, i) => (i === 0 ? null : stages[i - 1].value ? s.value / stages[i - 1].value : null));
    const counts = stages.map((s) => ctx.fmt(s.value));
    const lossWord = p.dropoffLabel ?? "dropped off";
    const showLoss = p.dropoff !== false;

    // Geometry. Wide: stage names left, centred bars, a small table of figures right.
    // Compact: the name and figures sit on a line above each bar.
    const stacked = ctx.compact;
    const head = stacked ? 0 : 22;
    const nameW = stacked ? 0 : Math.min(ctx.width * 0.34, Math.max(...stages.map((s) => measureText(s.key, 13, t.fontFamily, 600)), 40) + 20);
    const countW = Math.max(...counts.map((c) => measureText(c, 13, t.fontFamily, 700)), 36) + 12;
    const colW = 86;
    const tableW = stacked ? 0 : countW + colW * 2 + 16;
    const barX = nameW;
    const barW = Math.max(40, ctx.width - nameW - tableW);
    const titleH = stacked ? 20 : 0;
    const pitch = Math.max(stacked ? 52 : 40, Math.min(stacked ? 78 : 72, (ctx.height - head - titleH - 28) / Math.max(1, n - 1)));
    const barH = Math.max(12, Math.min(stacked ? 20 : 28, pitch - titleH - (showLoss ? 22 : 8)));
    const top = (i: number) => head + i * pitch + titleH;
    const span = (i: number) => {
      const w = Math.max(2, (stages[i].value / max) * barW);
      return { x: barX + (barW - w) / 2, w };
    };
    const colorOf = (key: string) => {
      const base = ctx.color(key);
      return ctx.selected(key) ? base : alpha(base, 0.25);
    };
    const text = (x: number, y: number, value: string, style: object = {}) => ({ type: "text", silent: true, style: { x, y, text: value, fill: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily, verticalAlign: "middle", ...style } });

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const s = stages[i];
      if (!s) return null;
      const b = span(i);
      const y = top(i);
      const fill = colorOf(s.key);
      const mid = y + barH / 2 + 1;
      const children: any[] = [];
      if (i < n - 1) {
        // The wash between bars is the funnel's silhouette. It carries no value of its own.
        const nb = span(i + 1);
        const ny = top(i + 1);
        children.push({ type: "polygon", silent: true, shape: { points: [[b.x, y + barH], [b.x + b.w, y + barH], [nb.x + nb.w, ny], [nb.x, ny]] }, style: { fill: alpha(ctx.color(), onDark ? 0.16 : 0.1) } });
        if (showLoss) {
          const lost = s.value - stages[i + 1].value;
          const rate = s.value ? lost / s.value : 0;
          const line = lost >= 0 ? `↓ ${ctx.fmt(lost)} ${lossWord} (${whole(rate)})` : `↑ ${ctx.fmt(-lost)} more than the stage before`;
          children.push(text(barX + barW / 2, (y + barH + ny - (stacked ? titleH : 0)) / 2 + 1, line, { align: "center", fill: t.inkSecondary, fontSize: 11.5, width: barW, overflow: "truncate" }));
        }
      }
      children.push({ type: "rect", shape: { x: b.x, y, width: b.w, height: barH, r: Math.min(t.radius, b.w / 2) }, style: { fill, opacity: 1, enterFrom: { opacity: 0 } }, enterAnimation: { duration: 350, delay: i * 110 } });
      const dim = ctx.dimmed(s.key);
      if (stacked) {
        const figures = i === 0 ? counts[i] : `${counts[i]}  ·  ${pct(ofFirst[i])} of first`;
        const fw = measureText(figures, 12, t.fontFamily) + 8;
        children.push(text(0, y - 10, s.key, { fill: t.ink, fontSize: 13, fontWeight: 600, width: Math.max(60, ctx.width - fw - 8), overflow: "truncate" }));
        children.push(text(ctx.width, y - 10, figures, { align: "right", fill: t.inkSecondary }));
      } else {
        children.push(text(nameW - 16, mid, s.key, { align: "right", fill: dim ? t.inkSecondary : t.ink, fontSize: 13, fontWeight: 600, width: nameW - 16, overflow: "truncate" }));
        const x0 = barX + barW + 16;
        children.push(text(x0 + countW - 12, mid, counts[i], { align: "right", fill: t.ink, fontSize: 13, fontWeight: 700 }));
        children.push(text(x0 + countW + colW - 8, mid, pct(ofFirst[i]), { align: "right" }));
        children.push(text(x0 + countW + colW * 2 - 8, mid, step[i] == null ? "–" : pct(step[i]!), { align: "right", fill: step[i] == null ? t.muted : t.inkSecondary }));
      }
      return { type: "group", children };
    };

    // Column headings for the figures: decoration, so it lives in `graphic`.
    const hx = barX + barW + 16;
    const heading = (x: number, label: string) => ({ type: "text", silent: true, style: { x, y: 6, text: label, align: "right", fill: t.muted, fontSize: 11, fontFamily: t.fontFamily } });
    const graphic = stacked ? undefined : [heading(hx + countW - 12, "Count"), heading(hx + countW + colW - 8, "% of first"), heading(hx + countW + colW * 2 - 8, "% of previous")];

    const worst = step.reduce<number>((a, v, i) => (v != null && (a === -1 || v < step[a]!) ? i : a), -1);
    return {
      alt: `Funnel chart of ${p.value} across ${n} stages, from ${stages[0]?.key} (${counts[0]}) to ${stages[n - 1]?.key} (${counts[n - 1]}), ${pct(ofFirst[n - 1] ?? 0)} of the first stage.${worst > 0 ? ` The largest drop is into ${stages[worst].key}, where ${whole(1 - step[worst]!)} are lost.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        graphic,
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const i = d.dataIndex;
            const s = stages[i];
            if (!s) return "";
            const rows: { name: string; value: string; color?: string }[] = [{ name: p.value, value: counts[i], color: colorOf(s.key) }];
            if (i > 0) rows.push({ name: `Share of ${stages[0].key}`, value: pct(ofFirst[i]) });
            if (step[i] != null) rows.push({ name: `Converted from ${stages[i - 1].key}`, value: pct(step[i]!) }, { name: lossWord.charAt(0).toUpperCase() + lossWord.slice(1), value: ctx.fmt(stages[i - 1].value - s.value) });
            return tooltipHtml(ctx, s.key, rows);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "funnel",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            dimensions: ["value", "ofFirst", "ofPrevious"],
            encode: { tooltip: [0, 1, 2] },
            renderItem: renderItem as any,
            data: stages.map((s, i) => ({ name: s.key, value: [s.value, ofFirst[i], step[i] ?? 1] })),
          },
        ],
      },
    };
  },
});

export const examples = {
  "Three stages, highlight": {
    theme: "blueprint",
    data: [
      { stage: "Applied", people: 12400 },
      { stage: "Interviewed", people: 1860 },
      { stage: "Offered a place", people: 930 },
    ],
    stage: "stage",
    value: "people",
    highlight: "Offered a place",
    dropoffLabel: "rejected",
    height: 220,
    title: "930 of 12,400 applicants were offered a place",
    subtitle: "Applications to the graduate scheme, 2024 intake",
    source: "HR recruitment data",
    note: "Illustrative data",
  },
  "Four stages, custom drop-off word": {
    theme: "editorial",
    data: [
      { stage: "Started an application", loans: 8400 },
      { stage: "Submitted documents", loans: 5880 },
      { stage: "Approved", loans: 3360 },
      { stage: "Drew down the loan", loans: 2940 },
    ],
    stage: "stage",
    value: "loans",
    format: "integer",
    dropoffLabel: "lost",
    height: 300,
    title: "2,940 of 8,400 loan applications ended in a loan",
    subtitle: "Small-business loan applications at each stage, 2024",
    note: "Illustrative data",
  },
  "Stress: seven stages, long names, big numbers": {
    theme: "earth",
    data: [
      { stage: "Impressions served across all paid channels", n: 18400000 },
      { stage: "Clicked through to the landing page", n: 2210000 },
      { stage: "Viewed at least one product", n: 1480000 },
      { stage: "Added an item to the basket", n: 412000 },
      { stage: "Reached checkout", n: 236000 },
      { stage: "Entered payment details", n: 171000 },
      { stage: "Completed purchase", n: 148000 },
    ],
    stage: "stage",
    value: "n",
    format: "compact",
    height: 420,
    title: "12% of ad impressions led to a click",
    subtitle: "Campaign funnel from ad impression to purchase, fourth quarter",
    source: "Marketing analytics",
    note: "Illustrative data",
  },
};
