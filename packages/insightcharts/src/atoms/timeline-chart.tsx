import { CustomChart } from "echarts/charts";
import { alpha, inkOn } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { formatDate } from "../core/format";
import { measureText } from "../core/layout";
import { hiddenAxis, morph, timeAxis, tooltipHtml } from "../core/parts";

export interface TimelineChartProps {
  /** Label field: what the event or span is. */
  name: string;
  /** Start field: an ISO date (`2021-03-01`, `2021-03`), a year (`1969`) or a timestamp. */
  start: string;
  /** End field. Rows without an end are drawn as point milestones. */
  end?: string;
  /** Field that groups rows into labelled lanes (a person, a team, a phase). */
  lane?: string;
  /** Date precision for tooltips. Default: chosen from the span of the data. */
  precision?: "year" | "month" | "day";
}

/** Parse the common date shapes: bare years, ISO strings, Dates and timestamps. */
function toTime(v: unknown): number {
  if (v == null || v === "") return NaN;
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return Math.abs(v) < 10000 ? Date.UTC(v, 0, 1) : v;
  const s = String(v).trim();
  if (/^-?\d{1,4}$/.test(s)) return Date.UTC(Number(s), 0, 1);
  if (/^\d{4}-\d{2}$/.test(s)) return Date.parse(`${s}-01T00:00:00Z`);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Date.parse(`${s}T00:00:00Z`);
  return Date.parse(s);
}

const DAY = 86400000;

type _Item = { name: string; lane: string; start: number; end: number | null; row: number; side: "inside" | "right" | "left"; x0: number; x1: number; room: number };

function _readItems(rows: Record<string, unknown>[], p: TimelineChartProps): _Item[] {
  const items: _Item[] = [];
  for (const r of rows) {
    const start = toTime(r[p.start]);
    if (Number.isNaN(start)) continue;
    const rawEnd = p.end ? toTime(r[p.end]) : NaN;
    const end = Number.isNaN(rawEnd) || rawEnd <= start ? null : rawEnd;
    items.push({ name: String(r[p.name] ?? ""), lane: p.lane ? String(r[p.lane] ?? "") : "", start, end, row: 0, side: "right", x0: 0, x1: 0, room: 0 });
  }
  return items;
}

/**
 * Place every label (inside its bar, or beside it on the side with room) and stack overlapping
 * items onto rows, lane by lane. Shared by the option builder and the natural-height estimate so
 * the two agree. Returns the lanes and the number of rows each needs.
 */
function _pack(items: _Item[], width: number, compact: boolean, hasLanes: boolean, fontFamily: string) {
  const lanes: string[] = [];
  for (const it of items) if (!lanes.includes(it.lane)) lanes.push(it.lane);
  const lo = Math.min(...items.map((i) => i.start));
  const hi = Math.max(...items.map((i) => i.end ?? i.start));
  const range = Math.max(hi - lo, DAY);
  const min = lo - range * 0.02;
  const max = hi + range * 0.02;
  const sideLabels = hasLanes && !compact;
  const laneW = sideLabels ? Math.min(width * 0.24, Math.max(...lanes.map((l) => measureText(l, 12, fontFamily, 600))) + 20) : 0;
  const left = sideLabels ? laneW : 18;
  const right = 14;
  const plotW = Math.max(60, width - left - right);
  const px = (v: number) => ((v - min) / (max - min)) * plotW;
  const gap = 10;
  for (const it of items) {
    const a = px(it.start);
    const b = it.end == null ? a : px(it.end);
    const w = measureText(it.name, 12, fontFamily, 600) + 10;
    if (it.end != null && b - a >= w + 8) {
      it.side = "inside";
      it.x0 = a;
      it.x1 = b;
    } else {
      const edge = it.end == null ? 7 : 0;
      // Prefer the label on the right; flip it when it would run off the plot, and trim it when neither side has room.
      const roomRight = plotW + right - 2 - (b + edge + 4);
      const roomLeft = a - edge - 4 + left - 2;
      it.side = w <= roomRight || roomRight >= roomLeft ? "right" : "left";
      it.room = Math.max(24, it.side === "right" ? roomRight : roomLeft);
      const used = Math.min(w, it.room);
      it.x0 = it.side === "left" ? a - edge - used - 4 : a - edge;
      it.x1 = it.side === "right" ? b + edge + used + 4 : b + edge;
    }
  }
  // Greedy interval packing per lane: earliest first, each item on the first row where it fits.
  const laneRows = lanes.map((lane) => {
    const ends: number[] = [];
    for (const it of items.filter((i) => i.lane === lane).sort((a, b) => a.start - b.start)) {
      let row = ends.findIndex((e) => e + gap <= it.x0);
      if (row === -1) row = ends.push(0) - 1;
      ends[row] = it.x1;
      it.row = row;
    }
    return Math.max(1, ends.length);
  });
  const headRows = hasLanes && !sideLabels ? 0.8 : 0;
  const laneStart: number[] = [];
  let total = 0;
  laneRows.forEach((n, i) => {
    laneStart[i] = total + headRows;
    total += headRows + n + (i < lanes.length - 1 ? 0.5 : 0);
  });
  return { lanes, lo, hi, range, min, max, sideLabels, laneW, left, right, laneRows, headRows, laneStart, total: Math.max(total, 1) };
}

/**
 * Events on a time axis: spans as bars, moments as dots, each named where it sits.
 * Overlapping items in a lane are stacked on separate rows so nothing hides anything else.
 */
export const TimelineChart = defineChart<TimelineChartProps>({
  name: "timeline-chart",
  title: "Timeline chart",
  category: "trend",
  description: "Places events and spans on a time axis in labelled lanes, with each item named directly.",
  whenToUse: "When things happened and how long they lasted: project phases, terms of office, product launches, the sequence of events in a story. Mix spans (start and end) with point milestones (start only).",
  avoid: "A measured value changing over time (use line-chart, with annotations for the events); more than about 40 items (filter, or split into several timelines); durations to be compared precisely with no interest in when (use bar-chart).",
  use: [CustomChart],
  // Rows are known only once labels are packed at the real width, so estimate at a desktop and a
  // phone width and size for something between: a three-row timeline is short, a thirty-row plan grows.
  height: (p, rows) => {
    const count = (width: number) => {
      const items = _readItems(rows, p);
      return items.length ? _pack(items, width, width < 480, !!p.lane, "sans-serif").total : 1;
    };
    return Math.round(Math.max(120, Math.min(900, Math.max(count(680), count(340) * 0.7) * 34 + 34)));
  },
  selectField: (p) => p.lane ?? p.name,
  selectValue: (params, p) => (p.lane ? params.data?.lane : params.name),
  props: [
    { name: "name", type: "string", required: true, description: "Label field: what the event or span is." },
    { name: "start", type: "string", required: true, description: "Start field: ISO date, year or timestamp." },
    { name: "end", type: "string", description: "End field. Rows without an end are point milestones." },
    { name: "lane", type: "string", description: "Field that groups rows into labelled lanes." },
    { name: "precision", type: '"year" | "month" | "day"', description: "Date precision in tooltips. Default: chosen from the span of the data." },
  ],
  example: {
    type: "timeline-chart",
    data: [
      { mission: "Mercury", programme: "Crewed programmes", from: "1958-10", to: "1963-05" },
      { mission: "Gemini", programme: "Crewed programmes", from: "1961-12", to: "1966-11" },
      { mission: "Apollo", programme: "Crewed programmes", from: "1961-05", to: "1972-12" },
      { mission: "Skylab", programme: "Crewed programmes", from: "1973-05", to: "1974-02" },
      { mission: "Shuttle development", programme: "Crewed programmes", from: "1972-01", to: "1981-04" },
      { mission: "Glenn orbits Earth", programme: "Milestones", from: "1962-02-20" },
      { mission: "Apollo 1 fire", programme: "Milestones", from: "1967-01-27" },
      { mission: "First Moon landing", programme: "Milestones", from: "1969-07-20" },
      { mission: "Apollo-Soyuz", programme: "Milestones", from: "1975-07-15" },
      { mission: "First Shuttle flight", programme: "Milestones", from: "1981-04-12" },
    ],
    name: "mission",
    start: "from",
    end: "to",
    lane: "programme",
    highlight: ["Apollo", "First Moon landing"],
    title: "The Apollo programme ran from May 1961 to December 1972",
    subtitle: "NASA human spaceflight programmes and milestones, 1958 to 1981",
    source: "NASA History Office",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    type Item = _Item;
    const items = _readItems(ctx.rows, p);
    const hasLanes = !!p.lane;
    // Layout is worked out in pixels so labels can be placed and overlapping items stacked before drawing.
    const { lanes, lo, hi, range, min, max, sideLabels, laneW, left, right, laneRows, headRows, laneStart, total } = _pack(items, ctx.width, ctx.compact, hasLanes, t.fontFamily);
    const precision = p.precision ?? (range > 12 * 365 * DAY ? "year" : range > 120 * DAY ? "month" : "day");
    const dateOpts: Intl.DateTimeFormatOptions = { timeZone: "UTC", year: "numeric", ...(precision !== "year" ? { month: "short" } : null), ...(precision === "day" ? { day: "numeric" } : null) };
    const date = (v: number) => formatDate(v, ctx.locale, dateOpts);

    const colorOf = (it: Item) => {
      const li = lanes.indexOf(it.lane);
      // An item is emphasised when either it or its lane is highlighted.
      const base = !ctx.dimmed(it.name) ? (ctx.dimmed(it.lane) && ctx.dimmed("\u0000") ? ctx.color(it.name) : ctx.color(hasLanes ? it.lane : undefined, hasLanes ? li : undefined)) : ctx.color(hasLanes ? it.lane : it.name, hasLanes ? li : undefined);
      return ctx.selected(hasLanes ? it.lane : it.name) ? base : alpha(base, 0.25);
    };

    const renderItem = (params: any, api: any) => {
      const it = items[params.dataIndex];
      if (!it) return null;
      const li = lanes.indexOf(it.lane);
      const rowH = api.size([0, 1])[1];
      const barH = Math.max(8, Math.min(18, rowH * 0.62));
      const cy = api.coord([it.start, total - (laneStart[li] + it.row + 0.5)])[1];
      const x0 = api.coord([it.start, 0])[0];
      const x1 = it.end == null ? x0 : api.coord([it.end, 0])[0];
      const fill = colorOf(it);
      const faded = ctx.dimmed(it.name) && ctx.dimmed(it.lane);
      const children: any[] = [];
      const label = { text: it.name, fontSize: 12, fontFamily: t.fontFamily, verticalAlign: "middle", fontWeight: faded ? 400 : 600, ...(it.side !== "inside" && it.room ? { width: it.room, overflow: "truncate" } : null) };
      if (it.end == null) {
        // A milestone: an 8px marker ringed in the surface colour.
        children.push({ type: "circle", shape: { cx: x0, cy, r: 5.5 }, style: { fill, stroke: t.surface, lineWidth: 2 } });
        children.push({ type: "text", silent: true, style: { ...label, x: it.side === "right" ? x0 + 10 : x0 - 10, y: cy + 1, align: it.side === "right" ? "left" : "right", fill: faded ? t.inkSecondary : t.ink } });
      } else {
        children.push({ type: "rect", shape: { x: x0, y: cy - barH / 2, width: Math.max(2, x1 - x0), height: barH, r: Math.min(t.radius, barH / 2) }, style: { fill } });
        if (it.side === "inside") children.push({ type: "text", silent: true, style: { ...label, x: x0 + 7, y: cy + 1, fill: inkOn(fill), width: x1 - x0 - 10, overflow: "truncate" } });
        else children.push({ type: "text", silent: true, style: { ...label, x: it.side === "right" ? x1 + 6 : x0 - 6, y: cy + 1, align: it.side === "right" ? "left" : "right", fill: faded ? t.inkSecondary : t.ink } });
      }
      return { type: "group", children };
    };

    // Lane names and the hairlines between lanes.
    const renderLane = (params: any, api: any) => {
      const i = params.dataIndex;
      const cs = params.coordSys;
      const yTop = api.coord([min, total - (laneStart[i] - headRows)])[1];
      const yMid = api.coord([min, total - (laneStart[i] + laneRows[i] / 2)])[1];
      const children: any[] = [];
      if (i > 0) {
        const y = api.coord([min, total - (laneStart[i] - headRows - 0.25)])[1];
        children.push({ type: "line", shape: { x1: sideLabels ? 0 : cs.x, y1: y, x2: cs.x + cs.width, y2: y }, style: { stroke: t.grid, lineWidth: 1 } });
      }
      if (sideLabels) children.push({ type: "text", style: { x: 0, y: yMid, text: lanes[i], verticalAlign: "middle", fill: t.inkSecondary, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, width: laneW - 12, overflow: "break", lineHeight: 15 } });
      else children.push({ type: "text", style: { x: cs.x, y: yTop + api.size([0, headRows])[1] / 2, text: lanes[i], verticalAlign: "middle", fill: t.muted, fontSize: 11.5, fontWeight: 600, fontFamily: t.fontFamily, width: cs.width, overflow: "truncate" } });
      return { type: "group", silent: true, children };
    };

    const legend: LegendItem[] = [];
    const spans = items.filter((i) => i.end != null);
    const longest = spans.reduce<Item | undefined>((a, i) => (!a || i.end! - i.start > a.end! - a.start ? i : a), undefined);
    const firstItem = [...items].sort((a, b) => a.start - b.start)[0];

    return {
      legend,
      alt: `Timeline of ${items.length} items${hasLanes ? ` in ${lanes.length} lanes (${lanes.join(", ")})` : ""}, from ${date(lo)} to ${date(hi)}. ${firstItem ? `It opens with ${firstItem.name}. ` : ""}${longest ? `The longest span is ${longest.name}, ${date(longest.start)} to ${date(longest.end!)}.` : ""}`,
      option: {
        // A labelled date line prints its label above the plot, so leave it a line of room.
        grid: { left, right, top: p.annotations?.some((n) => n.type === "line" && n.axis === "x" && n.label) ? 22 : 4, bottom: 26, outerBoundsMode: "none" as any },
                xAxis: timeAxis(ctx, { min, max, position: "bottom", axisLine: { show: true, onZero: false }, splitLine: { show: true, showMinLine: false, showMaxLine: false, lineStyle: { color: t.grid, width: 1 } }, axisLabel: { hideOverlap: true, alignMinLabel: "left", alignMaxLabel: "right" }, splitNumber: ctx.compact ? 5 : 7 }),
        // Rows count down from the top by flipping the row value, not the axis: an inverted axis would put annotation labels (anchored at the axis end) under the dates.
        yAxis: hiddenAxis("value", { min: 0, max: total }),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            if (!it || d.seriesId !== "timeline") return "";
            const rows = it.end == null ? [{ name: "Date", value: date(it.start), color: colorOf(it) }] : [{ name: "From", value: date(it.start), color: colorOf(it) }, { name: "To", value: date(it.end) }];
            return tooltipHtml(ctx, hasLanes ? `${it.name} · ${it.lane}` : it.name, rows);
          },
        },
        series: [
          ...(hasLanes ? [{ id: "lanes", type: "custom" as const, silent: true, tooltip: { show: false }, renderItem: renderLane as any, data: lanes.map((_, i) => [min, i]), z: 1 }] : []),
          {
            id: "timeline",
            type: "custom" as const,
            ...morph,
            z: 2,
            dimensions: ["start", "end", "row"],
            encode: { x: [0, 1], tooltip: [0, 1] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: items.map((it) => ({ name: it.name, lane: it.lane, value: [it.start, it.end ?? it.start, it.row] })),
          },
        ],
      },
    };
  },
});

export const examples = {
  "Single lane, milestones only": {
    data: [
      { event: "WHO told of pneumonia cluster", date: "2019-12-31" },
      { event: "Virus genome published", date: "2020-01-11" },
      { event: "Pandemic declared", date: "2020-03-11" },
      { event: "First vaccine trial results", date: "2020-11-09" },
      { event: "First approved dose given", date: "2020-12-08" },
    ],
    name: "event",
    start: "date",
    height: 200,
    highlight: "First approved dose given",
    title: "The first approved Covid-19 vaccine dose was given on 8 December 2020",
    subtitle: "Key dates in the first year of Covid-19, December 2019 to December 2020",
    source: "WHO, MHRA",
    note: "Figures are approximate, for illustration",
  },
  "Project plan with lanes": {
    data: [
      { task: "Discovery", team: "Design", start: "2025-01-06", end: "2025-02-14" },
      { task: "Prototype", team: "Design", start: "2025-02-10", end: "2025-04-04" },
      { task: "Design system", team: "Design", start: "2025-03-17", end: "2025-06-27" },
      { task: "API", team: "Engineering", start: "2025-02-24", end: "2025-05-30" },
      { task: "Web app", team: "Engineering", start: "2025-04-07", end: "2025-08-15" },
      { task: "Beta", team: "Engineering", start: "2025-07-01" },
      { task: "Hardening", team: "Engineering", start: "2025-08-04", end: "2025-09-19" },
      { task: "Pricing research", team: "Go to market", start: "2025-03-03", end: "2025-04-25" },
      { task: "Launch campaign", team: "Go to market", start: "2025-07-14", end: "2025-10-10" },
      { task: "Public launch", team: "Go to market", start: "2025-09-23" },
    ],
    name: "task",
    start: "start",
    end: "end",
    lane: "team",
    title: "Public launch is planned for 23 September 2025",
    subtitle: "Product roadmap by team, 2025",
    note: "Illustrative plan",
  },
  "Stress: long names, crowded lanes, centuries": {
    data: [
      { who: "Elizabeth I", house: "Tudor", from: 1558, to: 1603 },
      { who: "James VI and I", house: "Stuart", from: 1603, to: 1625 },
      { who: "Charles I", house: "Stuart", from: 1625, to: 1649 },
      { who: "Commonwealth and Protectorate", house: "Interregnum", from: 1649, to: 1660 },
      { who: "Charles II", house: "Stuart", from: 1660, to: 1685 },
      { who: "James II", house: "Stuart", from: 1685, to: 1688 },
      { who: "William III and Mary II", house: "Stuart", from: 1689, to: 1702 },
      { who: "Anne", house: "Stuart", from: 1702, to: 1714 },
      { who: "George I", house: "Hanover", from: 1714, to: 1727 },
      { who: "George II", house: "Hanover", from: 1727, to: 1760 },
      { who: "George III", house: "Hanover", from: 1760, to: 1820 },
      { who: "George IV", house: "Hanover", from: 1820, to: 1830 },
      { who: "William IV", house: "Hanover", from: 1830, to: 1837 },
      { who: "Victoria", house: "Hanover", from: 1837, to: 1901 },
      { who: "Spanish Armada defeated", house: "Events", from: 1588 },
      { who: "Gunpowder Plot", house: "Events", from: 1605 },
      { who: "Great Fire of London", house: "Events", from: 1666 },
      { who: "Acts of Union", house: "Events", from: 1707 },
      { who: "American independence declared", house: "Events", from: 1776 },
      { who: "Battle of Waterloo", house: "Events", from: 1815 },
      { who: "Great Reform Act", house: "Events", from: 1832 },
    ],
    name: "who",
    start: "from",
    end: "to",
    lane: "house",
    height: 420,
    title: "Victoria reigned from 1837 to 1901",
    subtitle: "English and British monarchs by royal house, 1558 to 1901",
    source: "Royal Household",
    note: "Figures are approximate, for illustration",
  },
};
