import { CustomChart } from "echarts/charts";
import { alpha, inkOn, mix } from "../core/color";
import { defineChart } from "../core/define";
import type { FormatSpec } from "../core/format";
import { measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { toNumber } from "../data/transform";

export interface BubbleNetworkLink {
  /** Name of the circle the line starts at. */
  from: string;
  /** Name of the circle the line ends at. */
  to: string;
  /** Optional strength: sets the line width (1 to 6 px) and is printed on the line. */
  value?: number;
}

export interface BubbleNetworkProps {
  /** Name field: one circle per row. */
  name: string;
  /** Value field: circle area. */
  value: string;
  /** Horizontal position field, 0 (left) to 100 (right). With `y`, places the circles by hand. */
  x?: string;
  /** Vertical position field, 0 (top) to 100 (bottom). */
  y?: string;
  /** Lines between circles, by name. */
  links?: BubbleNetworkLink[];
  /** Short tag attached to the highlighted circle, e.g. "Joined 2024". */
  tag?: string;
  /** How to print link values. */
  linkFormat?: FormatSpec;
  /** Print link values on the lines. Default: on when any link has a value. */
  linkLabels?: boolean;
  /** When `x` and `y` are absent: `"ring"` spaces the circles round an ellipse in data order, `"hub"` also moves the most-connected circle to the middle. Default: `"hub"` when one circle links to most of the others. */
  layout?: "ring" | "hub";
}

/**
 * A few sized circles and the lines between them. Positions are given or follow a fixed
 * rule, so the picture never changes between renders and nothing is simulated.
 */
export const BubbleNetwork = defineChart<BubbleNetworkProps>({
  name: "bubble-network",
  title: "Bubble network",
  category: "poster",
  description: "Draws a small set of circles sized by value and joined by thin lines, with one circle highlighted and tagged.",
  whenToUse: "Showing which of up to about 12 named things are connected, and how big each is: trade blocs, route maps between hubs, partnerships, shared ownership. Give `x` and `y` to place the circles by hand, for example roughly geographically.",
  avoid: "Flows with magnitudes between stages (use sankey-chart); more than about 12 circles or a dense web of links (use heatmap as a matrix, or data-table); comparison of the sizes alone (use bar-chart or circle-pack).",
  use: [CustomChart],
  defaults: {},
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "nodes" ? params.name : null),
  // A phone column is narrow, so many circles need more height to keep their labels apart.
  height: (_p, rows, width) => (width && width < 480 && rows.length > 8 ? 560 : rows.length <= 5 ? 400 : 480),
  props: [
    { name: "name", type: "string", required: true, description: "Name field: one circle per row." },
    { name: "value", type: "string", required: true, description: "Value field: circle area." },
    { name: "x", type: "string", description: "Horizontal position field, 0 (left) to 100 (right). With `y`, places the circles by hand." },
    { name: "y", type: "string", description: "Vertical position field, 0 (top) to 100 (bottom)." },
    { name: "links", type: "{ from: string; to: string; value?: number }[]", description: "Lines between circles, by name. `value` sets the line width and is printed on the line." },
    { name: "tag", type: "string", description: 'Short tag attached to the highlighted circle, e.g. "Joined 2024".' },
    { name: "linkFormat", type: "FormatSpec", description: "How to print link values." },
    { name: "linkLabels", type: "boolean", description: "Print link values on the lines. Default: on when any link has a value." },
    { name: "layout", type: '"ring" | "hub"', description: 'Without `x` and `y`: "ring" spaces the circles round an ellipse in data order, "hub" also moves the most-connected circle to the middle. Default: "hub" when one circle links to most of the others.' },
  ],
  example: {
    type: "bubble-network",
    theme: "ocean",
    data: [
      { airport: "Lisbon", m: 34 },
      { airport: "Madrid", m: 60 },
      { airport: "Paris", m: 67 },
      { airport: "Frankfurt", m: 59 },
      { airport: "Rome", m: 41 },
      { airport: "Athens", m: 28 },
      { airport: "Istanbul", m: 76 },
    ],
    name: "airport",
    value: "m",
    links: [
      { from: "Istanbul", to: "Frankfurt" },
      { from: "Istanbul", to: "Paris" },
      { from: "Istanbul", to: "Rome" },
      { from: "Istanbul", to: "Athens" },
      { from: "Istanbul", to: "Madrid" },
      { from: "Istanbul", to: "Lisbon" },
      { from: "Madrid", to: "Lisbon" },
      { from: "Paris", to: "Frankfurt" },
      { from: "Rome", to: "Athens" },
    ],
    highlight: "Istanbul",
    tag: "Busiest",
    format: "{value}m",
    title: "Istanbul handled 76 million passengers in 2023",
    subtitle: "Passengers at seven airports, millions, 2023. Lines show the routes in this example.",
    note: "Rounded passenger figures; the routes drawn are illustrative",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const W = ctx.width;
    const H = ctx.height;
    const fmtLink = ctx.formatter(p.linkFormat);
    type Node = { key: string; value: number; px?: number; py?: number };
    const nodes: Node[] = [];
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (Number.isNaN(v) || v <= 0) continue;
      const px = p.x ? toNumber(r[p.x]) : NaN;
      const py = p.y ? toNumber(r[p.y]) : NaN;
      nodes.push({ key: String(r[p.name] ?? ""), value: v, px: Number.isNaN(px) ? undefined : px, py: Number.isNaN(py) ? undefined : py });
    }
    const n = nodes.length;
    const index = new Map(nodes.map((d, i) => [d.key, i]));
    const links = (p.links ?? []).map((l) => ({ a: index.get(String(l.from)), b: index.get(String(l.to)), value: l.value })).filter((l): l is { a: number; b: number; value: number | undefined } => l.a != null && l.b != null && l.a !== l.b);
    const degree = nodes.map((_, i) => links.filter((l) => l.a === i || l.b === i).length);
    const vmax = Math.max(...nodes.map((d) => d.value), 0) || 1;
    const placed = n > 0 && nodes.every((d) => d.px != null && d.py != null);

    // Unit positions in 0..1, then radii shrink until nothing touches.
    let unit: { x: number; y: number }[];
    let hub = -1;
    if (placed) unit = nodes.map((d) => ({ x: Math.max(0, Math.min(100, d.px!)) / 100, y: Math.max(0, Math.min(100, d.py!)) / 100 }));
    else {
      const top = degree.reduce((a, v, i) => (v > degree[a] ? i : a), 0);
      const isHub = n >= 4 && degree[top] >= Math.max(3, Math.ceil((n - 1) * 0.6));
      if (p.layout === "hub" ? n >= 3 : p.layout !== "ring" && isHub) hub = top;
      const around = nodes.map((_, i) => i).filter((i) => i !== hub);
      unit = nodes.map(() => ({ x: 0.5, y: 0.5 }));
      around.forEach((i, k) => {
        // Start at the top; an even count is turned half a step so no two circles sit on the vertical axis.
        const a = -Math.PI / 2 + ((k + (around.length % 2 === 0 ? 0.5 : 0)) / around.length) * 2 * Math.PI;
        unit[i] = { x: 0.5 + Math.cos(a) / 2, y: 0.5 + Math.sin(a) / 2 };
      });
    }
    const sideRoom = ctx.compact ? 6 : 56;
    const topRoom = ctx.compact ? 34 : 26;
    // Stretch the unit positions along one axis as far as the circles' own radii allow.
    const spanFit = (us: number[], rs: number[], lo: number, hi: number) => {
      const feasible = (span: number) => {
        const min = Math.max(...us.map((u, i) => lo + rs[i] - u * span));
        const max = Math.min(...us.map((u, i) => hi - rs[i] - u * span));
        return min <= max ? (min + max) / 2 : null;
      };
      let a = 0;
      let b = Math.max(0, hi - lo);
      for (let k = 0; k < 22; k++) {
        const mid = (a + b) / 2;
        if (feasible(mid) != null) a = mid;
        else b = mid;
      }
      return { span: a, start: feasible(a) ?? (lo + hi) / 2 };
    };
    let rmax = Math.min(W, H) * (ctx.compact ? 0.19 : 0.17);
    let cs: { x: number; y: number; r: number }[] = [];
    for (let attempt = 0; attempt < 16; attempt++) {
      const rs = nodes.map((d) => Math.max(3, Math.sqrt(d.value / vmax) * rmax));
      const fx = spanFit(unit.map((u) => u.x), rs, sideRoom, W - sideRoom);
      const fy = spanFit(unit.map((u) => u.y), rs, topRoom, H - topRoom);
      cs = nodes.map((_, i) => ({ x: fx.start + unit[i].x * fx.span, y: fy.start + unit[i].y * fy.span, r: rs[i] }));
      let worst = 1;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) worst = Math.min(worst, Math.hypot(cs[i].x - cs[j].x, cs[i].y - cs[j].y) / (cs[i].r + cs[j].r + 10));
      if (worst >= 1 || rmax < 10) break;
      rmax *= Math.max(0.7, worst * 0.98);
    }

    const anyHighlight = ctx.highlight.length > 0;
    const fillOf = (d: Node) => (ctx.selected(d.key) ? ctx.color(d.key) : mix(t.surface, ctx.color(d.key), 0.3));
    const upper = (s: string) => s.toLocaleUpperCase(ctx.locale);

    type Inside = { valueSize: number; weight: number; lines: string[]; nameSize: number };
    const inside = (d: Node, r: number): Inside | null => {
      if (r < 18) return null;
      const text = ctx.fmt(d.value);
      const chord = (dy: number) => (Math.abs(dy) >= r ? 0 : 2 * Math.sqrt(r * r - dy * dy) - Math.max(6, r * 0.16));
      const nameSize = Math.round(Math.max(10, Math.min(13, r * 0.18)));
      // Name and value; failing that the value alone, and the name goes outside.
      for (const withName of [true, false]) {
        let valueSize = Math.max(12, Math.min(44, r * (withName ? 0.5 : 0.6)));
        for (let k = 0; k < 6 && valueSize >= 12; k++) {
          const weight = valueSize >= 22 ? 300 : 600;
          const valueH = valueSize * 1.08;
          const lines = withName ? wrapText(upper(d.key), chord(valueH / 2 + nameSize * 0.6) - 2, nameSize, t.fontFamily, 700) : [];
          const block = valueH + (lines.length ? 2 + lines.length * nameSize * 1.25 : 0);
          const valueY = -block / 2 + valueH / 2;
          if (lines.length <= (r >= 60 ? 3 : 2) && block <= r * 1.7 && measureText(text, valueSize, t.displayFamily, weight) <= chord(Math.abs(valueY) + valueH * 0.3) && lines.every((line, i) => measureText(line, nameSize, t.fontFamily, 700) <= chord(valueY + valueH / 2 + 2 + (i + 1) * nameSize * 1.25))) return { valueSize, weight, lines, nameSize };
          valueSize *= 0.86;
        }
      }
      return null;
    };
    const fits = nodes.map((d, i) => inside(d, cs[i].r));

    // Outside labels go on the side facing away from the middle of the picture, if that side is free.
    type Box = { x: number; y: number; w: number; h: number };
    const taken: Box[] = [];
    const hitsCircle = (b: Box, skip: number) =>
      cs.some((c, j) => {
        if (j === skip) return false;
        const nx = Math.max(b.x, Math.min(c.x, b.x + b.w));
        const ny = Math.max(b.y, Math.min(c.y, b.y + b.h));
        return (c.x - nx) ** 2 + (c.y - ny) ** 2 < (c.r + 2) ** 2;
      });
    const hitsBox = (b: Box) => taken.some((q) => q.x < b.x + b.w + 3 && b.x < q.x + q.w + 3 && q.y < b.y + b.h + 2 && b.y < q.y + q.h + 2);
    const inFrame = (b: Box) => b.x >= 1 && b.x + b.w <= W - 1 && b.y >= 0 && b.y + b.h <= H;
    const mx = cs.reduce((s, c) => s + c.x, 0) / Math.max(1, n);
    const my = cs.reduce((s, c) => s + c.y, 0) / Math.max(1, n);
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    // The tag claims its place first: straight above the highlighted circle, else below.
    const tagged = p.tag && anyHighlight ? nodes.findIndex((d) => d.key === ctx.highlight[0]) : -1;
    let tag: (Box & { stemFrom: number; stemTo: number }) | null = null;
    if (tagged >= 0) {
      const c = cs[tagged];
      const w = measureText(upper(p.tag!), 10.5, t.fontFamily, 700) + 16;
      for (const up of [true, false]) {
        const b = { x: Math.max(1, Math.min(W - w - 1, c.x - w / 2)), y: up ? c.y - c.r - 12 - 20 : c.y + c.r + 12, w, h: 20 };
        if (inFrame(b) && !hitsCircle(b, tagged)) {
          tag = { ...b, stemFrom: up ? c.y - c.r : c.y + c.r, stemTo: up ? b.y + b.h : b.y };
          taken.push(b);
          break;
        }
      }
    }
    // How many link lines pass through a box (Liang-Barsky clip of each segment).
    const crossings = (b: Box) =>
      links.filter((l) => {
        const A = cs[l.a];
        const B = cs[l.b];
        let t0 = 0;
        let t1 = 1;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const edges: [number, number][] = [[-dx, A.x - (b.x - 3)], [dx, b.x + b.w + 3 - A.x], [-dy, A.y - (b.y - 2)], [dy, b.y + b.h + 2 - A.y]];
        for (const [pp, q] of edges) {
          if (pp === 0) {
            if (q < 0) return false;
          } else {
            const r = q / pp;
            if (pp < 0) t0 = Math.max(t0, r);
            else t1 = Math.min(t1, r);
            if (t0 > t1) return false;
          }
        }
        return true;
      }).length;
    type Out = { x: number; y: number; align: "left" | "right" | "center"; lines: string[] };
    const outs: (Out | null)[] = nodes.map(() => null);
    nodes
      .map((_, i) => i)
      .filter((i) => !fits[i] || !fits[i]!.lines.length)
      .sort((a, b) => cs[b].r - cs[a].r || a - b)
      .forEach((i) => {
        const c = cs[i];
        const d = nodes[i];
        const value = ctx.fmt(d.value);
        const name = upper(d.key);
        const maxW = ctx.compact ? 96 : 130;
        const wrapped = wrapText(name, maxW, 11, t.fontFamily, 700);
        // A name longer than two lines ends in an ellipsis instead of stopping mid-phrase.
        const nameLines = wrapped.length > 2 ? [wrapped[0], truncateText(`${wrapped[1]} ${wrapped[2]}`, maxW, 11, t.fontFamily, 700)] : wrapped;
        const lines = fits[i] ? nameLines : [...nameLines, value];
        const w = Math.max(...nameLines.map((s) => measureText(s, 11, t.fontFamily, 700)), fits[i] ? 0 : measureText(value, 12, t.fontFamily));
        const h = lines.length * 15;
        const ox = c.x - mx;
        const oy = c.y - my;
        // Every side and corner at three distances, pulled back inside the frame. A spot that
        // touches a circle or another label is out; among the rest the one crossing the fewest
        // link lines wins, then the side facing away from the middle, then the nearest.
        const all = [...dirs, { dx: 1, dy: -1 }, { dx: 1, dy: 1 }, { dx: -1, dy: -1 }, { dx: -1, dy: 1 }];
        const facing = (u: { dx: number; dy: number }) => (u.dx * ox + u.dy * oy) / Math.hypot(u.dx, u.dy);
        const order = [...all].sort((u, v) => facing(v) - facing(u));
        let best: { b: Box; s: { dx: number; dy: number }; score: number } | null = null;
        order.forEach((s, rank) => {
          [7, 16, 28].forEach((gap, gi) => {
            const diag = s.dx !== 0 && s.dy !== 0;
            const g = diag ? (c.r + gap) * 0.72 : c.r + gap;
            const raw: Box = { x: s.dx > 0 ? c.x + g : s.dx < 0 ? c.x - g - w : c.x - w / 2, y: s.dy > 0 ? c.y + g : s.dy < 0 ? c.y - g - h : c.y - h / 2, w, h };
            const b: Box = { ...raw, x: Math.max(1, Math.min(W - w - 1, raw.x)), y: Math.max(0, Math.min(H - h, raw.y)) };
            const blocked = hitsCircle(b, -1) || hitsBox(b);
            const score = (blocked ? 1000 : 0) + crossings(b) * 10 + rank + gi * 3 + (diag ? 1.5 : 0);
            if (!best || score < best.score) best = { b, s, score };
          });
        });
        const pick = best as { b: Box; s: { dx: number; dy: number }; score: number } | null;
        if (pick) {
          const { b, s } = pick;
          outs[i] = { x: s.dx > 0 ? b.x : s.dx < 0 ? b.x + w : b.x + w / 2, y: b.y, align: s.dx > 0 ? "left" : s.dx < 0 ? "right" : "center", lines };
          taken.push(b);
        }
      });

    // Link widths and value labels.
    const lmax = Math.max(0, ...links.map((l) => l.value ?? 0));
    const widthOf = (l: { value?: number }) => (l.value != null && lmax > 0 ? 1 + (Math.max(0, l.value) / lmax) * 5 : 1.25);
    const showLinkLabels = p.linkLabels ?? links.some((l) => l.value != null);
    const linkLabels = links.map((l) => {
      if (!showLinkLabels || l.value == null) return null;
      const A = cs[l.a];
      const B = cs[l.b];
      const d = Math.hypot(B.x - A.x, B.y - A.y) || 1;
      // Midpoint of the part of the line that shows between the two circles.
      const at = (A.r + (d - B.r)) / 2 / d;
      const text = fmtLink(l.value);
      const w = measureText(text, 11, t.fontFamily, 600) + 10;
      const b: Box = { x: A.x + (B.x - A.x) * at - w / 2, y: A.y + (B.y - A.y) * at - 9, w, h: 18 };
      if (d - A.r - B.r < w + 6 || hitsCircle(b, -1) || hitsBox(b) || !inFrame(b)) return null;
      taken.push(b);
      return { ...b, text };
    });
    const linkLit = (l: { a: number; b: number }) => ctx.selected(nodes[l.a].key) || ctx.selected(nodes[l.b].key);
    const linkStroke = (l: { a: number; b: number }) => {
      const touches = anyHighlight && (!ctx.dimmed(nodes[l.a].key) || !ctx.dimmed(nodes[l.b].key));
      return alpha(touches || !anyHighlight ? t.inkSecondary : t.muted, linkLit(l) ? (touches || !anyHighlight ? 0.85 : 0.55) : 0.2);
    };

    const renderLink = (params: any) => {
      const l = links[params.dataIndex];
      if (!l) return null;
      const A = cs[l.a];
      const B = cs[l.b];
      const stroke = linkStroke(l);
      const lw = widthOf(l);
      const children: any[] = [
        // A wide invisible line makes a hairline easy to hover.
        { type: "line", shape: { x1: A.x, y1: A.y, x2: B.x, y2: B.y }, style: { stroke: "rgba(0,0,0,0)", lineWidth: Math.max(12, lw + 8) } },
        { type: "line", shape: { x1: A.x, y1: A.y, x2: B.x, y2: B.y, percent: 1, enterFrom: { percent: 0 } }, style: { stroke, lineWidth: lw, lineCap: "round" }, emphasis: { style: { stroke: t.ink, lineWidth: lw + 1 } }, blur: { style: { opacity: 0.3 } }, transition: ["shape", "style"], enterAnimation: { duration: 500, delay: 250 + params.dataIndex * 40 } },
      ];
      const label = linkLabels[params.dataIndex];
      if (label) {
        children.push({ type: "rect", silent: true, shape: { x: label.x + 0.5, y: label.y + 0.5, width: label.w - 1, height: label.h - 1, r: 3 }, style: { fill: t.surface, stroke: t.axis, lineWidth: 1 } });
        children.push({ type: "text", silent: true, style: { text: label.text, x: label.x + label.w / 2, y: label.y + label.h / 2 + 0.5, fill: t.inkSecondary, fontSize: 11, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      }
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    const renderNode = (params: any) => {
      const i = params.dataIndex;
      const d = nodes[i];
      const c = cs[i];
      if (!d || !c) return null;
      const fill = fillOf(d);
      const ink = inkOn(fill);
      const delay = Math.min(500, i * 50);
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 300, delay: delay + 260 };
      const children: any[] = [
        // A surface-coloured rim separates the circle from the lines that run into it.
        { type: "circle", shape: { cx: c.x, cy: c.y, r: c.r, enterFrom: { r: 0 } }, style: { fill, stroke: t.surface, lineWidth: 2 }, emphasis: { style: { fill: mix(fill, ink, 0.12) } }, blur: fade, transition: ["shape", "style"], enterAnimation: { duration: 520, delay, easing: "cubicOut" } },
      ];
      const fi = fits[i];
      if (fi) {
        const valueH = fi.valueSize * 1.08;
        const block = valueH + (fi.lines.length ? 2 + fi.lines.length * fi.nameSize * 1.25 : 0);
        const top = c.y - block / 2;
        children.push({ type: "text", silent: true, style: { text: ctx.fmt(d.value), x: c.x, y: top + valueH / 2, fill: ink, fontSize: fi.valueSize, fontWeight: fi.weight, fontFamily: t.displayFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        fi.lines.forEach((line, li) => children.push({ type: "text", silent: true, style: { text: line, x: c.x, y: top + valueH + 2 + (li + 0.5) * fi.nameSize * 1.25, fill: ink, fontSize: fi.nameSize, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 0.92, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear }));
      } else if (c.r >= 5) children.push({ type: "circle", silent: true, shape: { cx: c.x, cy: c.y, r: Math.min(2.5, c.r / 3) }, style: { fill: ink }, blur: fade });
      const out = outs[i];
      if (out) {
        const strong = ctx.selected(d.key);
        out.lines.forEach((line, li) => {
          const isValue = !fi && li === out.lines.length - 1;
          children.push({ type: "text", silent: true, style: { text: line, x: out.x, y: out.y + (li + 0.5) * 15, fill: isValue ? t.inkSecondary : strong ? t.ink : t.muted, fontSize: isValue ? 12 : 11, fontWeight: isValue ? 400 : 700, fontFamily: t.fontFamily, align: out.align, verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        });
      }
      if (tag && i === tagged) {
        children.push({ type: "line", silent: true, shape: { x1: c.x, y1: tag.stemFrom, x2: c.x, y2: tag.stemTo }, style: { stroke: t.ink, lineWidth: 1 }, blur: fade });
        children.push({ type: "rect", silent: true, shape: { x: tag.x, y: tag.y, width: tag.w, height: tag.h, r: 10 }, style: { fill: t.ink, opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        children.push({ type: "text", silent: true, style: { text: upper(p.tag!), x: tag.x + tag.w / 2, y: tag.y + tag.h / 2 + 0.5, fill: t.surface, fontSize: 10.5, fontWeight: 700, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
      }
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    const sorted = [...nodes].sort((a, b) => b.value - a.value);
    const most = degree.reduce((a, v, i) => (v > degree[a] ? i : a), 0);
    return {
      alt: n
        ? `Network of ${n} circles sized by ${p.value} and joined by ${links.length} lines. Largest: ${sorted.slice(0, 3).map((d) => `${d.key} ${ctx.fmt(d.value)}`).join(", ")}.${links.length ? ` ${nodes[most].key} has the most links, ${degree[most]}.` : ""}${anyHighlight && tagged >= 0 ? ` ${nodes[tagged].key} is highlighted and tagged "${p.tag}".` : ""}${links.length ? ` Links: ${links.slice(0, 16).map((l) => `${nodes[l.a].key} to ${nodes[l.b].key}${l.value != null ? ` (${fmtLink(l.value)})` : ""}`).join("; ")}.` : ""}`
        : `Network of ${p.value}: no positive values.`,
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            if (d.seriesId === "links") {
              const l = links[d.dataIndex];
              return l ? tooltipHtml(ctx, `${nodes[l.a].key} – ${nodes[l.b].key}`, l.value != null ? [{ name: "Link", value: fmtLink(l.value) }] : []) : "";
            }
            const node = nodes[d.dataIndex];
            if (!node || d.seriesId !== "nodes") return "";
            const partners = links.filter((l) => l.a === d.dataIndex || l.b === d.dataIndex).map((l) => nodes[l.a === d.dataIndex ? l.b : l.a].key);
            return tooltipHtml(ctx, node.key, [{ name: p.value, value: ctx.fmt(node.value), color: fillOf(node) }, ...(links.length ? [{ name: "Linked to", value: partners.length ? (partners.length <= 3 ? partners.join(", ") : `${partners.length} others`) : "none" }] : [])]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "links", type: "custom" as const, coordinateSystem: "none" as any, z: 1, ...morph, emphasis: { focus: "none" as const }, renderItem: renderLink as any, data: links.map((l) => ({ id: `${nodes[l.a].key}→${nodes[l.b].key}`, name: `${nodes[l.a].key} – ${nodes[l.b].key}`, value: [l.value ?? 0] })) },
          {
            id: "nodes",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            z: 2,
            ...morph,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderNode as any,
            data: nodes.map((d) => ({ id: d.key, name: d.key, value: [d.value] })),
          },
        ],
      },
    };
  },
});

export const examples = {
  "Placed by hand, link values, click to select": {
    data: [
      { depot: "Northgate", vans: 120, x: 22, y: 12 },
      { depot: "Riverside", vans: 310, x: 50, y: 46 },
      { depot: "Eastfield", vans: 85, x: 88, y: 30 },
      { depot: "Southwell", vans: 160, x: 62, y: 92 },
      { depot: "Westmere", vans: 44, x: 8, y: 70 },
      { depot: "Airport", vans: 205, x: 86, y: 78 },
    ],
    name: "depot",
    value: "vans",
    x: "x",
    y: "y",
    links: [
      { from: "Riverside", to: "Northgate", value: 42 },
      { from: "Riverside", to: "Eastfield", value: 18 },
      { from: "Riverside", to: "Southwell", value: 55 },
      { from: "Riverside", to: "Westmere", value: 9 },
      { from: "Riverside", to: "Airport", value: 71 },
      { from: "Southwell", to: "Airport", value: 26 },
    ],
    highlight: "Riverside",
    tag: "Main depot",
    select: true,
    linkFormat: "{value} trips",
    title: "Riverside runs 310 of the fleet's 924 vans",
    subtitle: "Vans based at each depot (area) and daily transfer trips between depots (line width)",
    note: "Illustrative figures for an invented courier",
  },
  "Ring layout, no hub": {
    theme: "noir",
    data: [
      ["Algebra", 48], ["Geometry", 31], ["Statistics", 64], ["Calculus", 22], ["Logic", 12], ["Number theory", 9], ["Probability", 37], ["Topology", 5],
    ].map(([course, students]) => ({ course, students })),
    name: "course",
    value: "students",
    layout: "ring",
    links: [
      { from: "Algebra", to: "Geometry" }, { from: "Algebra", to: "Calculus" }, { from: "Statistics", to: "Probability" }, { from: "Calculus", to: "Topology" },
      { from: "Logic", to: "Number theory" }, { from: "Algebra", to: "Number theory" }, { from: "Probability", to: "Calculus" }, { from: "Geometry", to: "Topology" },
    ],
    title: "Statistics has 64 students",
    subtitle: "Students enrolled in eight maths courses. Lines join courses where one is required for the other.",
    note: "Illustrative figures",
  },
  "Stress: 12 circles, long names, values from 1 to 480": {
    theme: "sunrise",
    data: [
      ["Central Co-operative Wholesale Society", 480], ["Dairy", 210], ["Northern Grain and Seed Merchants", 96], ["Bakery", 150], ["Orchards", 33], ["Fishery", 61],
      ["Upland Sheep Farmers' Association", 18], ["Brewery", 74], ["Market garden", 8], ["Apiary", 1], ["Mill", 120], ["Smokehouse", 4],
    ].map(([member, m]) => ({ member, m })),
    name: "member",
    value: "m",
    format: "£{value}m",
    highlight: "Central Co-operative Wholesale Society",
    tag: "Buys from all eleven",
    links: ["Dairy", "Northern Grain and Seed Merchants", "Bakery", "Orchards", "Fishery", "Upland Sheep Farmers' Association", "Brewery", "Market garden", "Apiary", "Mill", "Smokehouse"].map((to) => ({ from: "Central Co-operative Wholesale Society", to })).concat([{ from: "Mill", to: "Bakery" }, { from: "Northern Grain and Seed Merchants", to: "Mill" }, { from: "Northern Grain and Seed Merchants", to: "Brewery" }, { from: "Fishery", to: "Smokehouse" }]),
    height: 560,
    title: "The wholesale society turns over £480 million a year",
    subtitle: "Annual turnover of 12 co-operative members, £ million. Lines show who supplies whom.",
    note: "Illustrative figures for an invented co-operative",
  },
};
