import type { ChartContext } from "./chart";
import { mergeOption } from "./echarts";

// Small, theme-aware option fragments. Chart builders compose these instead of restating
// axis and tooltip styling, which keeps every chart visually consistent.

type Obj = Record<string, any>;

export const escapeHtml = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Category axis: baseline only, no ticks, labels that hide rather than overlap. */
export function categoryAxis(ctx: ChartContext, overrides: Obj = {}): Obj {
  const t = ctx.tokens;
  return mergeOption(
    {
      type: "category",
      axisLine: { show: true, lineStyle: { color: t.axis, width: 1 } },
      axisTick: { show: false },
      axisLabel: { color: t.muted, fontSize: t.fontSize, hideOverlap: true, margin: 10 },
      splitLine: { show: false },
    },
    overrides,
  );
}

/** Value axis: hairline gridlines carry the scale; no axis line, no ticks. */
export function valueAxis(ctx: ChartContext, overrides: Obj = {}): Obj {
  const t = ctx.tokens;
  return mergeOption(
    {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.muted, fontSize: t.fontSize, margin: 10 },
      splitLine: { show: true, lineStyle: { color: t.grid, width: 1, type: "solid" } },
      splitNumber: ctx.compact ? 3 : 5,
    },
    overrides,
  );
}

export function timeAxis(ctx: ChartContext, overrides: Obj = {}): Obj {
  const t = ctx.tokens;
  return mergeOption(
    {
      type: "time",
      axisLine: { show: true, lineStyle: { color: t.axis, width: 1 } },
      axisTick: { show: false },
      // Every tick is a self-contained label ("Nov 8", not a bare "8" whose month is three
      // ticks away); ones that would collide are hidden rather than squeezed.
      axisLabel: {
        color: t.muted,
        fontSize: t.fontSize,
        hideOverlap: true,
        margin: 10,
        formatter: { year: "{yyyy}", month: "{MMM}", day: "{MMM} {d}", hour: "{HH}:{mm}", minute: "{HH}:{mm}", second: "{HH}:{mm}:{ss}", millisecond: "{hh}:{mm}:{ss}", none: "{yyyy}-{MM}-{dd}" },
        rich: { primary: { fontWeight: 600, color: t.inkSecondary } },
      },
      splitLine: { show: false },
      // Three or fewer makes ECharts fall back to sub-year ticks on multi-year ranges.
      splitNumber: ctx.compact ? 4 : 6,
    },
    overrides,
  );
}

/** An axis with nothing drawn, for charts whose marks are labelled directly. */
export function hiddenAxis(type: "value" | "category" | "time" = "value", overrides: Obj = {}): Obj {
  return mergeOption({ type, show: false, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false } }, overrides);
}

export interface TooltipRow {
  name: string;
  value: string;
  color?: string;
  /** Render in muted ink (context series). */
  muted?: boolean;
}

/** Tooltip body: a title line and aligned name/value rows. All text is escaped. */
export function tooltipHtml(ctx: ChartContext, title: string | undefined, rows: TooltipRow[]): string {
  const t = ctx.tokens;
  const head = title ? `<div style="font-weight:600;margin-bottom:${rows.length ? 4 : 0}px;color:${t.ink}">${escapeHtml(title)}</div>` : "";
  const body = rows
    .map(
      (r) =>
        `<div style="display:flex;align-items:center;gap:8px;line-height:1.5;color:${r.muted ? t.muted : t.inkSecondary}">` +
        (r.color ? `<span style="width:8px;height:8px;border-radius:2px;background:${r.color};flex:none"></span>` : "") +
        `<span style="flex:1;min-width:0">${escapeHtml(r.name)}</span>` +
        `<span style="font-weight:600;color:${t.ink};font-variant-numeric:tabular-nums;margin-left:12px">${escapeHtml(r.value)}</span></div>`,
    )
    .join("");
  return head + body;
}

/** Text style for labels drawn on the chart: secondary ink, never the series colour. */
export function labelStyle(ctx: ChartContext, overrides: Obj = {}): Obj {
  return { color: ctx.tokens.inkSecondary, fontFamily: ctx.tokens.fontFamily, fontSize: ctx.tokens.fontSize, ...overrides };
}

/** Enable morphing between chart states. Give series stable `id`s for best results. */
export const morph = { universalTransition: { enabled: true, divideShape: "clone" as const } };
