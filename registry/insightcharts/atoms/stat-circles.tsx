"use client";

import { CustomChart } from "echarts/charts";
import { inkOn, mix, ramp, defineChart, resolveIcon, dodge, measureText, truncateText, wrapText, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

export interface StatCirclesProps {
  /** Label field: the short text under or beside each circle. */
  name: string;
  /** Value field: circle area, and the number printed large. */
  value: string;
  /** Unit printed small after each number, e.g. "kg". Leave out when `format` already includes it. */
  unit?: string;
  /** `"row"` centres the circles on one line, `"steps"` stands them on a shared baseline, `"nested"` draws them inside each other from a shared lowest point. Default `"row"`. Narrow containers stack a row or steps into a column. */
  layout?: "row" | "steps" | "nested";
  /** `"item"` gives each circle its own colour, `"value"` shades by value along the sequential ramp, `"single"` uses the accent for all. Default `"item"`. */
  colorBy?: "item" | "value" | "single";
  /** Icon drawn above the number in circles large enough: one name for all, or a map from label to icon. Built-in name or `path://`. */
  icon?: string | Record<string, string>;
}

const MAX_COLOURS = 8;

/**
 * Three to five magnitudes as plain circles. Area carries the comparison, so every circle
 * also carries its number: inside when it fits, beside or above when it does not.
 */
export const StatCircles = defineChart<StatCirclesProps>({
  name: "stat-circles",
  title: "Stat circles",
  category: "poster",
  description: "Shows a few related magnitudes as plain circles sized by area, each with its number set large and a short label.",
  whenToUse: "The poster way to show two to six related magnitudes whose rough proportion is the point: kilograms per person in three countries, the same quantity in three years, a total and its parts set side by side.",
  avoid: "More than six values or values that need precise comparison (use bar-chart); a single number (use big-number); many circles of one whole (use circle-pack); values close together, where areas look the same (use bar-chart or dumbbell-chart).",
  use: [CustomChart],
  defaults: { layout: "row", colorBy: "item" },
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "circles" ? params.name : null),
  // The layout in `build` fits the circles to the box it is given, so this hook only has to
  // offer a box of the right proportions for the width: text is measured in a generic face.
  height: (p, rows, width) => {
    const W = width ?? 720;
    const items = rows.map((r) => ({ key: String(r[p.name] ?? ""), value: toNumber(r[p.value]) })).filter((r) => r.value > 0);
    const n = items.length;
    if (!n) return undefined;
    const vmax = Math.max(...items.map((r) => r.value));
    const rel = items.map((r) => Math.sqrt(r.value / vmax));
    const compact = W < 480;
    if (p.layout === "nested") return compact ? Math.round(Math.min(W, 300) + n * 24 + 28) : 340;
    if (compact) {
      // A column: the largest circle takes about two fifths of the width, each row is as tall as its circle or its text.
      const rmax = Math.min(W * 0.21, 84);
      const tw = Math.max(60, W - 2 * rmax - 18);
      return Math.ceil(items.reduce((s, r, i) => s + Math.max(2 * rel[i] * rmax, 24 * 1.1 + Math.min(3, wrapText(r.key, tw, 12).length) * 16) + 12, 0) + 4);
    }
    // A row: the widest circles the line holds, up to 130px in radius, plus the labels under them.
    const gap = 22;
    const share = (W - gap * (n - 1)) / n;
    const labelW = items.map((r) => Math.min(measureText(r.key, 12), 170, share));
    let lo = 20;
    let hi = 130;
    for (let k = 0; k < 12; k++) {
      const mid = (lo + hi) / 2;
      if (rel.reduce((s, x, i) => s + Math.max(2 * x * mid, labelW[i]), 0) + gap * (n - 1) <= W) lo = mid;
      else hi = mid;
    }
    const lines = Math.max(...items.map((r) => Math.min(3, wrapText(r.key, Math.min(170, share), 12).length)));
    const above = rel.some((x) => x * lo < 24) ? 30 : 0;
    return Math.ceil(Math.max(200, 2 * lo + lines * 16 + 12 + above + 8));
  },
  props: [
    { name: "name", type: "string", required: true, description: "Label field: the short text under or beside each circle." },
    { name: "value", type: "string", required: true, description: "Value field: circle area, and the number printed large. Non-positive values are dropped." },
    { name: "unit", type: "string", description: 'Unit printed small after each number, e.g. "kg". Leave out when `format` already includes it.' },
    { name: "layout", type: '"row" | "steps" | "nested"', default: '"row"', description: "Circles centred on one line, standing on a shared baseline, or drawn inside each other from a shared lowest point. Narrow containers stack a row or steps into a column." },
    { name: "colorBy", type: '"item" | "value" | "single"', default: '"item"', description: "A colour per circle, a shade by value along the sequential ramp, or the accent for all." },
    { name: "icon", type: "string | Record<string, string>", description: "Icon above the number in large circles: one for all, or a map from label to icon. Built-in name or `path://`." },
  ],
  example: {
    type: "stat-circles",
    data: [
      { who: "per person in the United States", kg: 124 },
      { who: "per person in Brazil", kg: 100 },
      { who: "per person in China", kg: 63 },
      { who: "per person in India", kg: 6 },
    ],
    name: "who",
    value: "kg",
    unit: "kg",
    title: "Meat supply in the United States was 124 kg per person in 2021",
    subtitle: "Meat supply per person per year, kilograms, 2021",
    source: "FAO food balance sheets",
    note: "Rounded, approximate figures for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const W = ctx.width;
    const H = ctx.height;
    type Row = { key: string; value: number; i: number };
    const rows: Row[] = [];
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (!Number.isNaN(v) && v > 0) rows.push({ key: String(r[p.name] ?? ""), value: v, i: rows.length });
    }
    const n = rows.length;
    const vmax = Math.max(...rows.map((r) => r.value), 0) || 1;
    const nested = p.layout === "nested";
    const column = !nested && ctx.compact;
    const steps = p.layout === "steps";
    const unit = p.unit ? ` ${p.unit}` : "";
    const texts = rows.map((r) => ctx.fmt(r.value));

    const anyHighlight = ctx.highlight.length > 0;
    const baseOf = (r: Row) => {
      if (anyHighlight || p.colorBy === "single") return ctx.color(r.key);
      if (p.colorBy === "value") return ramp(t.sequential, 0.2 + 0.8 * Math.sqrt(r.value / vmax));
      return r.i < MAX_COLOURS ? ctx.color(r.key, r.i) : t.context;
    };
    const fillOf = (r: Row) => (ctx.selected(r.key) ? baseOf(r) : mix(t.surface, baseOf(r), 0.3));
    const iconOf = (r: Row) => (typeof p.icon === "string" ? p.icon : p.icon?.[r.key]);
    const radius = (r: Row, rmax: number) => Math.max(2, Math.sqrt(r.value / vmax) * rmax);
    const numberW = (i: number, size: number, weight: number) => measureText(texts[i], size, t.displayFamily, weight) + (unit ? measureText(unit, Math.max(11, size * 0.42), t.fontFamily, 600) : 0);

    // The number inside a circle: as large as the circle allows, light when large.
    type Inside = { size: number; weight: number; icon: number };
    const inside = (i: number, r: number): Inside | null => {
      if (r < 24) return null;
      const wantIcon = !!iconOf(rows[i]) && r >= 44;
      for (const withIcon of wantIcon ? [true, false] : [false]) {
        const icon = withIcon ? Math.round(Math.min(44, r * 0.4)) : 0;
        let size = Math.min(64, r * (withIcon ? 0.5 : 0.62));
        for (let k = 0; k < 8 && size >= 14; k++) {
          const weight = size >= 26 ? 300 : 600;
          const block = size * 1.05 + (icon ? icon + 4 : 0);
          const dy = block / 2;
          const chord = 2 * Math.sqrt(Math.max(0, r * r - dy * dy)) - r * 0.2;
          if (block <= r * 1.6 && numberW(i, size, weight) <= chord) return { size, weight, icon };
          size *= 0.9;
        }
      }
      return null;
    };
    const numberText = (i: number, size: number, weight: number, fill: string) => ({
      text: unit ? `{v|${texts[i]}}{u|${unit}}` : `{v|${texts[i]}}`,
      rich: { v: { fill, fontSize: size, fontWeight: weight, fontFamily: t.displayFamily, verticalAlign: "bottom", lineHeight: size * 1.05 }, u: { fill, fontSize: Math.max(11, size * 0.42), fontWeight: 600, fontFamily: t.fontFamily, verticalAlign: "bottom", lineHeight: size * 1.05, padding: [0, 0, size * 0.12, 0] } },
    });

    type Mark = { cx: number; cy: number; r: number; inside: Inside | null; number: { x: number; y: number; size: number; align: "left" | "center" } | null; label: { x: number; y: number; lines: string[]; align: "left" | "center" } | null; leader?: number[][] };
    const marks: Mark[] = [];
    const deco: any[] = [];
    const outSize = column ? 24 : 22;
    const labelSize = 12;
    const labelLH = 16;

    if (!n) {
      // Nothing to lay out.
    } else if (nested) {
      // Largest first, all touching one lowest point; numbers in a column beside (or under) the stack.
      const order = [...rows].sort((a, b) => b.value - a.value);
      const lineH = 24;
      const colW = Math.max(...order.map((r) => numberW(r.i, 17, 600) + 8 + Math.min(180, measureText(r.key, labelSize, t.fontFamily))));
      const beside = !ctx.compact;
      const R = Math.max(20, beside ? Math.min(H / 2 - 4, (W - colW - 44) / 2) : Math.min(W / 2 - 4, (H - n * lineH - 28) / 2));
      const block = beside ? 2 * R + 36 + colW : 2 * R;
      const cx = (W - block) / 2 + R;
      const base = beside ? H / 2 + R : 2 * R + 2;
      const tx = beside ? cx + R + 36 : Math.max(4, (W - colW - 16) / 2) + 16;
      const ys = beside ? dodge(order.map((r) => base - 2 * radius(r, R) + 2), lineH, base - 2 * R - 2 + lineH / 2, base - lineH / 2 + 4) : order.map((_, k) => 2 * R + 20 + k * lineH + lineH / 2);
      order.forEach((r, k) => {
        const rr = radius(r, R);
        marks[r.i] = {
          cx,
          cy: base - rr,
          r: rr,
          inside: null,
          number: { x: tx, y: ys[k], size: 17, align: "left" },
          label: { x: tx + numberW(r.i, 17, 600) + 8, y: ys[k], lines: [truncateText(r.key, Math.max(40, W - (tx + numberW(r.i, 17, 600) + 8) - 2), labelSize, t.fontFamily)], align: "left" },
          leader: beside ? [[cx, base - 2 * rr], [tx - 22, ys[k]], [tx - 6, ys[k]]] : undefined,
        };
      });
    } else if (column) {
      // Phone: circles down the left on one centre line, number and label to the right of each.
      const textX = (rmax: number) => 2 * rmax + 16;
      const layoutAt = (rmax: number) => {
        const tw = Math.max(60, W - textX(rmax) - 2);
        return rows.map((r) => {
          const wrapped = wrapText(r.key, tw, labelSize, t.fontFamily);
          const lines = wrapped.slice(0, 3).map((line, li) => (li === 2 && wrapped.length > 3 ? truncateText(`${line} …`, tw, labelSize, t.fontFamily) : line));
          const textH = outSize * 1.1 + lines.length * labelLH;
          return { lines, h: Math.max(2 * radius(r, rmax), textH) + 12 };
        });
      };
      let lo = 8;
      let hi = Math.min(W * 0.24, H / 2);
      for (let k = 0; k < 20; k++) {
        const mid = (lo + hi) / 2;
        if (layoutAt(mid).reduce((s, c) => s + c.h, 0) <= H) lo = mid;
        else hi = mid;
      }
      const cells = layoutAt(lo);
      const totalH = cells.reduce((s, c) => s + c.h, 0);
      let y = Math.max(0, (H - totalH) / 2);
      const tx = textX(lo);
      deco.push({ type: "line", shape: { x1: lo + 1, y1: y + cells[0].h / 2, x2: lo + 1, y2: y + totalH - cells[n - 1].h / 2 }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 4], lineCap: "round" } });
      rows.forEach((r, i) => {
        const c = cells[i];
        const mid = y + c.h / 2;
        const textH = outSize * 1.1 + c.lines.length * labelLH;
        marks.push({ cx: lo + 1, cy: mid, r: radius(r, lo), inside: null, number: { x: tx, y: mid - textH / 2 + outSize * 0.55, size: outSize, align: "left" }, label: { x: tx, y: mid - textH / 2 + outSize * 1.1 + labelLH / 2, lines: c.lines, align: "left" } });
        y += c.h;
      });
    } else {
      // Row or steps: one cell per circle, as wide as its circle or its label needs.
      const gap = 22;
      const layoutAt = (rmax: number) => {
        const rs = rows.map((r) => radius(r, rmax));
        const fits = rows.map((_, i) => inside(i, rs[i]));
        const share = (W - gap * (n - 1)) / n;
        const cells = rows.map((r, i) => {
          const maxW = Math.max(2 * rs[i], Math.min(170, share));
          const wrapped = wrapText(r.key, maxW, labelSize, t.fontFamily);
          // A label cut at three lines says so with an ellipsis.
          const lines = wrapped.slice(0, 3).map((s, li) => truncateText(li === 2 && wrapped.length > 3 ? `${s} …` : s, maxW, labelSize, t.fontFamily));
          const w = Math.max(2 * rs[i], ...lines.map((s) => measureText(s, labelSize, t.fontFamily)), fits[i] ? 0 : numberW(i, outSize, 600));
          return { lines, w };
        });
        const above = Math.max(0, ...rows.map((_, i) => (fits[i] ? 0 : outSize * 1.2 + 4 - (steps ? 2 * (rmax - rs[i]) : rmax - rs[i]))));
        const labelH = Math.max(...cells.map((c) => c.lines.length)) * labelLH + 12;
        return { rs, fits, cells, above, labelH, width: cells.reduce((s, c) => s + c.w, 0) + gap * (n - 1), height: above + 2 * rmax + labelH };
      };
      let lo = 6;
      let hi = H / 2;
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2;
        const l = layoutAt(mid);
        if (l.width <= W && l.height <= H) lo = mid;
        else hi = mid;
      }
      const l = layoutAt(lo);
      // Spare width is shared between the gaps so the row spans the frame without stretching the circles.
      const spare = Math.max(0, W - l.width);
      const extra = n > 1 ? Math.min(60, spare / (n - 1)) : 0;
      let x = (W - l.width - extra * (n - 1)) / 2;
      const top = Math.max(0, (H - l.height) / 2) + l.above;
      const line = steps ? top + 2 * lo : top + lo;
      if (!steps) deco.push({ type: "line", shape: { x1: x + l.cells[0].w / 2, y1: line, x2: W - x - l.cells[n - 1].w / 2, y2: line }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 4], lineCap: "round" } });
      else deco.push({ type: "line", shape: { x1: x, y1: line + 0.5, x2: W - x, y2: line + 0.5 }, style: { stroke: t.axis, lineWidth: 1 } });
      rows.forEach((_, i) => {
        const c = l.cells[i];
        const cx = x + c.w / 2;
        const cy = steps ? line - l.rs[i] : line;
        marks.push({ cx, cy, r: l.rs[i], inside: l.fits[i], number: l.fits[i] ? null : { x: cx, y: cy - l.rs[i] - 4 - outSize * 0.55, size: outSize, align: "center" }, label: { x: cx, y: top + 2 * lo + 12 + labelLH / 2, lines: c.lines, align: "center" } });
        x += c.w + gap + extra;
      });
    }

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const r = rows[i];
      const m = marks[i];
      if (!r || !m) return null;
      const fill = fillOf(r);
      const ink = inkOn(fill);
      const strong = ctx.selected(r.key);
      const lit = anyHighlight && !ctx.dimmed(r.key);
      const delay = Math.min(500, i * 90);
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 320, delay: delay + 280 };
      const children: any[] = [
        { type: "circle", shape: { cx: m.cx, cy: m.cy, r: m.r, enterFrom: { r: 0 } }, style: { fill, ...(nested ? { stroke: t.surface, lineWidth: 1.5 } : null) }, emphasis: { style: { fill: mix(fill, ink, 0.12) } }, blur: fade, transition: ["shape", "style"], enterAnimation: { duration: 600, delay, easing: "cubicOut" } },
      ];
      if (m.inside) {
        const block = m.inside.size * 1.05 + (m.inside.icon ? m.inside.icon + 4 : 0);
        let y = m.cy - block / 2;
        if (m.inside.icon) {
          const icon = resolveIcon(iconOf(r));
          const w = icon.aspect >= 1 ? m.inside.icon : m.inside.icon * icon.aspect;
          const h = icon.aspect >= 1 ? m.inside.icon / icon.aspect : m.inside.icon;
          children.push({ type: "path", silent: true, shape: { pathData: icon.d, x: m.cx - w / 2, y: y + (m.inside.icon - h) / 2, width: w, height: h, layout: "center" }, style: { fill: ink, opacity: 0.9, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
          y += m.inside.icon + 4;
        }
        children.push({ type: "text", silent: true, style: { ...numberText(i, m.inside.size, m.inside.weight, ink), x: m.cx, y: y + m.inside.size * 0.525, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      }
      if (m.leader) children.push({ type: "polyline", silent: true, shape: { points: m.leader }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 3], lineCap: "round", fill: "none", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      if (nested && !m.leader && m.number) children.push({ type: "circle", silent: true, shape: { cx: m.number.x - 10, cy: m.number.y, r: 4 }, style: { fill }, blur: fade });
      if (m.number) children.push({ type: "text", silent: true, style: { ...numberText(i, m.number.size, lit ? 700 : 600, strong ? t.ink : t.muted), x: m.number.x, y: m.number.y, align: m.number.align, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      if (m.label) m.label.lines.forEach((line, li) => children.push({ type: "text", silent: true, style: { text: line, x: m.label!.x, y: m.label!.y + li * labelLH, fill: strong ? t.inkSecondary : t.muted, fontSize: labelSize, fontWeight: lit ? 600 : 400, fontFamily: t.fontFamily, align: m.label!.align, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear }));
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    const sorted = [...rows].sort((a, b) => b.value - a.value);
    // Nested circles overlap, so the largest is drawn first and the smallest stays on top and hoverable.
    const drawOrder = nested ? sorted : rows;
    const indexOf = new Map(drawOrder.map((r, k) => [k, r.i]));
    const ratio = n > 1 ? sorted[0].value / sorted[n - 1].value : 1;
    return {
      alt: n
        ? `${n} circles sized by ${p.value}${nested ? ", drawn inside each other" : ""}: ${rows.map((r) => `${ctx.fmt(r.value)}${unit} ${r.key}`).join("; ")}.${n > 1 ? ` The largest is ${ratio >= 10 ? Math.round(ratio) : Math.round(ratio * 10) / 10} times the smallest.` : ""}`
        : `Circles of ${p.value}: no positive values.`,
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const r = rows[indexOf.get(d.dataIndex) ?? -1];
            if (!r || d.seriesId !== "circles") return "";
            return tooltipHtml(ctx, r.key, [{ name: p.value, value: `${ctx.fmt(r.value)}${unit}`, color: fillOf(r) }, ...(r.value < vmax ? [{ name: "Of the largest", value: ctx.formatter({ style: "percent", maximumFractionDigits: 0 })(r.value / vmax) }] : [])]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "deco", type: "custom" as const, coordinateSystem: "none" as any, silent: true, z: 1, tooltip: { show: false }, renderItem: (() => ({ type: "group", silent: true, children: deco })) as any, data: [0] },
          {
            id: "circles",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            z: 2,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: ((params: any) => renderItem({ ...params, dataIndex: indexOf.get(params.dataIndex) ?? params.dataIndex })) as any,
            data: drawOrder.map((r) => ({ id: r.key, name: r.key, value: [r.value] })),
          },
        ],
      },
    };
  },
});
