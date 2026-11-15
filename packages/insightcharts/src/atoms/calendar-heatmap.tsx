import { forwardRef, useEffect, useRef, useState } from "react";
import { HeatmapChart } from "echarts/charts";
import { CalendarComponent, VisualMapComponent } from "echarts/components";
import type { ChartHandle } from "../core/chart";
import { alpha, luminance, ramp } from "../core/color";
import { defineChart, type ChartComponent, type CommonChartProps } from "../core/define";
import { formatDate } from "../core/format";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface CalendarHeatmapProps {
  /** Date field: ISO strings, Dates or epoch milliseconds. One cell per calendar day. */
  date: string;
  /** Numeric field that colours each day. Several rows on one day are summed. */
  value: string;
  /** `"auto"` lays weeks out left to right, and switches to top to bottom when the container is narrow. */
  orientation?: "auto" | "horizontal" | "vertical";
  /** First day of the week. */
  weekStart?: "monday" | "sunday";
  /** Fix the ends of the colour scale `[min, max]`. Default: 0 (or the minimum, if negative) to the maximum. */
  domain?: [number, number];
}

const MS_DAY = 86400000;
const TOP = 30; // the colour legend
const YEAR_H = 20; // a year heading, when there is more than one
const MONTH_H = 18; // month names (horizontal) or weekday initials (vertical)
const SIDE = 26; // weekday initials beside a horizontal calendar
const SIDE_V = 34; // month names beside a vertical one
const GAP = 14;

const dayKey = (v: unknown): string | null => {
  if (v == null || v === "") return null;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const d = v instanceof Date ? v : new Date(v as string | number);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

/** The geometry both the option builder and the height estimate use, so they always agree. */
function layout(width: number, height: number | null, years: number, vertical: boolean) {
  const head = TOP + (years > 1 ? YEAR_H : 0) + MONTH_H;
  if (vertical) {
    const byWidth = (width - 4 - years * SIDE_V - (years - 1) * GAP) / (7 * years);
    const byHeight = height == null ? Infinity : (height - head - 4) / 53;
    const cell = Math.max(3, Math.min(18, Math.floor(Math.min(byWidth, byHeight))));
    return { cell, head, height: head + 53 * cell + 4 };
  }
  const block = (cell: number) => (years > 1 ? YEAR_H : 0) + MONTH_H + 7 * cell;
  const byWidth = (width - SIDE - 4) / 53;
  const byHeight = height == null ? Infinity : ((height - TOP - 4 - (years - 1) * GAP) / years - (years > 1 ? YEAR_H : 0) - MONTH_H) / 7;
  const cell = Math.max(3, Math.min(20, Math.floor(Math.min(byWidth, byHeight))));
  return { cell, head, height: TOP + years * block(cell) + (years - 1) * GAP + 4 };
}

const isVertical = (orientation: CalendarHeatmapProps["orientation"], width: number) => orientation === "vertical" || (orientation !== "horizontal" && width < 480);

const Calendar = defineChart<CalendarHeatmapProps>({
  name: "calendar-heatmap",
  title: "Calendar heatmap",
  category: "trend",
  description: "Colours every day of one or more years by a value, laid out as a grid of weeks.",
  whenToUse: "Daily data over months or years where weekly rhythm, seasonality, streaks and gaps matter: activity, sales, incidents, habits.",
  avoid: "Reading the trend or exact values (use line-chart); fewer than about three months of days (use bar-chart); a non-daily grain such as hour by weekday (use heatmap).",
  use: [HeatmapChart, CalendarComponent, VisualMapComponent],
  defaults: { orientation: "auto", weekStart: "monday" },
  // No default select field: day keys only match rows whose date field is a plain ISO day.
  // `select: "<date field>"` opts in, and a click then selects the day.
  selectValue: (params) => (Array.isArray(params.value) ? params.value[0] : params.name),
  props: [
    { name: "date", type: "string", required: true, description: "Date field: ISO strings, Dates or epoch milliseconds. One cell per calendar day." },
    { name: "value", type: "string", required: true, description: "Numeric field that colours each day. Rows sharing a day are summed." },
    { name: "orientation", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "Weeks left to right, or top to bottom. `auto` goes vertical under 480px." },
    { name: "weekStart", type: '"monday" | "sunday"', default: '"monday"', description: "First day of the week." },
    { name: "domain", type: "[number, number]", description: "Fix the ends of the colour scale. Default: 0 to the maximum." },
    { name: "height", type: "number | string", description: "Common prop, but note the default: when omitted the height follows the cell size, which follows the width, so cells stay square." },
  ],
  example: {
    type: "calendar-heatmap",
    theme: "forest",
    data: commits(2024, 4),
    date: "date",
    value: "commits",
    title: "Commits per day to the main repository, 2024",
    subtitle: "Number of commits each day",
    note: "Illustrative data. Faint cells are days with no commits.",
  },
  markCount: (rows) => rows.length,
  build(p, ctx) {
    const t = ctx.tokens;
    // Judged by the surface, not the page mode: a poster theme paints a dark ground on a light page.
    const onDark = /^(#|rgb)/.test(t.surface) ? luminance(t.surface) < 0.2 : ctx.mode === "dark";
    const fmt = ctx.fmt;
    const days = new Map<string, number>();
    for (const r of ctx.rows) {
      const k = dayKey(r[p.date]);
      const v = toNumber(r[p.value]);
      if (k == null || Number.isNaN(v)) continue;
      days.set(k, (days.get(k) ?? 0) + v);
    }
    const keys = [...days.keys()].sort();
    const firstYear = keys.length ? Number(keys[0].slice(0, 4)) : new Date().getUTCFullYear();
    const lastYear = keys.length ? Number(keys[keys.length - 1].slice(0, 4)) : firstYear;
    const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);
    const Y = years.length;
    const vertical = isVertical(p.orientation, ctx.width);
    const { cell } = layout(ctx.width, ctx.height, Y, vertical);

    let lo = Infinity;
    let hi = -Infinity;
    let hiDay = "";
    let total = 0;
    for (const [k, v] of days) {
      total += v;
      if (v < lo) lo = v;
      if (v > hi) [hi, hiDay] = [v, k];
    }
    if (!days.size) [lo, hi] = [0, 1];
    let [min, max] = p.domain ?? [Math.min(0, lo), hi];
    if (min === max) max = min + 1;
    const colorAt = (v: number) => ramp(t.sequential, (v - min) / (max - min));

    const gap = cell >= 9 ? 2 : cell >= 5 ? 1 : 0.5;
    const font = `${t.fontSize}px ${t.fontFamily}`;
    const small = { color: t.muted, fontSize: Math.min(t.fontSize, 11), fontFamily: t.fontFamily };
    const initials = ["S", "M", "T", "W", "T", "F", "S"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const blockH = (Y > 1 ? YEAR_H : 0) + MONTH_H + 7 * cell;
    const colW = SIDE_V + 7 * cell;

    const calendar = years.map((year, i) => ({
      orient: vertical ? ("vertical" as const) : ("horizontal" as const),
      range: String(year),
      cellSize: cell,
      left: vertical ? i * (colW + GAP) + SIDE_V : SIDE,
      top: vertical ? TOP + (Y > 1 ? YEAR_H : 0) + MONTH_H : TOP + i * (blockH + GAP) + (Y > 1 ? YEAR_H : 0) + MONTH_H,
      // Days without data keep a pale cell, so a gap in the record is visible as a gap.
      itemStyle: { color: alpha(t.muted, onDark ? 0.2 : 0.1), borderColor: t.surface, borderWidth: gap },
      splitLine: { show: false },
      yearLabel: { show: false },
      dayLabel: { firstDay: p.weekStart === "sunday" ? 0 : 1, nameMap: cell >= 9 ? initials : initials.map((d, k) => (k % 2 ? d : "")), margin: 6, ...small },
      monthLabel: { nameMap: cell * 4.3 >= 26 ? months : months.map((m) => m[0]), margin: 6, ...small },
    }));

    const series = years.map((year, i) => ({
      id: String(year),
      name: String(year),
      type: "heatmap" as const,
      ...morph,
      coordinateSystem: "calendar" as const,
      calendarIndex: i,
      itemStyle: { borderColor: t.surface, borderWidth: gap, borderRadius: cell >= 9 ? 2 : 0 },
      emphasis: { itemStyle: { borderColor: t.ink, borderWidth: 1 } },
      // With `select: "<date field>"`, days outside the clicked ones fade.
      data: keys.filter((k) => k.startsWith(String(year))).map((k) => (ctx.selected(k) ? [k, days.get(k)!] : { value: [k, days.get(k)!], itemStyle: { opacity: 0.25 } })),
    }));

    const graphic =
      Y > 1
        ? years.map((year, i) => ({
            type: "text",
            silent: true,
            left: vertical ? i * (colW + GAP) + SIDE_V : SIDE,
            top: vertical ? TOP + 2 : TOP + i * (blockH + GAP) + 2,
            style: { text: String(year), fill: t.ink, font: `600 ${font}` },
          }))
        : [];

    const span = keys.length ? Math.round((Date.parse(keys[keys.length - 1]) - Date.parse(keys[0])) / MS_DAY) + 1 : 0;
    const byMonth = new Map<string, number>();
    for (const [k, v] of days) byMonth.set(k.slice(0, 7), (byMonth.get(k.slice(0, 7)) ?? 0) + v);
    const topMonth = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0];
    const alt = days.size
      ? `Calendar heatmap of ${p.value} per day, ${formatDate(keys[0], ctx.locale)} to ${formatDate(keys[keys.length - 1], ctx.locale)}. Total ${fmt(total)} over ${days.size} of ${span} days. Highest day: ${formatDate(hiDay, ctx.locale)} (${fmt(hi)}).${topMonth ? ` Highest month: ${formatDate(`${topMonth[0]}-01`, ctx.locale, { month: "long", year: "numeric" })} (${fmt(topMonth[1])}).` : ""}`
      : `Calendar heatmap of ${p.value}: no dated values.`;

    return {
      alt,
      option: {
        calendar,
        visualMap: {
          type: "continuous",
          min,
          max,
          calculable: false,
          hoverLink: false,
          orient: "horizontal",
          left: 0,
          top: 0,
          padding: [2, 0, 0, 4],
          itemWidth: 8,
          itemHeight: ctx.compact ? 90 : 120,
          text: [fmt(max), fmt(min)],
          textGap: 8,
          textStyle: { color: t.muted, fontSize: t.fontSize, fontFamily: t.fontFamily },
          inRange: { color: t.sequential },
        },
        graphic,
        tooltip: {
          trigger: "item",
          formatter: (d: any) => (Array.isArray(d.value) ? tooltipHtml(ctx, formatDate(d.value[0], ctx.locale, { weekday: "short", year: "numeric", month: "short", day: "numeric" }), [{ name: p.value, value: fmt(d.value[1]), color: colorAt(d.value[1]) }]) : ""),
        },
        series,
      },
    };
  },
});

// How many calendar years the rows span, when the rows are available synchronously.
function countYears(data: unknown, field: string): number {
  if (!Array.isArray(data)) return 1;
  let lo = Infinity;
  let hi = -Infinity;
  for (const r of data as Record<string, unknown>[]) {
    const k = dayKey(r?.[field]);
    if (!k) continue;
    const y = Number(k.slice(0, 4));
    if (y < lo) lo = y;
    if (y > hi) hi = y;
  }
  return hi >= lo ? hi - lo + 1 : 1;
}

/**
 * A GitHub-style grid of days. A chart built with `defineChart` has a fixed height, but a
 * calendar's natural height depends on its width (square cells, 53 weeks), so this thin
 * wrapper measures the container and passes the matching `height` unless one is given.
 */
export const CalendarHeatmap = Object.assign(
  forwardRef<ChartHandle, CalendarHeatmapProps & CommonChartProps>(function CalendarHeatmap(props, ref) {
    const el = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    useEffect(() => {
      const node = el.current;
      if (!node) return;
      const read = () => setWidth(Math.round(node.getBoundingClientRect().width));
      read();
      if (typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(read);
      ro.observe(node);
      return () => ro.disconnect();
    }, []);
    const fixed = props.height != null || props.aspect != null;
    const years = countYears(props.data, props.date);
    const auto = width > 0 ? layout(width, null, years, isVertical(props.orientation ?? "auto", width)).height : 180;
    return (
      <div ref={el} data-slot="ic-calendar" style={{ minWidth: 0 }}>
        {/* Annotations are cartesian mark lines; on a calendar coordinate system ECharts throws, so they are dropped. */}
        <Calendar ref={ref} {...props} annotations={undefined} height={fixed ? props.height : auto} />
      </div>
    );
  }),
  { meta: Calendar.meta, displayName: "CalendarHeatmap" },
) as ChartComponent<CalendarHeatmapProps>;

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

// Daily commit counts: busy weekdays, quiet weekends, a summer lull and some empty days.
function commits(year: number, seed: number) {
  const rnd = seeded(seed);
  const rows: { date: string; commits: number }[] = [];
  for (let d = Date.UTC(year, 0, 1); d < Date.UTC(year + 1, 0, 1); d += MS_DAY) {
    const date = new Date(d);
    const dow = date.getUTCDay();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const lull = month === 7 && day >= 5 && day <= 18;
    const release = day >= 24 && month % 3 === 2;
    const base = dow === 0 || dow === 6 ? 1.2 : 11 + month * 0.5;
    const n = Math.round(base * (lull ? 0.12 : 1) * (release ? 1.7 : 1) * (0.45 + rnd() * 1.1));
    if (n > 0) rows.push({ date: date.toISOString().slice(0, 10), commits: n });
  }
  return rows;
}

const steps = (() => {
  const rnd = seeded(12);
  const rows: { day: string; steps: number }[] = [];
  for (let d = Date.UTC(2022, 0, 1); d < Date.UTC(2025, 0, 1); d += MS_DAY) {
    const date = new Date(d);
    const season = 1 + 0.35 * Math.sin(((date.getUTCMonth() - 3) / 12) * 2 * Math.PI);
    const year = date.getUTCFullYear();
    // A broken tracker in spring 2023 leaves a hole in the record.
    if (year === 2023 && date.getUTCMonth() === 3) continue;
    rows.push({ day: date.toISOString().slice(0, 10), steps: Math.round((5200 + (year - 2022) * 1500) * season * (0.5 + rnd()) * (date.getUTCDay() === 6 ? 1.5 : 1)) });
  }
  return rows;
})();

export const examples = {
  "Three years, with a gap in the record": {
    data: steps,
    date: "day",
    value: "steps",
    format: "compact",
    title: "Steps per day, 2022 to 2024",
    subtitle: "Daily step count. There is no data for April 2023.",
    note: "Illustrative data",
  },
  "Sparse events, Sunday start": {
    theme: "earth",
    data: commits(2025, 40)
      .filter((_, i) => i % 5 === 0 || i % 7 === 0)
      .map((d) => ({ date: d.date, incidents: Math.ceil(d.commits / 6) })),
    date: "date",
    value: "incidents",
    weekStart: "sunday",
    title: "Incidents logged per day, 2025",
    subtitle: "Daily incident count, weeks starting on Sunday",
    note: "Illustrative data",
  },
  "Forced vertical with a fixed height": {
    theme: "magenta",
    data: commits(2024, 4),
    date: "date",
    value: "commits",
    orientation: "vertical",
    height: 520,
    style: { maxWidth: 220 },
    subtitle: "Commits per day, 2024",
  },
};
