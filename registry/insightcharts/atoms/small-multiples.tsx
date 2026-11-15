"use client";

import { BarChart as EBar, LineChart as ELine } from "echarts/charts";
import { alpha, defineChart, measureText, type LegendItem, formatDate, categoryAxis, morph, tooltipHtml, valueAxis, shapeSeries, type Shaped } from "insightcharts/core";
import { niceStep } from "insightcharts/data";

export interface SmallMultiplesProps {
  /** Field whose values each get a panel. */
  facet: string;
  /** Time or ordered category field, shared by every panel. */
  x: string;
  /** Value field, or several (one mark series each, in every panel). */
  y: string | string[];
  /** Field that splits rows into series inside each panel, for long-format data. */
  series?: string;
  /** What each panel draws. */
  kind?: "line" | "area" | "bar";
  /** Preferred number of columns. Reduced automatically when the panels would get too narrow. */
  columns?: number;
  /** `"shared"`: every panel uses the same value scale, so heights compare across panels. `"free"`: each panel fits its own data and prints its own axis. */
  scales?: "shared" | "free";
  /** Draw every other panel's line in faint grey behind each panel's own (single-series line panels). */
  context?: boolean;
  /** Print each panel's latest value beside its title. Default: on for a single series. */
  latest?: boolean;
  /** Display names for facet values and series keys. */
  names?: Record<string, string>;
}

/**
 * A grid of small panels with identical axes, one per value of a field. The panels share
 * one scale, so values can be compared across them. All panels live in one chart instance,
 * so they resize and export as one.
 */
export const SmallMultiples = defineChart<SmallMultiplesProps>({
  name: "small-multiples",
  title: "Small multiples",
  category: "trend",
  description: "Repeats one small line, area or bar chart per value of a facet field on a shared scale, each panel titled.",
  whenToUse: "The same measure for 4 to about 24 entities when one chart would have too many overlapping lines; pair with `highlight` to pick out one panel, or `context` to show every other line faintly behind each.",
  avoid: "Three or fewer series (use line-chart with direct labels); when exact comparison between two entities matters most (use line-chart with `highlight`); a single value per entity (use bar-chart).",
  use: [ELine, EBar],
  defaults: { kind: "line", scales: "shared" },
  selectField: (p) => p.facet,
  selectValue: (params) => String(params.seriesId ?? "").split("::")[0],
  markCount: (rows) => rows.length * 2,
  props: [
    { name: "facet", type: "string", required: true, description: "Field whose values each get a panel." },
    { name: "x", type: "string", required: true, description: "Time or ordered category field, shared by every panel." },
    { name: "y", type: "string | string[]", required: true, description: "Value field, or several (one series each in every panel)." },
    { name: "series", type: "string", description: "Field that splits rows into series inside each panel (long data)." },
    { name: "kind", type: '"line" | "area" | "bar"', default: '"line"', description: "What each panel draws. Area and bar panels start at zero." },
    { name: "columns", type: "number", description: "Preferred number of columns; reduced automatically on narrow containers." },
    { name: "scales", type: '"shared" | "free"', default: '"shared"', description: "Shared value scale across panels, or each panel on its own (say so in the subtitle)." },
    { name: "context", type: "boolean", default: "false", description: "Draw every other panel's line faintly behind each panel's own." },
    { name: "latest", type: "boolean", description: "Print the latest value beside each panel title. Default: on for a single series." },
    { name: "names", type: "Record<string, string>", description: "Display names for facet values and series keys." },
  ],
  example: {
    type: "small-multiples",
    data: [
      ["Germany", 6.8, 5.0, 4.6, 3.8, 3.1, 3.6, 3.0, 3.4], ["Spain", 19.9, 26.1, 22.1, 17.2, 14.1, 14.8, 12.2, 11.4], ["Italy", 8.4, 12.1, 11.9, 11.2, 9.9, 9.5, 7.7, 6.5],
      ["France", 9.3, 10.3, 10.4, 9.4, 8.4, 7.9, 7.3, 7.4], ["Greece", 12.7, 27.5, 24.9, 21.5, 17.3, 14.7, 11.1, 10.1], ["Poland", 9.7, 10.3, 7.5, 4.9, 3.3, 3.4, 2.8, 2.9],
    ].flatMap(([country, ...v]) => ["2010", "2013", "2015", "2017", "2019", "2021", "2023", "2024"].map((year, i) => ({ country, year, rate: v[i] }))),
    facet: "country",
    x: "year",
    y: "rate",
    highlight: "Greece",
    format: "{value}%",
    title: "Greek unemployment fell from 27.5% in 2013 to 10.1% in 2024",
    subtitle: "Unemployment rate, 2010 to 2024, same scale in every panel",
    source: "Eurostat (rounded)",
    note: "Figures are approximate, for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const tw = (s: string, weight = 400) => measureText(s, t.fontSize, t.fontFamily, weight);
    const kind = p.kind ?? "line";
    const bars = kind === "bar";
    const free = p.scales === "free";

    // Global x order and series keys, then one aligned shape per facet.
    const all = shapeSeries(ctx.rows, p, p.names);
    const labels = all.labels;
    const at = new Map(labels.map((l, i) => [l, i]));
    const keys = all.series.map((s) => ({ key: s.key, name: s.name }));
    const single = keys.length === 1;
    const facets: { key: string; name: string; values: (number | null)[][] }[] = [];
    const byFacet = new Map<string, typeof ctx.rows>();
    for (const r of ctx.rows) {
      const k = String(r[p.facet]);
      if (!byFacet.has(k)) byFacet.set(k, []);
      byFacet.get(k)!.push(r);
    }
    for (const [key, rows] of byFacet) {
      const shaped: Shaped = shapeSeries(rows, p, p.names);
      const values = keys.map(({ key: sk }) => {
        const out = new Array<number | null>(labels.length).fill(null);
        const s = shaped.series.find((it) => it.key === sk);
        if (s) shaped.labels.forEach((l, j) => (out[at.get(l)!] = s.values[j]));
        return out;
      });
      facets.push({ key, name: p.names?.[key] ?? key, values });
    }
    const n = facets.length;
    const nums = facets.flatMap((f) => f.values.flat().filter((v): v is number => v != null));
    const zero = kind !== "line";
    let lo = Math.min(...nums, zero ? 0 : Infinity);
    let hi = Math.max(...nums, zero ? 0 : -Infinity);
    if (!Number.isFinite(lo)) [lo, hi] = [0, 1];
    const step = niceStep((hi - lo || Math.abs(hi) || 1) / 3);
    const yMin = Math.floor(lo / step + 1e-9) * step;
    const yMax = Math.ceil(hi / step - 1e-9) * step;

    // Layout in pixels. Columns shrink with the container, then grow again if that leaves panels too flat.
    const W = ctx.width;
    const gapX = ctx.compact ? 14 : 22;
    const gapY = 14;
    const titleH = 22;
    const xAxisH = 22;
    const tickW = Math.ceil(Math.max(tw(fmt(yMin)), tw(fmt(yMax)), tw(fmt(yMin + step)))) + 16;
    const gutter = free ? 0 : tickW;
    const inner = free ? tickW : 0;
    const minW = (ctx.compact ? 96 : 150) + inner;
    const fit = Math.max(1, Math.floor((W - gutter + gapX) / (minW + gapX)));
    let cols = Math.max(1, Math.min(n, p.columns ? Math.min(p.columns, fit) : Math.min(fit, 4)));
    if (!p.columns) cols = Math.ceil(n / Math.ceil(n / cols));
    const hardMin = (ctx.compact ? 84 : 110) + inner;
    const plotHeight = (c: number) => {
      const rows = Math.ceil(n / c);
      return (ctx.height - rows * titleH - xAxisH - gapY * (rows - 1)) / rows;
    };
    while (plotHeight(cols) < 56 && cols < n && (W - gutter - gapX * cols) / (cols + 1) >= hardMin) cols++;
    const rows = Math.ceil(n / cols);
    // A panel prints the x labels when nothing sits beneath it.
    const bottom = (i: number) => i + cols >= n;
    const rowHasAxis = Array.from({ length: rows }, (_, r) => facets.some((_f, i) => Math.floor(i / cols) === r && bottom(i)));
    const axisRows = rowHasAxis.filter(Boolean).length;
    const plotH = Math.max(24, (ctx.height - rows * titleH - axisRows * xAxisH - gapY * (rows - 1)) / rows);
    const cellW = (W - gutter - gapX * (cols - 1)) / cols;
    const plotW = Math.max(20, cellW - inner);
    const rowTop: number[] = [];
    let y = 0;
    for (let r = 0; r < rows; r++) {
      rowTop.push(y);
      y += titleH + plotH + (rowHasAxis[r] ? xAxisH : 0) + gapY;
    }
    const cellLeft = (i: number) => gutter + (i % cols) * (cellW + gapX);

    const hl = p.highlight == null ? [] : Array.isArray(p.highlight) ? p.highlight : [p.highlight];
    const facetDim = (f: string) => hl.length > 0 && !hl.includes(f) && !keys.some((k) => hl.includes(k.key));
    const colorOf = (f: string, ki: number) => {
      const k = keys[ki].key;
      if (!hl.length) return single ? t.accent : t.categorical[ki % t.categorical.length];
      if (hl.includes(f)) return single ? t.accent : t.categorical[ki % t.categorical.length];
      return hl.includes(k) ? ctx.color(k, ki) : t.context;
    };

    const monthly = (v: string) => /^\d{4}-\d{2}$/.test(v);
    const tick = (v: string) => (all.temporal ? formatDate(monthly(v) ? `${v}-01T00:00:00` : v, ctx.locale, monthly(v) ? { month: "short", year: "2-digit" } : { year: "numeric", month: "short" }) : v);
    const lastIndex = labels.length - 1;
    const ghosts = !!p.context && kind === "line" && single && n <= 16;
    const showLatest = (p.latest ?? single) && single;

    const grid: any[] = [];
    const xAxis: any[] = [];
    const yAxis: any[] = [];
    const series: any[] = [];
    const graphic: any[] = [];

    facets.forEach((f, i) => {
      const r = Math.floor(i / cols);
      const left = cellLeft(i) + inner;
      const top = rowTop[r] + titleH;
      const dim = facetDim(f.key);
      const fade = ctx.selected(f.key) ? 1 : 0.25;
      grid.push({ left, top, width: plotW, height: plotH, outerBoundsMode: "none" });
      xAxis.push(
        categoryAxis(ctx, {
          gridIndex: i,
          data: labels,
          boundaryGap: bars,
          axisLabel: {
            show: bottom(i),
            margin: 7,
            formatter: tick,
            hideOverlap: false,
            // First and last only: the panels are too small for a full axis and every panel shares it.
            interval: (idx: number) => idx === 0 || idx === lastIndex,
            alignMinLabel: bars ? undefined : "left",
            alignMaxLabel: bars ? undefined : "right",
          },
        }),
      );
      yAxis.push(
        valueAxis(ctx, {
          gridIndex: i,
          ...(free ? { scale: !zero, splitNumber: 2 } : { min: yMin, max: yMax, interval: step }),
          axisLabel: { show: free || i % cols === 0, margin: 8, formatter: (v: number) => fmt(v) },
        }),
      );

      const lastValue = [...f.values[0]].reverse().find((v) => v != null);
      // The latest value shares the title line only when the name fits beside it.
      const wanted = showLatest && lastValue != null ? fmt(lastValue) : "";
      const latest = wanted && tw(f.name, 600) + tw(wanted) + 12 <= plotW ? wanted : "";
      const titleW = plotW - (latest ? tw(latest) + 10 : 0);
      graphic.push({ type: "text", left, top: rowTop[r] + 2, silent: true, style: { text: f.name, fill: dim ? t.muted : t.ink, opacity: fade, font: `600 ${t.fontSize}px ${t.fontFamily}`, width: Math.max(30, titleW), overflow: "truncate" } });
      if (latest) graphic.push({ type: "text", left: left + plotW - tw(latest) - 1, top: rowTop[r] + 2, silent: true, style: { text: latest, fill: dim ? t.muted : t.inkSecondary, opacity: fade, font: `${t.fontSize}px ${t.fontFamily}`, width: tw(latest) + 2, align: "right", x: tw(latest) + 1 } });

      if (ghosts) {
        facets.forEach((other) => {
          if (other === f) return;
          series.push({ id: `${f.key}::ctx::${other.key}`, type: "line", xAxisIndex: i, yAxisIndex: i, silent: true, z: 1, showSymbol: false, animation: false, tooltip: { show: false }, lineStyle: { width: 1, color: t.grid }, data: other.values[0], connectNulls: true });
        });
      }
      keys.forEach((k, ki) => {
        const color = colorOf(f.key, ki);
        const values = f.values[ki];
        const end = values.reduce<number>((e, v, j) => (v != null ? j : e), -1);
        if (bars) {
          series.push({
            id: `${f.key}::${k.key}`,
            name: k.name,
            type: "bar",
            xAxisIndex: i,
            yAxisIndex: i,
            ...morph,
            barMaxWidth: 24,
            barGap: "8%",
            itemStyle: { color: alpha(color, fade), borderRadius: [Math.min(2, t.radius), Math.min(2, t.radius), 0, 0] },
            data: values,
          });
        } else {
          series.push({
            id: `${f.key}::${k.key}`,
            name: k.name,
            type: "line",
            xAxisIndex: i,
            yAxisIndex: i,
            ...morph,
            z: 3,
            connectNulls: false,
            symbol: "circle",
            showSymbol: true,
            // Only the latest point gets a marker.
            symbolSize: (_v: unknown, d: any) => (d.dataIndex === end ? 7 : 0),
            lineStyle: { width: dim ? 1.5 : t.lineWidth, color, opacity: fade, cap: "round", join: "round" },
            itemStyle: { color, borderColor: t.surface, borderWidth: 1.5, opacity: fade },
            areaStyle: kind === "area" ? { color: alpha(color, single ? 0.14 : 0.08), origin: "start" } : undefined,
            emphasis: { disabled: true },
            data: values,
          });
        }
      });
    });

    // Core attaches annotations to the first series only, which is the first panel. Lines and bands
    // are repeated (without their labels) in every other panel so a threshold reads across the grid.
    const notes = p.annotations ?? [];
    if (notes.length && n > 1) {
      const markLine = notes.filter((a) => a.type === "line").map((a: any) => ({ [a.axis === "x" ? "xAxis" : "yAxis"]: a.value, lineStyle: { color: a.emphasis ? t.ink : t.muted, width: 1, type: a.dashed === false ? "solid" : "dashed" }, label: { show: false } }));
      const markArea = notes.filter((a) => a.type === "band").map((a: any) => [{ [a.axis === "x" ? "xAxis" : "yAxis"]: a.from, label: { show: false } }, { [a.axis === "x" ? "xAxis" : "yAxis"]: a.to }]);
      const done = new Set<number>([series[0]?.xAxisIndex ?? 0]);
      for (const s of series) {
        if (done.has(s.xAxisIndex)) continue;
        done.add(s.xAxisIndex);
        if (markLine.length) s.markLine = { silent: true, symbol: "none", animation: ctx.animate, data: markLine };
        if (markArea.length) s.markArea = { silent: true, itemStyle: { color: alpha(t.muted, 0.12) }, data: markArea };
      }
    }

    const legend: LegendItem[] = single ? [] : keys.map((k, ki) => ({ name: k.name, color: t.categorical[ki % t.categorical.length], shape: bars ? "square" : "line" }));
    const ends = facets.map((f) => ({ f, v: [...f.values[0]].reverse().find((v) => v != null) })).filter((d): d is { f: (typeof facets)[number]; v: number } => d.v != null);
    const top = [...ends].sort((a, b) => b.v - a.v)[0];
    const low = [...ends].sort((a, b) => a.v - b.v)[0];
    const yName = Array.isArray(p.y) ? p.y.join(", ") : p.y;
    const focus = facets.filter((f) => hl.includes(f.key));

    return {
      legend,
      alt: `Small multiples: ${n} ${kind} charts of ${yName} by ${p.x}, one per ${p.facet}, ${free ? "each on its own scale" : "on a shared scale"}, ${labels[0]} to ${labels[lastIndex]}.${focus.length ? ` Highlighted: ${focus.map((f) => f.name).join(", ")}.` : ""}${single && top && low && top !== low ? ` Latest value is highest in ${top.f.name} (${fmt(top.v)}) and lowest in ${low.f.name} (${fmt(low.v)}).` : ""}`,
      option: {
        grid,
        xAxis,
        yAxis,
        graphic,
        axisPointer: { link: [{ xAxisIndex: "all" }] },
        tooltip: {
          trigger: "axis",
          formatter: (items: any) => {
            const list = (Array.isArray(items) ? items : [items]).filter((d: any) => d.value != null && !String(d.seriesId).includes("::ctx::"));
            if (!list.length) return "";
            const facetOf = (d: any) => String(d.seriesId).split("::")[0];
            const name = (key: string) => facets.find((f) => f.key === key)?.name ?? key;
            const many = new Set(list.map(facetOf)).size > 1;
            if (many) list.sort((a: any, b: any) => b.value - a.value);
            const title = many ? tick(list[0].name) : `${name(facetOf(list[0]))} · ${tick(list[0].name)}`;
            return tooltipHtml(ctx, title, list.slice(0, 14).map((d: any) => ({ name: many ? (single ? name(facetOf(d)) : `${name(facetOf(d))}, ${d.seriesName}`) : single ? yName : d.seriesName, value: fmt(d.value), color: d.color, muted: facetDim(facetOf(d)) })));
          },
        },
        series,
      },
    };
  },
});
