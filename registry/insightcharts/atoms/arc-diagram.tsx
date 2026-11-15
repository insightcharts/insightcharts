"use client";

import { CustomChart } from "echarts/charts";
import { alpha, mix, defineChart, measureText, truncateText, morph, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";
import { _posterPalette } from "@/components/insightcharts/atoms/_poster-colors";

export interface ArcDiagramProps {
  /** Field naming one end of each connection. */
  from: string;
  /** Field naming the other end. */
  to: string;
  /** Value field: arc thickness. Omit to count rows. Rows joining the same pair are summed, in either direction. */
  value?: string;
  /** Entity names in the order they sit on the line. Entities not listed follow in data order. */
  order?: string[];
  /** `"horizontal"`: line along the bottom, arcs above. `"vertical"`: line down the left, arcs to the right. Default `"auto"`: vertical on narrow screens. */
  orientation?: "auto" | "horizontal" | "vertical";
  /** `"series"`: each arc takes the colour of its first entity; past the size of the theme's palette the extra colours are derived from the theme's own. `"none"`: every arc in the accent. Default: series while the entities fit the palette (at most 8), none beyond. */
  colorBy?: "series" | "none";
  /** Print values at the top of the arcs, largest first, wherever they do not collide. The values that do not fit are printed while their entity is hovered or selected. Default true. */
  arcLabels?: boolean;
  /** Display names for entity keys. */
  names?: Record<string, string>;
}

type _ArcLink = { a: number; b: number; value: number };

function _arcData(rows: Record<string, unknown>[], p: Pick<ArcDiagramProps, "from" | "to" | "value" | "order">): { keys: string[]; links: _ArcLink[] } {
  const seen: string[] = [];
  const pairs = new Map<string, { s: string; t: string; value: number }>();
  for (const r of rows) {
    const s = String(r[p.from] ?? "");
    const tg = String(r[p.to] ?? "");
    const v = p.value ? toNumber(r[p.value]) : 1;
    if (!s || !tg || s === tg || Number.isNaN(v) || v <= 0) continue;
    for (const k of [s, tg]) if (!seen.includes(k)) seen.push(k);
    const id = s < tg ? `${s}\u0000${tg}` : `${tg}\u0000${s}`;
    const hit = pairs.get(id);
    if (hit) hit.value += v;
    else pairs.set(id, { s, t: tg, value: v });
  }
  const rank = (k: string) => {
    const at = p.order ? p.order.indexOf(k) : -1;
    return at === -1 ? Infinity : at;
  };
  const keys = seen.map((k, i) => ({ k, i })).sort((x, y) => rank(x.k) - rank(y.k) || x.i - y.i).map((d) => d.k);
  const links = [...pairs.values()].map((l) => {
    const i = keys.indexOf(l.s);
    const j = keys.indexOf(l.t);
    return { a: Math.min(i, j), b: Math.max(i, j), value: l.value };
  });
  return { keys, links };
}

/**
 * Entities in a fixed order on one line, with an arc for every connected pair. Long arcs join
 * distant entities, thick arcs strong ties; hovering an entity picks out all of its arcs.
 */
export const ArcDiagram = defineChart<ArcDiagramProps>({
  name: "arc-diagram",
  title: "Arc diagram",
  category: "poster",
  description: "Places entities in order on a line and joins each related pair with a semicircular arc whose thickness is the value of the connection; dots are sized by each entity's total.",
  whenToUse: "Connections among up to about 20 entities that have a meaningful order (stops on a line, chapters, age groups, teams by size): trips between stations, trade between neighbours, characters sharing scenes.",
  avoid: "Flows with a direction through stages (use sankey-chart); one source splitting into parts (use fan-flow); a full matrix of every pair where exact values matter (use heatmap); more than about 20 entities or 60 connections (use heatmap).",
  use: [CustomChart],
  defaults: { orientation: "auto", arcLabels: true },
  selectField: (p) => p.from,
  markCount: (rows) => rows.length * 2,
  height: (p, rows, width) => {
    const { keys, links } = _arcData(rows, p);
    const n = keys.length;
    if (!width) return Math.min(620, Math.max(360, n * 30 + 100));
    // Down the side on a phone: one row per entity.
    const nameW = Math.max(0, ...keys.map((k) => measureText(p.names?.[k] ?? k, 12, "sans-serif", 600)));
    const longest = Math.max(0, ...links.map((l) => l.b - l.a)) / Math.max(1, n - 1);
    // Down the side on a phone: one row per entity, stretched (up to 56px a row) until the longest arc is a
    // semicircle that uses the width left beside the names.
    if (p.orientation === "vertical" || (p.orientation !== "horizontal" && width < 480)) {
      const depth = width - Math.min(nameW, width * 0.34) - 100;
      return Math.round(Math.min(760, Math.max(320, n * 34 + 24, Math.min(n * 56, longest ? (2 * depth) / longest + 26 : 0))));
    }
    // Along the bottom: room for the longest arc to be a true semicircle, plus the labels under the line.
    const roughStep = n > 1 ? (width - 40) / (n - 1) : width;
    const labelH = nameW <= roughStep - 10 ? 38 : nameW <= roughStep * 2 - 12 ? 70 : Math.min(nameW, 120) + 44;
    const edge = Math.min(Math.max(16, nameW / 2 + 2), width * 0.12);
    return Math.round(Math.min(560, Math.max(300, (longest * (width - 2 * edge)) / 2 + labelH + 56)));
  },
  props: [
    { name: "from", type: "string", required: true, description: "Field naming one end of each connection. With `select: true` a click selects the entity under this field name, so inside `<InsightData>` other charts are filtered on `from`; pass `select: \"<field>\"` to link on the field that holds the entity in the shared rows." },
    { name: "to", type: "string", required: true, description: "Field naming the other end." },
    { name: "value", type: "string", description: "Value field: arc thickness. Omit to count rows. Rows joining the same pair are summed, in either direction." },
    { name: "order", type: "string[]", description: "Entity names in the order they sit on the line. Entities not listed follow in data order." },
    { name: "orientation", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "Line along the bottom with arcs above, or down the left with arcs to the right. Auto turns vertical on narrow screens." },
    { name: "colorBy", type: '"series" | "none"', description: "`series`: each arc in the colour of its first entity; past the size of the theme's palette the extra colours are derived from the theme's own. `none`: every arc in the accent. Default: series while the entities fit the palette (at most 8), none beyond." },
    { name: "arcLabels", type: "boolean", default: "true", description: "Print values at the top of the arcs, largest first, wherever they do not collide. The values that do not fit are printed while their entity is hovered or selected, and every value is in the tooltip." },
    { name: "names", type: "Record<string, string>", description: "Display names for entity keys." },
  ],
  example: {
    type: "arc-diagram",
    data: [
      ["Harbour", "Market", 4200], ["Harbour", "Quay", 900], ["Quay", "Market", 1300], ["Market", "Town Hall", 2600], ["Market", "University", 3100],
      ["Town Hall", "University", 1500], ["Town Hall", "Hospital", 1100], ["University", "Park", 800], ["University", "Airport", 1900], ["Park", "Hospital", 600],
      ["Hospital", "Stadium", 700], ["Stadium", "Airport", 1200], ["Harbour", "Airport", 2300], ["Market", "Stadium", 1700], ["Quay", "University", 500],
    ].map(([a, b, trips]) => ({ a, b, trips })),
    from: "a",
    to: "b",
    value: "trips",
    order: ["Harbour", "Quay", "Market", "Town Hall", "University", "Park", "Hospital", "Stadium", "Airport"],
    colorBy: "none",
    format: "integer",
    title: "Harbour and Market stations exchanged 4,200 trips a day",
    subtitle: "Daily trips between pairs of stations on one tram line, both directions; dots show each station's total",
    note: "Illustrative figures for an invented line.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const { keys, links } = _arcData(ctx.rows, p);
    const n = keys.length;
    const nameOf = (i: number) => p.names?.[keys[i]] ?? keys[i];
    const totals = keys.map((_k, i) => links.reduce((s, l) => s + (l.a === i || l.b === i ? l.value : 0), 0));
    const maxTotal = Math.max(...totals, 0) || 1;
    const maxValue = Math.max(...links.map((l) => l.value), 0) || 1;
    const fmt = ctx.fmt;
    const W = ctx.width;
    const H = ctx.height;
    const vertical = p.orientation === "vertical" || (p.orientation !== "horizontal" && ctx.compact);

    // Identity colours are never cycled: a small poster palette may hold only 4 or 5.
    const hues = Math.min(8, t.categorical.length);
    // An explicit `colorBy: "series"` past the palette size takes further steps derived from the theme's own colours.
    const derived = p.colorBy === "series" && n > hues ? _posterPalette(t, n) : null;
    const bySeries = derived != null || (p.colorBy ?? (n <= hues ? "series" : "none")) === "series";
    const hue = (i: number) => (derived ? derived[i] : ctx.color(keys[i], i));
    const lit = (l: _ArcLink) => (ctx.dimmed(keys[l.a]) ? (ctx.dimmed(keys[l.b]) ? -1 : l.b) : l.a);
    const baseOf = (l: _ArcLink) => {
      if (ctx.highlight.length) {
        const i = lit(l);
        return i === -1 ? t.context : ctx.color(keys[i], i);
      }
      return bySeries ? hue(l.a) : ctx.color();
    };
    const live = (l: _ArcLink) => ctx.selected(keys[l.a]) || ctx.selected(keys[l.b]);
    const nodeColor = (i: number) => {
      const base = ctx.highlight.length ? (ctx.dimmed(keys[i]) ? t.context : ctx.color(keys[i], i)) : bySeries ? hue(i) : t.ink;
      return ctx.selected(keys[i]) ? base : mix(t.surface, base, 0.3);
    };

    // Geometry along the line (`u`) and away from it (`v`), mapped to x/y by orientation.
    const nameSize = 12;
    const totalText = totals.map((v) => fmt(v));
    const fullNameW = Math.ceil(Math.max(0, ...keys.map((_k, i) => measureText(nameOf(i), nameSize, t.fontFamily, 600))));
    const totalW = Math.ceil(Math.max(0, ...totalText.map((s) => measureText(s, 11, t.fontFamily))));
    let lineAt: number; // position of the line across the free axis
    let u0: number;
    let u1: number;
    let depth: number; // room for the arcs
    let labelMode: "flat" | "stagger" | "rotated" | "side";
    let nameW = fullNameW;
    const rCap = vertical ? 9 : 14;
    if (vertical) {
      nameW = Math.min(fullNameW, Math.round(W * 0.34));
      lineAt = nameW + 6 + totalW + 10 + rCap;
      u0 = rCap + 4;
      u1 = H - rCap - 4;
      depth = W - lineAt - 34;
      labelMode = "side";
    } else {
      const roughStep = n > 1 ? (W - 40) / (n - 1) : W;
      const need = Math.max(fullNameW, totalW);
      labelMode = need <= roughStep - 10 ? "flat" : need <= roughStep * 2 - 12 ? "stagger" : "rotated";
      if (labelMode === "rotated") nameW = Math.min(fullNameW, 120);
      const labelH = labelMode === "flat" ? 38 : labelMode === "stagger" ? 70 : nameW + 8 + totalW + 4;
      // The end labels are centred on the end dots, so the line stops short of the edges by half a label.
      const edge = labelMode === "rotated" ? rCap + 2 : Math.min(Math.max(rCap + 2, need / 2 + 2), W * 0.12);
      u0 = edge;
      u1 = W - edge;
      lineAt = H - labelH - rCap - 4;
      depth = lineAt - 20;
    }
    const step = n > 1 ? (u1 - u0) / (n - 1) : 0;
    const at = (i: number) => (n > 1 ? u0 + i * step : (u0 + u1) / 2);
    const rMax = Math.max(4, Math.min(rCap, step * 0.3));
    const radius = (i: number) => Math.max(2.5, rMax * Math.sqrt(totals[i] / maxTotal));
    const maxLW = Math.max(4, Math.min(vertical ? 14 : 22, step * 0.34));
    const lw = (l: _ArcLink) => Math.max(1.25, (l.value / maxValue) * maxLW);
    // True semicircles when there is room; otherwise every arc is flattened by the same factor.
    const maxR = Math.max(1, ...links.map((l) => (at(l.b) - at(l.a)) / 2 + lw(l) / 2));
    const squash = Math.min(1, Math.max(0.2, depth / maxR));
    const names = keys.map((_k, i) => truncateText(nameOf(i), nameW, nameSize, t.fontFamily, 600));

    const arcPath = (l: _ArcLink) => {
      const ru = (at(l.b) - at(l.a)) / 2;
      const rv = ru * squash;
      return vertical ? `M${lineAt} ${at(l.a)}A${rv} ${ru} 0 0 1 ${lineAt} ${at(l.b)}` : `M${at(l.a)} ${lineAt}A${ru} ${rv} 0 0 1 ${at(l.b)} ${lineAt}`;
    };

    // Value labels sit at the top of the arcs. Strongest first; one that would touch an earlier label is left to the tooltip.
    const bySize = links.map((_l, k) => k).sort((x, y) => links[y].value - links[x].value);
    const zOf = new Map(bySize.map((k, order) => [k, order]));
    type Box = { x: number; y: number; w: number; h: number };
    const boxes: Box[] = [];
    const arcLabel = new Map<number, { x: number; y: number; text: string }>();
    const labelBox = (k: number, clamp = false) => {
      const l = links[k];
      const text = fmt(l.value);
      const w = measureText(text, 11, t.fontFamily, 600) + 6;
      const mid = (at(l.a) + at(l.b)) / 2;
      const reach = ((at(l.b) - at(l.a)) / 2) * squash + lw(l) / 2 + 3;
      const box: Box = vertical ? { x: lineAt + reach, y: mid - 7, w, h: 14 } : { x: mid - w / 2, y: lineAt - reach - 14, w, h: 14 };
      const outside = box.x < 0 || box.x + box.w > W || box.y < 0;
      // A hover label that would leave the plot is pulled back inside; a standing one is dropped instead.
      if (clamp) {
        box.x = Math.max(0, Math.min(W - w, box.x));
        box.y = Math.max(0, box.y);
      }
      return { box, outside, text, label: { x: vertical ? box.x + 3 : box.x + w / 2, y: box.y + 7, text } };
    };
    const hits = (box: Box, others: Box[]) => others.some((o) => box.x < o.x + o.w && o.x < box.x + box.w && box.y < o.y + o.h && o.y < box.y + box.h);
    if (p.arcLabels !== false) {
      for (const k of bySize) {
        const { box, label, outside } = labelBox(k);
        if (outside || hits(box, boxes)) continue;
        boxes.push(box);
        arcLabel.set(k, label);
      }
    }
    // The values that found no room are printed only while one of their entities is hovered or selected:
    // per entity, its own arcs' values, strongest first, wherever they clear each other.
    const picking = keys.some((key) => !ctx.selected(key));
    const extraLabels = (i: number) => {
      if (p.arcLabels === false) return [];
      const own: Box[] = [];
      const out: { x: number; y: number; text: string; standing?: boolean }[] = [];
      const mine = bySize.filter((k) => links[k].a === i || links[k].b === i);
      for (const k of mine) {
        if (!arcLabel.has(k)) continue;
        own.push(labelBox(k).box);
        // A standing label belongs to the arc's first entity and dims with it; the far entity repeats it for its own hover.
        if (links[k].b === i) out.push({ ...arcLabel.get(k)!, standing: true });
      }
      for (const k of mine) {
        if (arcLabel.has(k)) continue;
        const { box, label } = labelBox(k, true);
        if (hits(box, own)) continue;
        own.push(box);
        out.push(label);
      }
      return out;
    };

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      if (i >= n) return null;
      const children: any[] = [];
      // Value labels come and go with the data, so they go last: the arcs, dot and name keep their places in the
      // list and a data change tweens them instead of redrawing.
      const valueLabels: any[] = [];
      links.forEach((l, k) => {
        if (l.a !== i && l.b !== i) return;
        const base = baseOf(l);
        const grey = ctx.highlight.length > 0 && lit(l) === -1;
        const stroke = live(l) ? base : alpha(base, 0.2);
        const shape = { pathData: arcPath(l) };
        const z2 = (grey ? 0 : 200) + (zOf.get(k) ?? 0);
        if (l.a === i) {
          children.push({ type: "path", shape, z2, style: { stroke, lineWidth: lw(l), fill: "none", opacity: grey ? 0.7 : 0.82, enterFrom: { opacity: 0 } }, enterAnimation: { duration: 500, delay: (zOf.get(k) ?? 0) * 30 }, emphasis: { style: { opacity: 1 } }, transition: ["style"] });
          const label = arcLabel.get(k);
          if (label) valueLabels.push({ type: "text", silent: true, z2: 900, style: { x: label.x, y: label.y + 0.5, text: label.text, fill: grey ? t.muted : t.inkSecondary, fontSize: 11, fontWeight: 600, fontFamily: t.fontFamily, align: vertical ? "left" : "center", verticalAlign: "middle", stroke: t.surface, lineWidth: 3, opacity: live(l) ? 1 : 0.4 } });
        } else {
          // The far entity's copy of the arc: invisible until that entity is hovered, when it redraws the arc at full strength
          // over the faded original. This is what lets one hover pick out every arc of an entity.
          children.push({ type: "path", shape, silent: true, z2: 600, style: { stroke: base, lineWidth: lw(l), fill: "none", opacity: 0 }, emphasis: { style: { opacity: 1 } }, blur: { style: { opacity: 0 } } });
        }
      });
      const shown = picking && ctx.selected(keys[i]);
      for (const label of extraLabels(i)) {
        valueLabels.push({ type: "text", silent: true, z2: 950, style: { x: label.x, y: label.y + 0.5, text: label.text, fill: t.ink, fontSize: 11, fontWeight: 600, fontFamily: t.fontFamily, align: vertical ? "left" : "center", verticalAlign: "middle", stroke: t.surface, lineWidth: 3, opacity: shown && !label.standing ? 1 : 0 }, emphasis: { style: { opacity: 1 } }, blur: { style: { opacity: 0 } } });
      }
      const fill = nodeColor(i);
      const dim = ctx.dimmed(keys[i]);
      const opacity = ctx.selected(keys[i]) ? 1 : 0.4;
      const r = radius(i);
      const u = at(i);
      children.push({ type: "circle", z2: 1000, shape: vertical ? { cx: lineAt, cy: u, r } : { cx: u, cy: lineAt, r }, style: { fill, stroke: t.surface, lineWidth: 2 }, transition: ["shape", "style"] });
      const nameStyle = { text: names[i], fill: dim ? t.muted : t.ink, fontSize: nameSize, fontWeight: dim ? 400 : 600, fontFamily: t.fontFamily, opacity };
      const totalStyle = { text: totalText[i], fill: t.muted, fontSize: 11, fontFamily: t.fontFamily, opacity };
      if (labelMode === "side") {
        children.push({ type: "text", silent: true, z2: 1001, style: { ...nameStyle, x: lineAt - rCap - 10 - totalW - 6, y: u + 0.5, align: "right", verticalAlign: "middle" } });
        children.push({ type: "text", silent: true, z2: 1001, style: { ...totalStyle, x: lineAt - rCap - 10, y: u + 0.5, align: "right", verticalAlign: "middle" } });
      } else if (labelMode === "rotated") {
        const y = lineAt + rCap + 6;
        children.push({ type: "text", silent: true, z2: 1001, x: u, y, rotation: -Math.PI / 2, style: { ...nameStyle, verticalAlign: "middle" } });
        children.push({ type: "text", silent: true, z2: 1001, x: u, y: y + measureText(names[i], nameSize, t.fontFamily, dim ? 400 : 600) + 8, rotation: -Math.PI / 2, style: { ...totalStyle, verticalAlign: "middle" } });
      } else {
        const drop = labelMode === "stagger" && i % 2 === 1 ? 32 : 0;
        const y = lineAt + rCap + 8 + drop;
        if (drop) children.push({ type: "line", silent: true, shape: { x1: u, y1: lineAt + r + 3, x2: u, y2: y - 3 }, style: { stroke: t.axis, lineWidth: 1, opacity } });
        // End labels stay centred on their dots unless that would push them off the edge.
        const half = Math.max(measureText(names[i], nameSize, t.fontFamily, 600), measureText(totalText[i], 11, t.fontFamily)) / 2;
        const x = Math.min(W - half, Math.max(half, u));
        children.push({ type: "text", silent: true, z2: 1001, style: { ...nameStyle, x, y, align: "center", verticalAlign: "top" } });
        children.push({ type: "text", silent: true, z2: 1001, style: { ...totalStyle, x, y: y + 16, align: "center", verticalAlign: "top" } });
      }
      // The dots are small, so each entity's name and total take the hover and the click too, through an unpainted box.
      const labelW = measureText(names[i], nameSize, t.fontFamily, 600);
      const hit =
        labelMode === "side"
          ? { x: lineAt - rCap - 10 - totalW - 6 - labelW - 2, y: u - Math.min(10, step / 2), width: labelW + 6 + totalW + 4 + rCap + 10, height: Math.min(20, step) }
          : labelMode === "rotated"
            ? { x: u - Math.min(9, step / 2), y: lineAt, width: Math.min(18, step), height: rCap + 6 + labelW + 8 + totalW }
            : { x: u - Math.min(Math.max(labelW, totalW) / 2 + 2, step / 2), y: lineAt, width: Math.min(Math.max(labelW, totalW) + 4, step), height: rCap + 8 + (labelMode === "stagger" && i % 2 === 1 ? 32 : 0) + 30 };
      children.push({ type: "rect", z2: 999, shape: hit, style: { fill: "rgba(0,0,0,0)" }, blur: { style: { opacity: 1 } } });
      children.push(...valueLabels);
      // Custom shapes have no built-in blur: state it, so hovering one mark dims the rest.
      for (const c of children) c.blur ??= { style: { opacity: c.type === "text" ? 0.35 : 0.2 } };
      // In a custom series the hover focus is declared on the returned element. It stays on with `select`: core
      // downplays before it pushes the rebuilt option, so a click leaves no mark stuck in its blur state.
      return { type: "group", focus: "self", children };
    };

    // The line itself: a dotted rule the dots sit on.
    const renderLine = () => ({
      type: "line",
      silent: true,
      shape: vertical ? { x1: lineAt, y1: u0, x2: lineAt, y2: u1 } : { x1: u0, y1: lineAt, x2: u1, y2: lineAt },
      style: { stroke: t.axis, lineWidth: 1.5, lineDash: [0.5, 4], lineCap: "round" },
    });

    const strongest = bySize.slice(0, 3).map((k) => links[k]);
    const busiest = totals.reduce((best, v, i) => (v > totals[best] ? i : best), 0);
    const focus = ctx.highlight.length ? keys.map((_k, i) => i).filter((i) => !ctx.dimmed(keys[i])) : [];
    const measure = p.value ?? "connections";
    return {
      legend: [],
      alt: `Arc diagram of ${measure} between ${links.length} pairs of ${n} entities in the order ${keys.map((_k, i) => nameOf(i)).join(", ")}.${strongest.length ? ` Strongest: ${strongest.map((l) => `${nameOf(l.a)} and ${nameOf(l.b)} (${fmt(l.value)})`).join(", ")}.` : ""}${n ? ` Largest total: ${nameOf(busiest)} (${totalText[busiest]}).` : ""}${focus.length ? ` Highlighted: ${focus.map((i) => `${nameOf(i)}, ${links.filter((l) => l.a === i || l.b === i).length} connections totalling ${totalText[i]}`).join("; ")}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; an empty off-canvas cartesian series takes them instead.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const i = d.dataIndex;
            if (d.seriesId !== "arcs" || i >= n) return "";
            const mine = links.filter((l) => l.a === i || l.b === i).sort((x, y) => y.value - x.value);
            const rows = mine.slice(0, 8).map((l) => ({ name: nameOf(l.a === i ? l.b : l.a), value: fmt(l.value), color: live(l) ? baseOf(l) : alpha(baseOf(l), 0.2) }));
            if (mine.length > 8) rows.push({ name: `${mine.length - 8} more`, value: fmt(mine.slice(8).reduce((s, l) => s + l.value, 0)), color: t.context });
            return tooltipHtml(ctx, `${nameOf(i)} · ${totalText[i]} ${measure}`, rows);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "line", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderLine as any, data: [0], z: 1 },
          {
            id: "arcs",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            // ECharts rebuilds every element of a custom series when universal transition is on, and its path morph
            // scrambles a group of strokes and labels. With it off the elements are kept and each one tweens through
            // its own `transition`, which is what a data change needs here.
            universalTransition: { enabled: false },
            z: 2,
            dimensions: ["total"],
            encode: { tooltip: [0] },
            emphasis: { focus: "self" as const },
            renderItem: renderItem as any,
            data: keys.map((key, i) => ({ id: key, name: key, value: [totals[i]] })),
          },
        ],
      },
    };
  },
});
