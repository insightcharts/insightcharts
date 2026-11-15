import { CustomChart } from "echarts/charts";
import { inkOn, mix, ramp } from "../core/color";
import { defineChart } from "../core/define";
import type { LegendItem } from "../core/figure";
import { makeFormatter, type Formatter } from "../core/format";
import { resolveIcon } from "../core/icons";
import { dodge, measureText, truncateText, wrapText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { niceStep, toNumber } from "../data/transform";
import type { Row } from "../data/types";

export interface CirclePackProps {
  /** Name field: one circle per row. */
  name: string;
  /** Value field: circle area. Non-positive values are dropped. */
  value: string;
  /** Optional parent field. Circles sharing a group sit together and share a colour. */
  group?: string;
  /** Thin dotted enclosing ring: `"group"` draws one per group with its name and total, `"all"` draws one around the whole pack. Default `"group"` when `group` is set, else `"none"`. */
  ring?: "none" | "group" | "all";
  /** `"group"` colours by group, `"value"` shades by value along the sequential ramp, `"single"` uses the accent for every circle. Default: `"group"` when `group` is set, else `"single"`. */
  colorBy?: "group" | "value" | "single";
  /** Icon drawn above the number in circles large enough: one name for all, or a map from circle or group name to icon. Built-in name or `path://`. */
  icon?: string | Record<string, string>;
  /** Draw a size key of nested reference circles. `true` picks round values; an array sets them. */
  sizeLegend?: boolean | number[];
  /** Print names and values. Default true. */
  labels?: boolean;
  /** Display names for group keys. */
  names?: Record<string, string>;
}

type _C = { x: number; y: number; r: number };

/**
 * Greedy circle packing. Circles are placed largest first; each goes to the free position
 * touching one or two circles already placed that lies closest to the origin, measured in a
 * space squeezed by `aspect` so the cluster grows into a frame of that shape. No randomness:
 * the same radii always give the same picture.
 */
function _pack(radii: number[], aspect: number, pad: number): _C[] {
  const out: _C[] = radii.map((r) => ({ x: 0, y: 0, r }));
  const order = radii.map((_, i) => i).sort((a, b) => radii[b] - radii[a] || a - b);
  const placed: _C[] = [];
  // Distance is taken from the area-weighted centre of what is already placed, so a new
  // circle prefers the notch between two neighbours over the far side of the first circle.
  let mass = 0;
  let mx = 0;
  let my = 0;
  const score = (x: number, y: number) => ((x - mx / mass) / aspect) ** 2 + (y - my / mass) ** 2;
  const free = (x: number, y: number, r: number) => {
    for (const q of placed) {
      const d = q.r + r + pad - 1e-6;
      const dx = q.x - x;
      const dy = q.y - y;
      if (dx * dx + dy * dy < d * d) return false;
    }
    return true;
  };
  for (const i of order) {
    const c = out[i];
    if (placed.length) {
      let best = Infinity;
      let bx = 0;
      let by = 0;
      const consider = (x: number, y: number) => {
        const s = score(x, y);
        if (s < best - 1e-9 && free(x, y, c.r)) {
          best = s;
          bx = x;
          by = y;
        }
      };
      for (let a = 0; a < placed.length; a++) {
        const A = placed[a];
        const da = A.r + c.r + pad;
        // Touching one circle, at sixteen angles round it.
        for (let k = 0; k < 16; k++) consider(A.x + Math.cos((k * Math.PI) / 8) * da, A.y + Math.sin((k * Math.PI) / 8) * da);
        for (let b = a + 1; b < placed.length; b++) {
          const B = placed[b];
          const db = B.r + c.r + pad;
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const d = Math.hypot(dx, dy);
          if (d > da + db || d < 1e-9) continue;
          // Touching both: the two intersections of the circles grown by the new radius.
          const along = (da * da - db * db + d * d) / (2 * d);
          const h = Math.sqrt(Math.max(0, da * da - along * along));
          const mx = A.x + (dx * along) / d;
          const my = A.y + (dy * along) / d;
          consider(mx - (dy * h) / d, my + (dx * h) / d);
          consider(mx + (dy * h) / d, my - (dx * h) / d);
        }
      }
      c.x = bx;
      c.y = by;
    }
    placed.push(c);
    mass += c.r * c.r;
    mx += c.x * c.r * c.r;
    my += c.y * c.r * c.r;
  }
  return out;
}

/** A close-to-smallest circle enclosing the given circles: walk the centre toward the farthest one in shrinking steps. */
function _enclose(cs: _C[]): _C {
  if (!cs.length) return { x: 0, y: 0, r: 0 };
  let x = cs.reduce((s, c) => s + c.x, 0) / cs.length;
  let y = cs.reduce((s, c) => s + c.y, 0) / cs.length;
  const far = () => {
    let m = cs[0];
    let md = -1;
    for (const c of cs) {
      const d = Math.hypot(c.x - x, c.y - y) + c.r;
      if (d > md) {
        md = d;
        m = c;
      }
    }
    return { m, md };
  };
  for (let k = 1; k <= 120; k++) {
    const { m } = far();
    const d = Math.hypot(m.x - x, m.y - y);
    if (d < 1e-9) break;
    // Step toward the far side of the farthest circle.
    const step = (d + m.r) / (k + 1) / d;
    x += (m.x - x) * Math.min(1, step * 0.5);
    y += (m.y - y) * Math.min(1, step * 0.5);
  }
  return { x, y, r: far().md };
}

const _layouts = new Map<string, { nodes: _C[]; rings: _C[] }>();

/** Positions for every circle in value units (radius = sqrt(value)), plus one enclosing circle per group. */
function _layout(radii: number[], groupOf: number[], groupCount: number, aspect: number, pad: number, groupPad: number): { nodes: _C[]; rings: _C[] } {
  const key = `${aspect.toFixed(2)}|${pad.toFixed(3)}|${groupPad.toFixed(3)}|${groupOf.join(",")}|${radii.map((r) => r.toFixed(4)).join(",")}`;
  const hit = _layouts.get(key);
  if (hit) return hit;
  let nodes: _C[];
  let rings: _C[] = [];
  if (groupCount <= 1) {
    nodes = _pack(radii, aspect, pad);
    rings = [_enclose(nodes)];
  } else {
    nodes = radii.map((r) => ({ x: 0, y: 0, r }));
    const members = Array.from({ length: groupCount }, (_, g) => radii.map((_, i) => i).filter((i) => groupOf[i] === g));
    const local = members.map((m) => _pack(m.map((i) => radii[i]), 1, pad));
    const hulls = local.map(_enclose);
    const spots = _pack(hulls.map((h) => h.r + groupPad), aspect, 0);
    members.forEach((m, g) => {
      m.forEach((i, k) => {
        nodes[i].x = local[g][k].x - hulls[g].x + spots[g].x;
        nodes[i].y = local[g][k].y - hulls[g].y + spots[g].y;
      });
      rings.push({ x: spots[g].x, y: spots[g].y, r: hulls[g].r });
    });
  }
  if (_layouts.size > 60) _layouts.clear();
  const out = { nodes, rings };
  _layouts.set(key, out);
  return out;
}

type _Node = { key: string; group: string; gi: number; value: number };
type _Env = { width: number; height: number; compact: boolean; locale?: string; fmt: Formatter; fontFamily: string; displayFamily: string };
type _Key = { x: number; y: number; name: string; value: string; i: number };
type _Leader = { i: number; side: -1 | 1; x: number; y: number; name: string; value: string };

const MAX_COLOURS = 8;
const MAX_LEADERS = 14;
const KEY_LINE = 20;

/**
 * The whole layout in pixels for a frame of `e.width` by `e.height`: the packed circles, what
 * is printed inside each, the leader labels beside the pack and the key under it. Pure, so
 * the definition's `height` hook and `build` share it.
 */
function _plan(p: CirclePackProps, rows: Row[], e: _Env) {
  type Node = _Node;
  const W = e.width;
  const H = e.height;
  const nodes: Node[] = [];
  const groups: string[] = [];
  for (const r of rows) {
    const v = toNumber(r[p.value]);
    if (Number.isNaN(v) || v <= 0) continue;
    const group = p.group ? String(r[p.group] ?? "") : "";
    if (!groups.includes(group)) groups.push(group);
    nodes.push({ key: String(r[p.name] ?? ""), group, gi: groups.indexOf(group), value: v });
  }
  const n = nodes.length;
  const grouped = !!p.group && groups.length > 1;
  const ringMode = p.ring ?? (grouped ? "group" : "none");
  const groupRings = grouped && ringMode === "group";
  const colorBy = p.colorBy ?? (grouped ? "group" : "single");
  const showLabels = p.labels !== false;
  const total = nodes.reduce((s, d) => s + d.value, 0);
  const vmax = nodes.reduce((m, d) => Math.max(m, d.value), 0) || 1;
  const groupName = (g: string) => p.names?.[g] ?? g;
  const groupTotal = (g: string) => nodes.filter((d) => d.group === g).reduce((s, d) => s + d.value, 0);

  const iconOf = (d: Node) => (typeof p.icon === "string" ? p.icon : p.icon?.[d.key] ?? p.icon?.[d.group]);

  const radii = nodes.map((d) => Math.sqrt(d.value));
  const groupOf = nodes.map((d) => d.gi);
  const aspectFor = (w: number, h: number) => (ringMode === "all" ? 1 : Math.max(0.45, Math.min(2.6, w / Math.max(1, h))));
  const ringGap = 9;

  // Fit the packing into a box: layout in value units, then one scale `k` (px per unit).
  type Fit = { k: number; cs: _C[]; rings: _C[]; all: _C; x0: number; y0: number; x1: number; y1: number };
  const fitAt = (bx: number, by: number, bw: number, bh: number, aspect: number): Fit => {
    const headroom = groupRings ? 8 : 0;
    const ringPx = ringMode === "none" ? 0 : ringGap;
    // Start from the scale at which the circles alone would cover about half the box.
    let k = Math.sqrt((bw * bh * 0.5) / (Math.PI * total || 1));
    let lay = { nodes: [] as _C[], rings: [] as _C[] };
    let ext = { x0: 0, y0: 0, x1: 1, y1: 1 };
    let all: _C = { x: 0, y: 0, r: 1 };
    for (let pass = 0; pass < 6; pass++) {
      // Round so the cache key settles and the last pass repeats the one before.
      const pad = Math.round((3 / k) * 200) / 200;
      const gpad = Math.round(((groupRings ? ringGap + 7 : 9) / k) * 200) / 200;
      lay = _layout(radii, groupOf, grouped ? groups.length : 1, aspect, pad, gpad);
      all = _enclose(lay.nodes);
      if (ringMode === "all") ext = { x0: all.x - all.r, y0: all.y - all.r, x1: all.x + all.r, y1: all.y + all.r };
      else if (groupRings) ext = { x0: Math.min(...lay.rings.map((c) => c.x - c.r)), y0: Math.min(...lay.rings.map((c) => c.y - c.r)), x1: Math.max(...lay.rings.map((c) => c.x + c.r)), y1: Math.max(...lay.rings.map((c) => c.y + c.r)) };
      else ext = { x0: Math.min(...lay.nodes.map((c) => c.x - c.r)), y0: Math.min(...lay.nodes.map((c) => c.y - c.r)), x1: Math.max(...lay.nodes.map((c) => c.x + c.r)), y1: Math.max(...lay.nodes.map((c) => c.y + c.r)) };
      k = Math.max(0.0001, Math.min((bw - 2 * ringPx) / (ext.x1 - ext.x0 || 1), (bh - 2 * ringPx - headroom) / (ext.y1 - ext.y0 || 1)));
    }
    const ox = bx + bw / 2 - ((ext.x0 + ext.x1) / 2) * k;
    const oy = by + headroom / 2 + bh / 2 - ((ext.y0 + ext.y1) / 2) * k;
    const px = (c: _C, grow = 0): _C => ({ x: ox + c.x * k, y: oy + c.y * k, r: c.r * k + grow });
    return { k, cs: lay.nodes.map((c) => px(c)), rings: lay.rings.map((c) => px(c, ringPx)), all: px(all, ringPx), x0: ox + ext.x0 * k - ringPx, y0: oy + ext.y0 * k - ringPx, x1: ox + ext.x1 * k + ringPx, y1: oy + ext.y1 * k + ringPx };
  };
  // The squeeze that suits a frame depends on the mix of sizes, so try a few and keep the largest result.
  const fit = (bx: number, by: number, bw: number, bh: number): Fit => {
    const target = aspectFor(bw, bh);
    const tries = ringMode === "all" ? [1] : [target, target * 0.75, target * 0.55, target * 1.3].map((a) => Math.round(Math.max(0.4, Math.min(3, a)) * 20) / 20);
    let best: Fit | null = null;
    for (const a of tries) {
      const f = fitAt(bx, by, bw, bh, a);
      if (!best || f.k > best.k * 1.02) best = f;
    }
    return best!;
  };

  // What fits inside a circle: icon, value and name; then value and name; then the value alone.
  type Inside = { icon: number; valueSize: number; valueWeight: number; lines: string[]; nameSize: number; top: number };
  const upper = (s: string) => s.toLocaleUpperCase(e.locale);
  const inside = (d: Node, r: number): Inside | null => {
    if (!showLabels || r < 11) return null;
    const valueText = e.fmt(d.value);
    const chord = (dy: number) => (Math.abs(dy) >= r ? 0 : 2 * Math.sqrt(r * r - dy * dy) - Math.max(6, r * 0.16));
    const attempt = (withIcon: boolean, withName: boolean): Inside | null => {
      let valueSize = Math.max(11, Math.min(56, r * (withName ? 0.5 : 0.62)));
      const nameSize = Math.round(Math.max(10, Math.min(14, r * 0.17)));
      const icon = withIcon ? Math.round(Math.min(40, r * 0.36)) : 0;
      for (let step = 0; step < 6; step++) {
        const weight = valueSize >= 22 ? 300 : 600;
        const valueH = valueSize * 1.08;
        let lines: string[] = [];
        if (withName) {
          lines = wrapText(upper(d.key), chord(valueH / 2 + nameSize * 0.6) - 2, nameSize, e.fontFamily, 600);
          if (lines.length > 2) return null;
        }
        const nameH = lines.length * nameSize * 1.25;
        const block = (icon ? icon + 4 : 0) + valueH + (nameH ? nameH + 2 : 0);
        const top = -block / 2;
        const valueY = top + (icon ? icon + 4 : 0) + valueH / 2;
        const ok =
          block <= r * 1.72 &&
          measureText(valueText, valueSize, e.displayFamily, weight) <= chord(Math.abs(valueY) + valueH * 0.3) &&
          lines.every((line, i) => measureText(line, nameSize, e.fontFamily, 600) <= chord(Math.abs(valueY + valueH / 2 + 2 + (i + 1) * nameSize * 1.25))) &&
          (!icon || icon <= chord(Math.abs(top)));
        if (ok) return { icon, valueSize, valueWeight: weight, lines, nameSize, top };
        valueSize *= 0.86;
        if (valueSize < 11) return null;
      }
      return null;
    };
    const wantIcon = !!iconOf(d) && r >= 40;
    return (wantIcon ? attempt(true, true) : null) ?? attempt(false, true) ?? (wantIcon ? attempt(true, false) : null) ?? attempt(false, false);
  };

  // Size key: nested reference circles that share their lowest point.
  const legendValues = (k: number): number[] => {
    if (!p.sizeLegend) return [];
    const picked = Array.isArray(p.sizeLegend) ? p.sizeLegend.filter((v) => v > 0).sort((a, b) => b - a) : (() => {
      const step = niceStep(vmax / 1.6);
      const big = Math.max(step, Math.floor(vmax / step) * step);
      return [big, big / 4, big / 20];
    })();
    return picked.filter((v) => Math.sqrt(v) * k >= 3.5).slice(0, 3);
  };
  const legendBox = (k: number) => {
    const vs = legendValues(k);
    if (!vs.length) return null;
    const R = Math.sqrt(vs[0]) * k;
    const labelW = Math.max(...vs.map((v) => measureText(e.fmt(v), 11, e.fontFamily)));
    return { vs, R, w: 2 * R + 14 + labelW, h: Math.max(2 * R, vs.length * 14) + 4 };
  };

  // Names that do not fit go beside the pack on leader lines; whatever cannot get a clean
  // leader (and everything on a phone) goes into a key under the pack, so no value is left
  // to the tooltip.
  type Out = { d: Node; i: number; c: _C; fitIn: Inside | null };
  const outsideOf = (f: Fit): Out[] =>
    showLabels
      ? nodes
          .map((d, i) => ({ d, i, c: f.cs[i], fitIn: inside(d, f.cs[i].r) }))
          .filter((o) => !o.fitIn || !o.fitIn.lines.length)
          .sort((a, b) => b.d.value - a.d.value)
      : [];
  const leaderText = (o: Out) => ({ name: o.d.key, value: o.fitIn ? "" : e.fmt(o.d.value) });
  const leaderWidth = (o: Out) => {
    const s = leaderText(o);
    return measureText(s.name, 12, e.fontFamily, 600) + (s.value ? 6 + measureText(s.value, 12, e.fontFamily) : 0);
  };
  // The key flows in centred lines: dot, name, value.
  const flowKey = (list: Out[], top: number) => {
    const items: _Key[] = [];
    const lines: { from: number; width: number }[] = [];
    let x = 0;
    for (const o of list) {
      const value = e.fmt(o.d.value);
      const valueW = measureText(value, 12, e.fontFamily);
      const name = truncateText(o.d.key, Math.max(40, W - 14 - 6 - valueW - 8), 12, e.fontFamily, 600);
      const w = 14 + measureText(name, 12, e.fontFamily, 600) + 6 + valueW;
      if (!lines.length || (x > 0 && x + w > W - 4)) {
        lines.push({ from: items.length, width: 0 });
        x = 0;
      }
      items.push({ x, y: top + (lines.length - 1) * KEY_LINE + KEY_LINE / 2, name, value, i: o.i });
      lines[lines.length - 1].width = x + w;
      x += w + 16;
    }
    lines.forEach((line, li) => {
      const to = li + 1 < lines.length ? lines[li + 1].from : items.length;
      for (let k = line.from; k < to; k++) items[k].x += Math.max(2, (W - line.width) / 2);
    });
    return { items, lines: lines.length };
  };

  // Does the straight line from a circle to its label run through anything it should not?
  const pointSeg = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = dx * dx + dy * dy || 1;
    const u = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len));
    return Math.hypot(px - (x1 + u * dx), py - (y1 + u * dy));
  };
  const leaderLine = (c: _C, x: number, y: number, side: number) => {
    const ax = x - side * 4;
    const len = Math.hypot(ax - c.x, y - c.y) || 1;
    return { x1: c.x + ((ax - c.x) / len) * (c.r + 2), y1: c.y + ((y - c.y) / len) * (c.r + 2), x2: ax, y2: y };
  };
  const crosses = (a: { x1: number; y1: number; x2: number; y2: number }, b: { x1: number; y1: number; x2: number; y2: number }) => {
    const d = (p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number) => (p3x - p1x) * (p2y - p1y) - (p2x - p1x) * (p3y - p1y);
    return d(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1) * d(a.x1, a.y1, a.x2, a.y2, b.x2, b.y2) < 0 && d(b.x1, b.y1, b.x2, b.y2, a.x1, a.y1) * d(b.x1, b.y1, b.x2, b.y2, a.x2, a.y2) < 0;
  };
  const route = (f: Fit, outs: Out[], bottom: number): { leaders: _Leader[]; rest: Out[] } => {
    const cs = f.cs;
    const cx = (f.x0 + f.x1) / 2;
    const colX = { [-1]: f.x0 - 12, [1]: f.x1 + 12 } as Record<number, number>;
    // The name of each group sits on top of its ring: a leader keeps off it too.
    const patches = groupRings ? f.rings.map((ring) => ({ x: ring.x, y: ring.y - ring.r, hw: Math.min(ring.r * 0.75, 90) + 8 })) : [];
    const blocked = (i: number, s: { x1: number; y1: number; x2: number; y2: number }) =>
      cs.some((q, j) => j !== i && pointSeg(q.x, q.y, s.x1, s.y1, s.x2, s.y2) < q.r + 2.5) ||
      patches.some((q) => {
        const steps = Math.max(2, Math.ceil(Math.hypot(s.x2 - s.x1, s.y2 - s.y1) / 4));
        for (let k = 0; k <= steps; k++) if (Math.abs(s.x1 + ((s.x2 - s.x1) * k) / steps - q.x) < q.hw && Math.abs(s.y1 + ((s.y2 - s.y1) * k) / steps - q.y) < 10) return true;
        return false;
      });
    type Cand = { o: Out; side: -1 | 1; flipped: boolean; y: number; seg: { x1: number; y1: number; x2: number; y2: number } };
    let live: Cand[] = outs.slice(0, MAX_LEADERS).map((o) => ({ o, side: o.c.x < cx ? -1 : 1, flipped: false, y: o.c.y, seg: { x1: 0, y1: 0, x2: 0, y2: 0 } }));
    const dead = new Set<Out>(outs.slice(MAX_LEADERS));
    for (let guard = 0; guard < 3 * MAX_LEADERS; guard++) {
      for (const s of [-1, 1] as const) {
        const mine = live.filter((q) => q.side === s);
        const ys = dodge(mine.map((q) => q.o.c.y), 18, 10, Math.max(10, bottom - 10));
        mine.forEach((q, j) => {
          q.y = ys[j];
          q.seg = leaderLine(q.o.c, colX[s], ys[j], s);
        });
      }
      // The smallest offender gives way first: flip it once, then drop it to the key.
      const bad = [...live].reverse().find((q) => blocked(q.o.i, q.seg) || live.some((r) => r !== q && r.side === q.side && crosses(q.seg, r.seg)));
      if (!bad) break;
      if (!bad.flipped) {
        bad.flipped = true;
        bad.side = -bad.side as -1 | 1;
      } else {
        dead.add(bad.o);
        live = live.filter((q) => q !== bad);
      }
    }
    const leaders = live.map((q) => {
      const text = leaderText(q.o);
      // Whatever room the column has, the value is kept and the name gives way.
      const room = (q.side < 0 ? colX[q.side] : W - colX[q.side]) - 2 - (text.value ? measureText(text.value, 12, e.fontFamily) + 8 : 0);
      return { i: q.o.i, side: q.side, x: colX[q.side], y: q.y, name: truncateText(text.name, Math.max(24, room), 12, e.fontFamily, 600), value: text.value };
    });
    return { leaders, rest: outs.filter((o) => dead.has(o)) };
  };

  let f: Fit | null = null;
  let keyItems: _Key[] = [];
  let leaders: _Leader[] = [];
  let legendAt: { x: number; y: number } | null = null;
  let keyH = 0;
  let box = { x: 2, y: 2, w: W - 4, h: H - 4 };

  if (n) {
    // Reserving room for the labels shrinks the pack, which can push more names outside, so
    // the reserved column width and key lines only ever grow until the layout settles.
    let side = 0;
    let keyLines = 0;
    let rest: Out[] = [];
    for (let pass = 0; pass < 6; pass++) {
      keyH = keyLines ? keyLines * KEY_LINE + 10 : 0;
      box = { x: 2 + side, y: 2, w: Math.max(40, W - 4 - 2 * side), h: Math.max(60, H - 4 - keyH) };
      f = fit(box.x, box.y, box.w, box.h);
      const outs = outsideOf(f);
      if (e.compact) {
        leaders = [];
        rest = outs;
      } else ({ leaders, rest } = route(f, outs, box.y + box.h));
      const needSide = leaders.length ? Math.min(160, Math.max(...leaders.map((l) => leaderWidth({ d: nodes[l.i], i: l.i, c: f!.cs[l.i], fitIn: l.value ? null : ({} as Inside) }))) + 24) : 0;
      const needLines = flowKey(rest, 0).lines;
      if (needSide <= side && needLines <= keyLines) break;
      side = Math.max(side, needSide);
      keyLines = Math.max(keyLines, needLines);
    }
    keyH = keyLines ? keyLines * KEY_LINE + 10 : 0;
    keyItems = flowKey(rest, box.y + box.h + 8).items.filter((item) => item.y <= H - 4);

    // The size key takes a corner the pack leaves free; failing that, the pack gives up a strip for it.
    const lb = legendBox(f!.k);
    if (lb) {
      const bottom = box.y + box.h;
      const clear = (x: number, y: number) => {
        const hitsCircle = f!.cs.some((c) => {
          const nx = Math.max(x, Math.min(c.x, x + lb.w));
          const ny = Math.max(y, Math.min(c.y, y + lb.h));
          return (c.x - nx) ** 2 + (c.y - ny) ** 2 < (c.r + 8) ** 2;
        });
        const hitsRing = (ringMode === "all" ? [f!.all] : groupRings ? f!.rings : []).some((c) => {
          const nx = Math.max(x, Math.min(c.x, x + lb.w));
          const ny = Math.max(y, Math.min(c.y, y + lb.h));
          return (c.x - nx) ** 2 + (c.y - ny) ** 2 < (c.r + 6) ** 2;
        });
        const hitsLabel = leaders.some((l) => l.y > y - 12 && l.y < y + lb.h + 12 && (l.side < 0 ? x < l.x : x + lb.w > l.x));
        return !hitsCircle && !hitsRing && !hitsLabel;
      };
      const corners = [
        { x: W - lb.w - 4, y: bottom - lb.h - 2 },
        { x: 4, y: bottom - lb.h - 2 },
        { x: W - lb.w - 4, y: 4 },
        { x: 4, y: 4 },
      ];
      legendAt = corners.find((c) => clear(c.x, c.y)) ?? null;
      if (!legendAt && !e.compact && !leaders.length) {
        box = { ...box, w: box.w - lb.w - 12 };
        f = fit(box.x, box.y, box.w, box.h);
        const again = legendBox(f.k);
        if (again) legendAt = { x: W - again.w - 4, y: bottom - again.h - 2 };
      }
    }
  }
  const cs = f?.cs ?? [];
  const k = f?.k ?? 1;
  const fits = nodes.map((d, i) => inside(d, cs[i].r));
  return { nodes, groups, n, grouped, ringMode, groupRings, total, vmax, groupName, groupTotal, iconOf, upper, f, cs, k, fits, keyItems, leaders, legendAt, legendBox, keyH };
}

/**
 * Circles sized by area and packed tight. The layout is computed here, in pixels, so each
 * label can be tested against the circle it will sit in before anything is drawn.
 */
export const CirclePack = defineChart<CirclePackProps>({
  name: "circle-pack",
  title: "Circle pack",
  category: "poster",
  description: "Shows parts as tightly packed circles sized by value, optionally clustered into groups, with the value and name printed inside each circle.",
  whenToUse: "A poster view of 5 to about 60 parts of very different sizes where the reader should see the largest ones and their rough proportions at once: budgets by programme, emissions by source, users by product. One level of grouping is supported.",
  avoid: "Values that need precise comparison (use bar-chart, where bars share a baseline); parts that must visibly add up to a whole (use treemap or waffle-chart); more than about 80 parts (use treemap); negative values (use diverging-bar-chart).",
  use: [CustomChart],
  defaults: { labels: true },
  selectField: (p) => p.name,
  selectValue: (params) => (params.seriesId === "circles" ? params.name : null),
  markCount: (rows) => rows.length,
  height: (p, rows, width) => {
    const base = rows.length <= 6 ? 400 : rows.length <= 24 ? 480 : 560;
    if (!width) return base;
    // The pack keeps its frame; the key under it adds its own lines.
    // On a phone the pack is as wide as the column, so a frame much taller than that is empty.
    const pack = width < 480 ? Math.min(base, Math.max(300, Math.round(width * 1.15))) : base;
    return pack + _plan(p, rows, { width, height: pack, compact: width < 480, fmt: makeFormatter(p.format), fontFamily: "sans-serif", displayFamily: "sans-serif" }).keyH;
  },
  props: [
    { name: "name", type: "string", required: true, description: "Name field: one circle per row." },
    { name: "value", type: "string", required: true, description: "Value field: circle area. Non-positive values are dropped." },
    { name: "group", type: "string", description: "Parent field. Circles sharing a group sit together and share a colour." },
    { name: "ring", type: '"none" | "group" | "all"', description: 'Thin dotted enclosing ring: one per group with its name and total, or one around the whole pack. Default "group" when `group` is set, else "none".' },
    { name: "colorBy", type: '"group" | "value" | "single"', description: 'Colour by group, shade by value along the sequential ramp, or use the accent for every circle. Default "group" when `group` is set, else "single".' },
    { name: "icon", type: "string | Record<string, string>", description: "Icon drawn above the number in large circles: one for all, or a map from circle or group name to icon. Built-in name or `path://`." },
    { name: "sizeLegend", type: "boolean | number[]", default: "false", description: "Size key of nested reference circles. `true` picks round values; an array sets them." },
    { name: "labels", type: "boolean", default: "true", description: "Print names and values inside circles, and beside the ones too small to hold them." },
    { name: "names", type: "Record<string, string>", description: "Display names for group keys." },
  ],
  example: {
    type: "circle-pack",
    theme: "magenta",
    data: [
      { crop: "Maize", group: "Cereals", mt: 1160 },
      { crop: "Wheat", group: "Cereals", mt: 780 },
      { crop: "Rice", group: "Cereals", mt: 790 },
      { crop: "Barley", group: "Cereals", mt: 150 },
      { crop: "Sorghum", group: "Cereals", mt: 60 },
      { crop: "Potatoes", group: "Roots", mt: 375 },
      { crop: "Cassava", group: "Roots", mt: 330 },
      { crop: "Sweet potatoes", group: "Roots", mt: 90 },
      { crop: "Yams", group: "Roots", mt: 85 },
      { crop: "Soybeans", group: "Oil crops", mt: 350 },
      { crop: "Oil palm fruit", group: "Oil crops", mt: 420 },
      { crop: "Rapeseed", group: "Oil crops", mt: 87 },
      { crop: "Sunflower seed", group: "Oil crops", mt: 54 },
    ],
    name: "crop",
    value: "mt",
    group: "group",
    format: "{value} Mt",
    title: "The world harvested 1,160 million tonnes of maize in 2022",
    subtitle: "Harvest of 13 major crops by group, million tonnes, 2022",
    source: "FAOSTAT",
    note: "Rounded, approximate figures for illustration",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    type Node = _Node;
    const plan = _plan(p, ctx.rows, { width: ctx.width, height: ctx.height, compact: ctx.compact, locale: ctx.locale, fmt: ctx.fmt, fontFamily: t.fontFamily, displayFamily: t.displayFamily });
    const { nodes, groups, n, grouped, groupRings, ringMode, total, vmax, groupName, groupTotal, iconOf, upper, f, cs, k, fits, keyItems, leaders, legendAt, legendBox } = plan;
    const colorBy = p.colorBy ?? (grouped ? "group" : "single");
    const pct = ctx.formatter({ style: "percent", maximumFractionDigits: 1 });

    const anyHighlight = ctx.highlight.length > 0;
    const baseOf = (d: Node) => {
      if (anyHighlight) return ctx.color(ctx.highlight.includes(d.key) ? d.key : d.group);
      if (colorBy === "group" && p.group) return d.gi < MAX_COLOURS ? ctx.color(d.group, d.gi) : t.context;
      if (colorBy === "value") return ramp(t.sequential, 0.15 + 0.85 * Math.sqrt(d.value / vmax));
      return ctx.color();
    };
    const fillOf = (d: Node) => (ctx.selected(d.key) ? baseOf(d) : mix(t.surface, baseOf(d), 0.3));

    const leaderOf = new Map(leaders.map((l) => [l.i, l]));

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const d = nodes[i];
      const c = cs[i];
      if (!d || !c) return null;
      const fill = fillOf(d);
      const ink = inkOn(fill);
      const delay = Math.min(600, i * 22);
      const children: any[] = [
        {
          type: "circle",
          shape: { cx: c.x, cy: c.y, r: Math.max(1.5, c.r), enterFrom: { r: 0 } },
          style: { fill },
          emphasis: { style: { fill: mix(fill, ink, 0.12) } },
          blur: { style: { opacity: 0.3 } },
          transition: ["shape", "style"],
          enterAnimation: { duration: 520, delay, easing: "cubicOut" },
        },
      ];
      const fade = { style: { opacity: 0.3 } };
      const appear = { duration: 300, delay: delay + 260 };
      const fi = fits[i];
      if (fi) {
        let y = c.y + fi.top;
        if (fi.icon) {
          const icon = resolveIcon(iconOf(d));
          const w = icon.aspect >= 1 ? fi.icon : fi.icon * icon.aspect;
          const h = icon.aspect >= 1 ? fi.icon / icon.aspect : fi.icon;
          children.push({ type: "path", silent: true, shape: { pathData: icon.d, x: c.x - w / 2, y: y + (fi.icon - h) / 2, width: w, height: h, layout: "center" }, style: { fill: ink, opacity: 0.9, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
          y += fi.icon + 4;
        }
        const valueH = fi.valueSize * 1.08;
        children.push({ type: "text", silent: true, style: { text: ctx.fmt(d.value), x: c.x, y: y + valueH / 2, fill: ink, fontSize: fi.valueSize, fontWeight: fi.valueWeight, fontFamily: t.displayFamily, align: "center", verticalAlign: "middle", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        y += valueH + 2;
        fi.lines.forEach((line, li) => {
          children.push({ type: "text", silent: true, style: { text: line, x: c.x, y: y + (li + 0.5) * fi.nameSize * 1.25, fill: ink, fontSize: fi.nameSize, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle", opacity: 0.92, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        });
      }
      const lead = leaderOf.get(i);
      if (lead) {
        const ax = lead.x - lead.side * 4;
        const len = Math.hypot(ax - c.x, lead.y - c.y) || 1;
        const sx = c.x + ((ax - c.x) / len) * (c.r + 2);
        const sy = c.y + ((lead.y - c.y) / len) * (c.r + 2);
        children.push({ type: "line", silent: true, shape: { x1: sx, y1: sy, x2: ax, y2: lead.y }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 3], lineCap: "round", opacity: 1, enterFrom: { opacity: 0 } }, blur: fade, enterAnimation: appear });
        children.push({
          type: "text",
          silent: true,
          style: {
            text: lead.value ? (lead.side < 0 ? `{v|${lead.value}}  {n|${lead.name}}` : `{n|${lead.name}}  {v|${lead.value}}`) : `{n|${lead.name}}`,
            x: lead.x,
            y: lead.y,
            align: lead.side < 0 ? "right" : "left",
            verticalAlign: "middle",
            rich: { n: { fill: ctx.selected(d.key) ? t.ink : t.muted, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily }, v: { fill: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily } },
            opacity: 1,
            enterFrom: { opacity: 0 },
          },
          blur: fade,
          enterAnimation: appear,
        });
      }
      return { type: "group", focus: p.select ? "none" : "self", children };
    };

    // Rings, group names, the key and the size key: decoration, drawn once and never interactive.
    const renderDeco = () => {
      if (!f) return null;
      const children: any[] = [];
      const dotted = { stroke: t.muted, lineWidth: 1, lineDash: [1, 4], lineCap: "round", fill: "none" };
      if (ringMode === "all") children.push({ type: "circle", shape: { cx: f.all.x, cy: f.all.y, r: f.all.r }, style: dotted });
      if (groupRings) {
        f.rings.forEach((ring, gi) => {
          children.push({ type: "circle", shape: { cx: ring.x, cy: ring.y, r: ring.r }, style: dotted });
          const g = groups[gi];
          const room = ring.r * 1.5;
          const name = upper(groupName(g));
          const sum = ctx.fmt(Math.round(groupTotal(g) * 100) / 100);
          const full = measureText(name, 11, t.fontFamily, 700) + 8 + measureText(sum, 11, t.fontFamily);
          const withSum = full <= room;
          const label = withSum ? name : truncateText(name, room, 11, t.fontFamily, 700);
          if (label.replace("…", "").length < 3) return;
          const w = withSum ? full : measureText(label, 11, t.fontFamily, 700);
          const y = ring.y - ring.r;
          // The name sits on the ring; a patch of surface breaks the line behind it.
          children.push({ type: "rect", shape: { x: ring.x - w / 2 - 7, y: y - 8, width: w + 14, height: 16 }, style: { fill: t.surface } });
          children.push({
            type: "text",
            style: { text: withSum ? `{n|${label}}{g|}{v|${sum}}` : `{n|${label}}`, x: ring.x, y, align: "center", verticalAlign: "middle", rich: { n: { fill: t.ink, fontSize: 11, fontWeight: 700, fontFamily: t.fontFamily }, g: { width: 8 }, v: { fill: t.muted, fontSize: 11, fontFamily: t.fontFamily } } },
          });
        });
      }
      for (const item of keyItems) {
        children.push({ type: "circle", shape: { cx: item.x + 5, cy: item.y, r: 4 }, style: { fill: fillOf(nodes[item.i]) } });
        children.push({
          type: "text",
          style: { text: `{n|${item.name}}{g|}{v|${item.value}}`, x: item.x + 14, y: item.y, verticalAlign: "middle", rich: { n: { fill: ctx.selected(nodes[item.i].key) ? t.ink : t.muted, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily }, g: { width: 6 }, v: { fill: t.inkSecondary, fontSize: 12, fontFamily: t.fontFamily } } },
        });
      }
      const lb = legendAt ? legendBox(k) : null;
      if (lb && legendAt) {
        const base = legendAt.y + lb.h - 2;
        const cx = legendAt.x + lb.R;
        const ys = dodge(lb.vs.map((v) => base - 2 * Math.sqrt(v) * k), 14, legendAt.y + 6, base - 4);
        lb.vs.forEach((v, vi) => {
          const r = Math.sqrt(v) * k;
          children.push({ type: "circle", shape: { cx, cy: base - r, r }, style: { stroke: t.muted, lineWidth: 1, fill: "none" } });
          children.push({ type: "polyline", shape: { points: [[cx, base - 2 * r], [cx + lb.R + 4, ys[vi]], [cx + lb.R + 10, ys[vi]]] }, style: { stroke: t.muted, lineWidth: 1, lineDash: [1, 3], lineCap: "round", fill: "none" } });
          children.push({ type: "text", style: { text: ctx.fmt(v), x: cx + lb.R + 14, y: ys[vi], fill: t.muted, fontSize: 11, fontFamily: t.fontFamily, verticalAlign: "middle" } });
        });
      }
      return { type: "group", silent: true, children };
    };

    const sorted = [...nodes].sort((a, b) => b.value - a.value);
    const legend: LegendItem[] =
      grouped && colorBy === "group" && !groupRings ? groups.slice(0, MAX_COLOURS).map((g, gi) => ({ name: groupName(g), color: ctx.color(g, gi), shape: "dot" as const, muted: anyHighlight && ctx.dimmed(g) })) : [];

    return {
      legend,
      alt: n
        ? `Packed circles of ${p.value} by ${grouped ? `${p.group} and ` : ""}${p.name}: ${n} circles sized by area, totalling ${ctx.fmt(Math.round(total * 100) / 100)}. Largest: ${sorted.slice(0, 3).map((d) => `${d.key} ${ctx.fmt(d.value)}`).join(", ")}. Smallest: ${sorted[n - 1].key} ${ctx.fmt(sorted[n - 1].value)}.${grouped ? ` Groups: ${groups.map((g) => `${groupName(g)} ${ctx.fmt(Math.round(groupTotal(g) * 100) / 100)}`).join(", ")}.` : ""}`
        : `Packed circles of ${p.value}: no positive values.`,
      option: {
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const node = nodes[d.dataIndex];
            if (!node || d.seriesId !== "circles") return "";
            const rows = [{ name: p.value, value: ctx.fmt(node.value), color: fillOf(node) }, { name: "Share of total", value: pct(node.value / total) }];
            if (grouped) rows.push({ name: `Share of ${groupName(node.group)}`, value: pct(node.value / groupTotal(node.group)) });
            return tooltipHtml(ctx, node.key, rows);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "deco", type: "custom" as const, coordinateSystem: "none" as any, silent: true, z: 1, tooltip: { show: false }, renderItem: renderDeco as any, data: [0] },
          {
            id: "circles",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            z: 2,
            ...morph,
            animationDurationUpdate: 600,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            // With `select` on, a click rebuilds the option under the pointer and ECharts leaves the other marks stuck in their blur state, so hover focus is off.
            emphasis: { focus: p.select ? ("none" as const) : ("self" as const) },
            renderItem: renderItem as any,
            data: nodes.map((d) => ({ id: d.key, name: d.key, value: [d.value] })),
          },
        ],
      },
    };
  },
});

// Illustrative: an invented city budget.
const budget = [
  ["Schools", 412], ["Public transport", 268], ["Police", 231], ["Waste and recycling", 96], ["Social housing", 187], ["Parks", 44], ["Libraries", 23], ["Street lighting", 17], ["Fire service", 88],
  ["Road repair", 121], ["Museums", 12], ["Public health", 74], ["Animal control", 3], ["Elections", 2], ["Flood defences", 31], ["Youth centres", 9], ["Tourism office", 5], ["Cemeteries", 4],
].map(([service, m]) => ({ service, m }));

// Illustrative: an invented app catalogue with long names and very uneven values.
const apps = [
  ["Messaging", "Chatter", 940], ["Messaging", "Paperplane", 310], ["Messaging", "Hello Neighbour Community Boards", 42], ["Messaging", "Ping", 18], ["Messaging", "Semaphore", 6],
  ["Video", "Loop", 1280], ["Video", "Screening Room", 260], ["Video", "Clipboard", 95], ["Video", "Matinee", 30], ["Video", "Super 8", 11], ["Video", "Flicker", 4],
  ["Maps", "Wayfinder", 620], ["Maps", "Trailhead Offline Hiking Maps", 58], ["Maps", "Kerbside", 21], ["Maps", "Bus Stop", 9],
  ["Payments", "Tally", 480], ["Payments", "Split the Bill", 130], ["Payments", "Piggybank", 64], ["Payments", "Coinjar", 12], ["Payments", "Ledger Lite", 3],
  ["Games", "Block Garden", 350], ["Games", "Word Ladder", 170], ["Games", "Tiny Racers", 88], ["Games", "Marble Run", 37], ["Games", "Chess Club", 15], ["Games", "Dominoes", 7], ["Games", "Hex", 2],
].map(([category, app, users]) => ({ category, app, users }));

export const examples = {
  "Flat, with highlight, icons and a size key": {
    data: budget,
    name: "service",
    value: "m",
    format: "${value}m",
    highlight: "Schools",
    icon: { Schools: "house", "Public transport": "car", Parks: "tree" },
    sizeLegend: true,
    select: true,
    title: "Schools take $412 million of the city's $1,627 million budget",
    subtitle: "Annual spending by service, $ million. Click a circle to select it.",
    note: "Illustrative figures for an invented city",
  },
  "Shaded by value inside one ring": {
    theme: "paper",
    data: budget.slice(0, 9),
    name: "service",
    value: "m",
    format: "${value}m",
    colorBy: "value",
    ring: "all",
    title: "Nine services cost $1,366 million a year",
    subtitle: "Annual spending by service, $ million",
    note: "Illustrative figures for an invented city",
  },
  "Stress: 27 circles in 5 groups, long names, values from 2 to 1,280": {
    theme: "dusk",
    data: apps,
    name: "app",
    value: "users",
    group: "category",
    format: "{value}k",
    sizeLegend: true,
    height: 620,
    title: "Loop has 1,280 thousand monthly users",
    subtitle: "Monthly active users of 27 apps by category, thousands",
    note: "Illustrative figures for an invented app catalogue",
  },
};
