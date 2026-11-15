import { ScatterChart as EScatter } from "echarts/charts";
import { alpha, luminance } from "../core/color";
import { defineChart } from "../core/define";
import { measureText } from "../core/layout";
import type { LegendItem } from "../core/figure";
import { hiddenAxis, labelStyle, morph, tooltipHtml, valueAxis } from "../core/parts";
import { niceStep, toNumber } from "../data/transform";

export interface BeeswarmChartProps {
  /** Numeric field that positions each dot along the axis. */
  value: string;
  /** Field that splits the dots into separate rows, one swarm per group. */
  group?: string;
  /** Field that colours dots by category. More than 6 categories fold into grey. */
  series?: string;
  /** Field naming each dot: used in tooltips, for `highlight` and for labels on highlighted dots. */
  label?: string;
  /** Dot radius in px. Default: 5 down to 3 by row count; shrinks further if a swarm would overflow its row. */
  radius?: number;
  /** Mark each row's median with a vertical tick. */
  median?: boolean;
  /** Display names for series keys. */
  names?: Record<string, string>;
}

interface Dot {
  v: number;
  name: string;
  key: string;
  group: string;
  px: number;
  /** Drawn position along the axis: `px` unless the dot slid sideways out of a tall column. */
  at: number;
  off: number;
}

/**
 * Place circles of radius `r`, pushing each one the smallest distance off the centre line
 * that avoids every circle already placed. Where many values are (nearly) equal that alone
 * would build a single tall column, so once a dot would sit more than one step off the
 * line it may also slide along the axis by up to `spread` px when that keeps the pile
 * rounder: the cost of a position is its offset plus its slide. Sorted input and no
 * randomness: the same data always produces the same swarm. `px` is the true position,
 * `at` the drawn one. Returns the largest offset used.
 */
function swarm(dots: Dot[], r: number, spread: number, maxX: number): number {
  const d = 2 * r + 0.5;
  const d2 = d * d;
  const reach = d + 2 * spread;
  let start = 0;
  let extent = 0;
  const near: Dot[] = [];
  const cand: number[] = [];
  // Smallest free offset at drawn position `x`, or Infinity past `limit`.
  const offsetAt = (x: number, limit: number): number => {
    near.length = 0;
    cand.length = 0;
    cand.push(0);
    for (let j = start; j < cursor; j++) {
      const k = dots[j];
      const dx = x - k.at;
      if (Math.abs(dx) >= d) continue;
      near.push(k);
      const dy = Math.sqrt(Math.max(0, d2 - dx * dx));
      cand.push(k.off + dy, k.off - dy);
    }
    cand.sort((a, b) => Math.abs(a) - Math.abs(b));
    for (const y of cand) {
      if (Math.abs(y) >= limit) return Infinity;
      let free = true;
      for (const k of near) {
        const dx = x - k.at;
        const dy = y - k.off;
        if (dx * dx + dy * dy < d2 - 1e-6) {
          free = false;
          break;
        }
      }
      if (free) return y;
    }
    return 0;
  };
  let cursor = 0;
  for (let i = 0; i < dots.length; i++) {
    cursor = i;
    const x = dots[i].px;
    while (start < i && dots[start].px < x - reach) start++;
    let bestX = x;
    let bestY = offsetAt(x, Infinity);
    let cost = Math.abs(bestY);
    if (spread > 0 && cost > d * 1.01) {
      for (let s = d / 2; s <= spread + 1e-6 && s < cost; s += d / 2) {
        for (const sx of [x + s, x - s]) {
          if (sx < 0 || sx > maxX) continue;
          const y = offsetAt(sx, cost - s);
          if (Math.abs(y) + s < cost - 1e-6) {
            cost = Math.abs(y) + s;
            bestX = sx;
            bestY = y;
          }
        }
      }
    }
    dots[i].at = bestX;
    dots[i].off = bestY;
    if (Math.abs(bestY) > extent) extent = Math.abs(bestY);
  }
  return extent;
}

const MAX_HUES = 6;

/**
 * One dot per row on a value axis, nudged sideways just enough not to overlap, so the
 * shape of the pile is the distribution and every dot is still a thing you can point at.
 */
export const BeeswarmChart = defineChart<BeeswarmChartProps>({
  name: "beeswarm-chart",
  title: "Beeswarm chart",
  category: "distribution",
  description: "Shows a distribution as one dot per row along a value axis, with dots stacked sideways where they would collide.",
  whenToUse: "Showing a distribution while keeping every individual visible: 30 to about 2,000 named things (countries, players, schools), optionally in a few rows by group, with one or two highlighted.",
  avoid: "More than about 2,000 rows or when only the summary matters (use histogram or box-plot); many groups with few rows each (use strip-plot); two numeric measures (use scatter-chart).",
  use: [EScatter],
  defaults: {},
  selectField: (p) => p.group ?? p.series,
  selectValue: (params, p) => (p.group ? params.value?.[2] : params.seriesId),
  props: [
    { name: "value", type: "string", required: true, description: "Numeric field that positions each dot along the axis." },
    { name: "group", type: "string", description: "Field that splits the dots into rows, one swarm per group." },
    { name: "series", type: "string", description: "Field that colours dots by category. Beyond 6 categories the rest turn grey." },
    { name: "label", type: "string", description: "Field naming each dot, for tooltips, `highlight` and labels on highlighted dots." },
    { name: "radius", type: "number", description: "Dot radius in px. Default 5 down to 3 by row count; shrinks if a swarm would overflow its row." },
    { name: "median", type: "boolean", default: "false", description: "Mark each row's median with a vertical tick." },
    { name: "names", type: "Record<string, string>", description: "Display names for series keys." },
  ],
  example: {
    type: "beeswarm-chart",
    theme: "science",
    data: [
      ["Qatar", 0.4], ["Kuwait", 0.6], ["UAE", 0.9], ["Saudi Arabia", 1.2], ["Japan", 2.5], ["Italy", 2.9], ["Germany", 3.0], ["United States", 3.6], ["France", 3.1], ["Spain", 3.3], ["United Kingdom", 3.4], ["Canada", 3.2],
      ["Australia", 3.1], ["South Korea", 2.4], ["Netherlands", 2.8], ["Sweden", 2.6], ["Norway", 2.5], ["Switzerland", 2.3], ["Poland", 4.2], ["Portugal", 3.1], ["Greece", 3.9], ["Ireland", 2.7], ["Denmark", 2.4], ["Finland", 2.9],
      ["Austria", 2.7], ["Belgium", 2.9], ["Czechia", 3.4], ["Hungary", 4.4], ["Romania", 5.6], ["Bulgaria", 5.9], ["Mexico", 12.4], ["Brazil", 14.2], ["Argentina", 9.8], ["Chile", 7.9], ["Colombia", 13.1], ["Peru", 11.6],
      ["China", 6.3], ["India", 26.6], ["Indonesia", 21.0], ["Vietnam", 19.8], ["Thailand", 8.1], ["Malaysia", 7.4], ["Philippines", 24.3], ["Pakistan", 55.8], ["Bangladesh", 28.9], ["Turkey", 9.1], ["Iran", 12.0], ["Egypt", 19.2],
      ["South Africa", 33.5], ["Kenya", 37.2], ["Ghana", 42.1], ["Ethiopia", 46.8], ["Tanzania", 44.3], ["Uganda", 41.0], ["Nigeria", 107.2], ["Niger", 115.2], ["Chad", 101.1], ["Mali", 94.0], ["Somalia", 106.1], ["Sierra Leone", 100.8],
      ["DR Congo", 76.0], ["Angola", 66.5], ["Mozambique", 67.2], ["Cameroon", 69.8], ["Senegal", 37.4], ["Rwanda", 38.3], ["Zambia", 56.2], ["Sudan", 52.9], ["Afghanistan", 55.5], ["Yemen", 39.9], ["Haiti", 56.3], ["Bolivia", 23.7],
      ["Guatemala", 22.1], ["Nepal", 26.2], ["Myanmar", 40.1], ["Cambodia", 23.6], ["Morocco", 16.7], ["Algeria", 21.5], ["Iraq", 23.4], ["Ukraine", 7.8], ["Russia", 4.8], ["Kazakhstan", 9.7], ["Uzbekistan", 13.6], ["Sri Lanka", 6.4],
    ].map(([country, rate]) => ({ country, rate })),
    value: "rate",
    label: "country",
    highlight: ["Nigeria", "India", "United States"],
    title: "Nigeria had 107.2 under-five deaths per 1,000 live births in 2022",
    subtitle: "Deaths before age five per 1,000 live births, 84 countries, 2022",
    source: "UN IGME (rounded)",
    note: "Figures are approximate, for illustration",
  },
  markCount: (rows) => rows.length,
  // One swarm needs less room than the default plot when it is small; rows by group grow the chart.
  height: (p, rows) => {
    const n = rows.length;
    if (!p.group) return n <= 60 ? 220 : n <= 200 ? 280 : 360;
    const G = Math.max(1, new Set(rows.map((r) => String(r[p.group!] ?? ""))).size);
    const perRow = Math.max(56, Math.min(130, 40 + Math.sqrt(n / G) * 7));
    return Math.round(G * perRow + 38);
  },
  build(p, ctx) {
    const t = ctx.tokens;
    // Judged by the surface, not the page mode: a poster theme paints a dark ground on a light page.
    const onDark = /^(#|rgb)/.test(t.surface) ? luminance(t.surface) < 0.2 : ctx.mode === "dark";
    const fmt = ctx.fmt;

    const dots: Dot[] = [];
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (Number.isNaN(v)) continue;
      dots.push({ v, name: p.label ? String(r[p.label] ?? "") : "", key: p.series ? String(r[p.series] ?? "") : "", group: p.group ? String(r[p.group] ?? "") : "", px: 0, at: 0, off: 0 });
    }
    const n = dots.length;
    const groups: string[] = [];
    const byGroup = new Map<string, Dot[]>();
    for (const d of dots) {
      let g = byGroup.get(d.group);
      if (!g) {
        byGroup.set(d.group, (g = []));
        groups.push(d.group);
      }
      g.push(d);
    }
    const G = Math.max(1, groups.length);
    const multi = !!p.group && groups.length > 0;

    // Colour categories, first-seen order, largest kept when over the cap.
    const counts = new Map<string, number>();
    for (const d of dots) counts.set(d.key, (counts.get(d.key) ?? 0) + 1);
    let keys = [...counts.keys()];
    let other = false;
    if (p.series && keys.length > MAX_HUES) {
      const keep = new Set([...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_HUES - 1).map((e) => e[0]));
      keys = keys.filter((k) => keep.has(k));
      other = true;
    }
    const keyIndex = new Map(keys.map((k, i) => [k, i]));
    const coloured = !!p.series && keys.length + (other ? 1 : 0) > 1;

    // `highlight` may name a dot, a colour category or a whole row.
    const anyHighlight = ctx.dimmed("\u0000");
    const litBy = (d: Dot) => (p.label && !ctx.dimmed(d.name) ? d.name : p.series && !ctx.dimmed(d.key) ? d.key : multi && !ctx.dimmed(d.group) ? d.group : null);
    const colorOf = (d: Dot) => {
      if (anyHighlight) {
        const by = litBy(d);
        return by == null ? t.context : ctx.color(by);
      }
      if (!coloured) return ctx.color();
      const i = keyIndex.get(d.key);
      return i == null ? t.context : ctx.color(d.key, i);
    };

    // The layout is computed in pixels, so the grid is pinned instead of auto-fitted:
    // dots must land exactly where the collision pass put them.
    const longest = multi ? Math.max(...groups.map((g) => measureText(g, t.fontSize, t.fontFamily))) : 0;
    const gutter = multi && !ctx.compact ? Math.min(170, Math.ceil(longest) + 22) : 8;
    const left = Math.max(gutter, 12);
    const right = 20;
    const top = 8;
    const bottom = 30;
    const plotW = Math.max(40, ctx.width - left - right);
    const plotH = Math.max(40, ctx.height - top - bottom);
    const bandH = plotH / G;
    // In compact mode the row name sits above its swarm instead of beside it.
    const headroom = multi && ctx.compact ? 18 : 0;
    const maxOff = Math.max(4, (bandH - headroom) / 2 - 3);

    let min = Infinity;
    let max = -Infinity;
    for (const d of dots) {
      if (d.v < min) min = d.v;
      if (d.v > max) max = d.v;
    }
    if (!n) [min, max] = [0, 1];
    const step = niceStep((max - min || Math.abs(max) || 1) / (ctx.compact ? 4 : 7));
    const lo = Math.floor(min / step + 1e-9) * step;
    const hi = Math.max(lo + step, Math.ceil(max / step - 1e-9) * step);
    const scale = plotW / (hi - lo);
    for (const d of dots) d.px = (d.v - lo) * scale;

    let r = p.radius ?? (n <= 120 ? 5 : n <= 500 ? 4 : 3);
    const sortedGroups = groups.map((g) => [...byGroup.get(g)!].sort((a, b) => a.px - b.px || a.name.localeCompare(b.name)));
    // Shrink the dots until the fullest swarm fits its row. Sliding along the axis is only
    // affordable (and only needed) for moderate counts; very large swarms are dense enough
    // to read as a shape already.
    const slide = n <= 800;
    let extent = 0;
    for (let attempt = 0; attempt < 10; attempt++) {
      extent = 0;
      for (const g of sortedGroups) extent = Math.max(extent, swarm(g, r, slide ? Math.min(3 * (2 * r + 0.5), plotW * 0.12) : 0, plotW));
      if (extent + r <= maxOff || r <= 1.5) break;
      r = Math.max(1.5, r * Math.max(0.6, Math.min(0.9, (maxOff / (extent + r)) ** 0.75)));
    }
    const centre = (gi: number) => bandH * gi + headroom + (bandH - headroom) / 2;
    // A swarm that still overflows at the smallest radius is squeezed proportionally: dots
    // overlap a little, but the outline stays a distribution instead of a flat-topped block.
    const squeeze = extent + r > maxOff ? Math.max(0, maxOff - r) / extent : 1;
    const clampOff = (y: number) => y * squeeze;

    const seriesIds = coloured ? [...keys, ...(other ? ["__other"] : [])] : ["__dots"];
    const idOf = (d: Dot) => (!coloured ? "__dots" : keyIndex.has(d.key) ? d.key : "__other");
    const nameOf = (id: string) => (id === "__other" ? "Other" : id === "__dots" ? p.value : p.names?.[id] ?? id);
    const groupIdx = new Map(groups.map((g, i) => [g, i]));
    const ring = r >= 3 ? 1 : 0;
    const base = onDark ? 0.95 : 0.9;

    const labelHalf = (name: string) => measureText(name, t.fontSize, t.fontFamily, 600) / 2 - right + 4;

    const series: Record<string, any>[] = seriesIds.map((id) => {
      const mine = dots.filter((d) => idOf(d) === id);
      // Highlighted dots draw last so their labels and colour sit on top.
      if (anyHighlight) mine.sort((a, b) => Number(litBy(a) != null) - Number(litBy(b) != null));
      return {
        id,
        name: nameOf(id),
        type: "scatter" as const,
        ...morph,
        clip: false,
        z: anyHighlight && mine.some((d) => litBy(d) != null) ? 3 : 2,
        emphasis: { scale: 1.4, focus: "none" as const },
        labelLayout: { hideOverlap: true },
        symbolSize: r * 2,
        data: mine.map((d) => {
          const lit = anyHighlight && litBy(d) != null;
          const sel = ctx.selected(multi ? d.group : id);
          const named = lit && p.label && !ctx.dimmed(d.name);
          return {
            name: d.name,
            // The drawn x may differ slightly from the value (see `swarm`); the true value rides along for the tooltip.
            value: [lo + d.at / scale, centre(groupIdx.get(d.group) ?? 0) + clampOff(d.off), d.group, d.v],
            itemStyle: { color: alpha(colorOf(d), (sel ? 1 : 0.25) * (anyHighlight && !lit ? (onDark ? 1 : 0.75) : base)), borderColor: t.surface, borderWidth: ring },
            label: named ? { show: true, formatter: d.name, position: d.at < labelHalf(d.name) ? ("right" as const) : d.at > plotW - labelHalf(d.name) ? ("left" as const) : ("top" as const), distance: 4, ...labelStyle(ctx, { color: t.ink, fontWeight: 600 }), textBorderColor: t.surface, textBorderWidth: 2.5 } : { show: false },
          };
        }),
      };
    });

    const medians = sortedGroups.map((g) => {
      const m = g.length >> 1;
      return g.length ? (g.length % 2 ? g[m].v : (g[m - 1].v + g[m].v) / 2) : NaN;
    });
    if (p.median && n) {
      series.push({
        id: "__median",
        name: "Median",
        type: "scatter",
        ...morph,
        clip: false,
        z: 4,
        symbol: "rect",
        symbolSize: [2, Math.max(14, Math.min(bandH - headroom - 6, 2 * maxOff))],
        itemStyle: { color: t.ink },
        emphasis: { scale: false },
        data: groups.map((g, gi) => ({ name: multi ? `${g} median` : "Median", value: [medians[gi], centre(gi), g, medians[gi]] })),
      });
    }

    const font = `${t.fontSize}px ${t.fontFamily}`;
    const graphic = multi
      ? groups.map((g, gi) =>
          ctx.compact
            ? { type: "text", silent: true, left: left, top: top + bandH * gi + 2, style: { text: g, fill: ctx.dimmed(g) && anyHighlight ? t.muted : t.inkSecondary, font: `600 ${font}` } }
            : { type: "text", silent: true, x: left - 12, y: top + centre(gi), style: { text: g, fill: t.inkSecondary, font, align: "right", verticalAlign: "middle", width: gutter - 14, overflow: "truncate" } },
        )
      : [];

    const legend: LegendItem[] = [
      ...(coloured ? seriesIds.map((id) => ({ name: nameOf(id), color: id === "__other" ? t.context : ctx.color(id, keyIndex.get(id)), shape: "dot" as const, muted: id === "__other" || (anyHighlight && ctx.dimmed(id)) })) : []),
    ];

    const all = [...dots].sort((a, b) => a.v - b.v);
    const overall = n ? (n % 2 ? all[n >> 1].v : (all[(n >> 1) - 1].v + all[n >> 1].v) / 2) : 0;
    const who = (d: Dot) => (d.name ? `${d.name} (${fmt(d.v)})` : fmt(d.v));
    const alt = n
      ? `Beeswarm chart of ${p.value}, one dot for each of ${n} rows${multi ? `, in ${G} rows by ${p.group}` : ""}. Values run from ${who(all[0])} to ${who(all[n - 1])}; the median is ${fmt(Math.round(overall * 100) / 100)}.${multi ? ` Medians: ${groups.slice(0, 8).map((g, i) => `${g} ${fmt(Math.round(medians[i] * 100) / 100)}`).join(", ")}.` : ""}`
      : `Beeswarm chart of ${p.value}: no numeric values.`;

    return {
      legend,
      alt,
      option: {
        grid: { left, right, top, bottom, outerBoundsMode: "none" },
        xAxis: valueAxis(ctx, { min: lo, max: hi, interval: step, axisLine: { show: false, onZero: false }, axisLabel: { formatter: (v: number) => fmt(Math.round(v * 1e9) / 1e9), hideOverlap: true, alignMinLabel: multi && !ctx.compact ? undefined : "left", alignMaxLabel: "right" } }),
        // The cross axis is in pixels from the top of the plot: the swarm offsets are not data.
        yAxis: hiddenAxis("value", { min: 0, max: plotH, inverse: true }),
        graphic,
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (!Array.isArray(d.value)) return "";
            const rows = [{ name: p.value, value: fmt(d.value[3] ?? d.value[0]) }];
            if (multi && d.seriesId !== "__median") rows.unshift({ name: p.group!, value: String(d.value[2]) });
            if (coloured && d.seriesId !== "__median") rows.unshift({ name: p.series!, value: d.seriesName });
            return tooltipHtml(ctx, d.name || undefined, rows);
          },
        },
        series,
      },
    };
  },
});

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function normal(rnd: () => number) {
  return Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
}

const players = (() => {
  const rnd = seeded(17);
  const positions: [string, number, number, number][] = [
    ["Guard", 191, 5, 150],
    ["Forward", 203, 4.5, 160],
    ["Centre", 211, 4, 70],
  ];
  const rows: { player: string; position: string; height: number }[] = [];
  for (const [position, mean, sd, count] of positions) for (let i = 0; i < count; i++) rows.push({ player: `${position} ${i + 1}`, position, height: Math.round(mean + normal(rnd) * sd) });
  return rows;
})();

const salaries = (() => {
  const rnd = seeded(29);
  const teams = ["Engineering", "Sales", "Design", "Support"];
  const mid: Record<string, number> = { Engineering: 132, Sales: 96, Design: 108, Support: 62 };
  const rows: { person: string; team: string; level: string; salary: number }[] = [];
  teams.forEach((team) => {
    const count = team === "Engineering" ? 90 : team === "Sales" ? 60 : 30;
    for (let i = 0; i < count; i++) {
      const lv = rnd();
      const level = lv < 0.5 ? "Junior" : lv < 0.85 ? "Senior" : "Lead";
      const bump = level === "Junior" ? -18 : level === "Senior" ? 8 : 38;
      rows.push({ person: `${team} ${i + 1}`, team, level, salary: Math.round(mid[team] + bump + normal(rnd) * 9) });
    }
  });
  return rows;
})();

const stress = (() => {
  const rnd = seeded(101);
  return Array.from({ length: 2000 }, (_, i) => ({ id: `Trip ${i + 1}`, minutes: Math.round((rnd() < 0.7 ? 14 + Math.abs(normal(rnd)) * 9 : 38 + normal(rnd) * 10) * 10) / 10 })).filter((d) => d.minutes > 0);
})();

export const examples = {
  "Rows by group, with medians": {
    data: players,
    value: "height",
    group: "position",
    label: "player",
    median: true,
    format: "{value} cm",
    height: 380,
    title: "Height of 380 professional basketball players by position",
    subtitle: "Height in centimetres. The tick marks the median of each position.",
    note: "Illustrative data",
  },
  "Colour by series, long format": {
    theme: "poster",
    data: salaries,
    value: "salary",
    group: "team",
    series: "level",
    label: "person",
    format: "${value}k",
    height: 420,
    title: "Base salary by team and level",
    subtitle: "Thousands of dollars, 210 employees",
    note: "Illustrative data",
  },
  "Highlight a whole row": {
    theme: "dusk",
    data: salaries,
    value: "salary",
    group: "team",
    label: "person",
    highlight: "Support",
    format: "${value}k",
    height: 380,
    title: "Base salary by team",
    subtitle: "Thousands of dollars, 210 employees. Support is highlighted.",
    note: "Illustrative data",
  },
  "Stress: 2,000 dots": {
    theme: "earth",
    data: stress,
    value: "minutes",
    label: "id",
    format: "{value} min",
    height: 420,
    title: "Duration of 2,000 bike-share trips",
    subtitle: "Minutes per trip",
    note: "Illustrative data",
  },
};
