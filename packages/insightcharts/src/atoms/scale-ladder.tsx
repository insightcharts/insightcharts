import { CustomChart } from "echarts/charts";
import { alpha, inkOn, mix, ramp } from "../core/color";
import { defineChart } from "../core/define";
import { resolveIcon, type IconInput } from "../core/icons";
import { dodge, measureText, truncateText } from "../core/layout";
import { morph, tooltipHtml } from "../core/parts";
import { niceStep, toNumber } from "../data/transform";

export interface ScaleLadderZone {
  /** Where the zone starts, in data units. */
  from: number;
  /** Where the zone ends. */
  to: number;
  /** The zone's name. */
  label: string;
}

export interface ScaleLadderProps {
  /** Field holding each item's name. */
  name: string;
  /** Field holding each item's position on the scale. */
  value: string;
  /** One icon for every item: a built-in name or a `path://` string. Items without an icon get a dot. */
  icon?: IconInput;
  /** Field holding a per-item icon (a built-in name or `path://` string). Overrides `icon`. */
  iconField?: string;
  /** `"log"` spaces the scale by powers of ten; the heading says so. Default `"linear"`. */
  scale?: "linear" | "log";
  /** `"up"`: larger values higher (height, temperature). `"down"`: larger values lower (depth, age). Default `"up"`. */
  direction?: "up" | "down";
  /** Start of the scale. Default: a round number at or below the smallest value. */
  min?: number;
  /** End of the scale. Default: a round number at or above the largest value. */
  max?: number;
  /** Values that get a boxed label on the band. Default: round steps (powers of ten on a log scale). */
  ticks?: number[];
  /** Named ranges along the scale, shaded across the graphic and named along its outer edge. */
  zones?: ScaleLadderZone[];
  /** Heading over the band: the measure and its unit, e.g. "Depth, metres". */
  scaleLabel?: string;
  /** Display names for item keys. */
  names?: Record<string, string>;
  /** Width of the band in px. Default 60, or 46 on narrow screens. Tick boxes widen with it. */
  bandWidth?: number;
}

type _LadderItem = { key: string; name: string; value: number; icon?: string };

function _ladderItems(rows: Record<string, unknown>[], p: Pick<ScaleLadderProps, "name" | "value" | "icon" | "iconField" | "scale" | "names">): _LadderItem[] {
  const items: _LadderItem[] = [];
  for (const r of rows) {
    const v = toNumber(r[p.value]);
    if (Number.isNaN(v) || (p.scale === "log" && v <= 0)) continue;
    const key = String(r[p.name] ?? "");
    const own = p.iconField ? r[p.iconField] : undefined;
    items.push({ key, name: p.names?.[key] ?? key, value: v, icon: typeof own === "string" && own ? own : p.icon });
  }
  return items;
}

/**
 * A tall illustrated scale. The band is the scale itself, boxed labels mark round values on it,
 * and every item hangs off its true position by a leader, alternating sides so names stay apart.
 */
export const ScaleLadder = defineChart<ScaleLadderProps>({
  name: "scale-ladder",
  title: "Scale ladder",
  category: "poster",
  description: "A tall vertical band graded along one scale (linear or log, running up or down) with each item placed at its true position and labelled with an icon, its name and its value on alternating sides.",
  whenToUse: "Answering how deep, how high, how hot, how old or how far each of 4 to about 20 things is on one shared scale, when the reader needs the positions themselves: depths, altitudes, temperatures, ages, distances. Use `zones` to name ranges along the scale.",
  avoid: "Comparing sizes rather than positions (use bar-chart or lollipop-chart); events with start and end dates (use timeline-chart); a distribution of many unnamed values (use strip-plot or histogram).",
  use: [CustomChart],
  defaults: { scale: "linear", direction: "up" },
  selectField: (p) => p.name,
  // Tall by design: on a phone every label sits on one side, so each item needs its own 50px.
  height: (_p, rows) => Math.max(480, rows.length * 50 + 70),
  props: [
    { name: "name", type: "string", required: true, description: "Field holding each item's name." },
    { name: "value", type: "string", required: true, description: "Field holding each item's position on the scale." },
    { name: "icon", type: "IconInput", description: "One icon for every item: a built-in name or a `path://` string. Items without an icon get a dot." },
    { name: "iconField", type: "string", description: "Field holding a per-item icon name or `path://` string. Overrides `icon`." },
    { name: "scale", type: '"linear" | "log"', default: '"linear"', description: "Log spaces the scale by powers of ten; the heading over the band says so." },
    { name: "direction", type: '"up" | "down"', default: '"up"', description: "`up`: larger values higher (height, temperature). `down`: larger values lower (depth, age)." },
    { name: "min", type: "number", description: "Start of the scale. Default: a round number at or below the smallest value." },
    { name: "max", type: "number", description: "End of the scale. Default: a round number at or above the largest value." },
    { name: "ticks", type: "number[]", description: "Values that get a boxed label on the band. Default: round steps, or powers of ten on a log scale." },
    { name: "zones", type: "{ from: number; to: number; label: string }[]", description: "Named ranges along the scale, shaded across the graphic and named along its outer edge." },
    { name: "scaleLabel", type: "string", description: 'Heading over the band: the measure and its unit, e.g. "Depth, metres".' },
    { name: "names", type: "Record<string, string>", description: "Display names for item keys." },
    { name: "bandWidth", type: "number", description: "Width of the band in px, at most 40% of the plot width. Default 60, or 46 on narrow screens." },
  ],
  example: {
    theme: "magenta",
    type: "scale-ladder",
    data: [
      { thing: "Fridge", c: 4 },
      { thing: "Chocolate melts", c: 34 },
      { thing: "Egg white sets", c: 62 },
      { thing: "Water boils", c: 100, icon: "drop" },
      { thing: "Sugar caramelises", c: 170 },
      { thing: "Deep-frying oil", c: 180, icon: "drop" },
      { thing: "Bread bakes", c: 220 },
      { thing: "Home oven at full heat", c: 250 },
      { thing: "Wood-fired pizza oven", c: 450 },
    ],
    name: "thing",
    value: "c",
    iconField: "icon",
    format: "{value}°C",
    scaleLabel: "Temperature",
    min: 0,
    max: 500,
    zones: [
      { from: 0, to: 100, label: "Below boiling" },
      { from: 100, to: 250, label: "Home oven range" },
      { from: 250, to: 500, label: "Wood-fired oven range" },
    ],
    title: "Nine kitchen temperatures from 4°C to 450°C",
    subtitle: "Typical temperatures in a kitchen, degrees Celsius",
    note: "Approximate, rounded figures.",
  },
  build(p, ctx) {
    const t = ctx.tokens;
    const fmt = ctx.fmt;
    const log = p.scale === "log";
    const down = p.direction === "down";
    const items = _ladderItems(ctx.rows, p).sort((a, b) => a.value - b.value);
    const n = items.length;
    const zones = (p.zones ?? []).filter((z) => Number.isFinite(z.from) && Number.isFinite(z.to) && (!log || (z.from > 0 && z.to > 0))).map((z) => ({ ...z, from: Math.min(z.from, z.to), to: Math.max(z.from, z.to) }));

    // Domain: round ends that contain every item and zone.
    const all = [...items.map((it) => it.value), ...zones.flatMap((z) => [z.from, z.to])];
    const vMin = all.length ? Math.min(...all) : 0;
    const vMax = all.length ? Math.max(...all) : 1;
    let lo: number;
    let hi: number;
    let ticks: number[] = [];
    if (log) {
      lo = p.min && p.min > 0 ? p.min : 10 ** Math.floor(Math.log10(vMin || 1));
      hi = p.max && p.max > lo ? p.max : 10 ** Math.ceil(Math.log10(vMax || 10));
      if (hi <= lo) hi = lo * 10;
      for (let e = Math.ceil(Math.log10(lo) - 1e-9); 10 ** e <= hi * (1 + 1e-9); e++) ticks.push(10 ** e);
    } else {
      const step = niceStep((vMax - vMin || Math.abs(vMax) || 1) / 5);
      lo = p.min ?? (vMin >= 0 && vMin < step ? 0 : Math.floor(vMin / step) * step);
      hi = p.max ?? Math.ceil(vMax / step) * step;
      if (hi <= lo) hi = lo + step;
      const tickStep = niceStep((hi - lo) / 5);
      for (let v = Math.ceil(lo / tickStep - 1e-9) * tickStep; v <= hi + tickStep * 1e-6; v += tickStep) ticks.push(Math.abs(v) < tickStep * 1e-6 ? 0 : v);
    }
    if (p.ticks?.length) ticks = p.ticks.filter((v) => v >= lo && v <= hi && (!log || v > 0)).sort((a, b) => a - b);
    const f = (v: number) => (log ? Math.log10(v) : v);

    const W = ctx.width;
    const H = ctx.height;
    const compact = ctx.compact;
    const heading = [p.scaleLabel, log ? "log scale" : ""].filter(Boolean).join(", ");
    const boxH = 22;
    const top = (heading ? 24 : 2) + boxH / 2;
    const bottom = H - boxH / 2 - 2;
    const span = Math.max(40, bottom - top);
    const pos = (v: number) => {
      const u = Math.min(1, Math.max(0, (f(v) - f(lo)) / (f(hi) - f(lo) || 1)));
      return down ? top + u * span : bottom - u * span;
    };

    // The band sits in the middle with labels on both sides; on a phone it moves to the left edge and every label goes right.
    const bandW = Math.round(Math.min(Math.max(16, p.bandWidth && p.bandWidth > 0 ? p.bandWidth : compact ? 46 : 60), Math.max(16, W * 0.4)));
    const bandX = compact ? 10 : Math.round((W - bandW) / 2);
    const cx = bandX + bandW / 2;
    const reach = compact ? 22 : 34;
    const side = items.map((_it, i) => (compact ? 1 : i % 2 === 0 ? 1 : -1));

    // Band segments: one flat step of the sequential ramp per zone (or per tick interval), light at the low end.
    const cuts = zones.length ? [...new Set([lo, hi, ...zones.flatMap((z) => [z.from, z.to])])].filter((v) => v >= lo && v <= hi).sort((a, b) => a - b) : [...new Set([lo, ...ticks, hi])].sort((a, b) => a - b);
    const segments = cuts.slice(0, -1).map((from, i) => {
      const to = cuts[i + 1];
      const zone = zones.find((z) => z.from <= from && z.to >= to);
      return { from, to, zone, fill: "" };
    });
    const tinted = segments.filter((s) => !zones.length || s.zone);
    tinted.forEach((s, i) => (s.fill = ramp(t.sequential, tinted.length > 1 ? 0.12 + (0.88 * i) / (tinted.length - 1) : 0.6)));
    for (const s of segments) if (!s.fill) s.fill = mix(t.surface, t.context, 0.55);

    // Boxed tick labels; any that would touch the previous one is dropped, keeping both ends.
    const tickAt = ticks.map(pos);
    const shownTicks: number[] = [];
    ticks.forEach((_v, i) => {
      const prev = shownTicks[shownTicks.length - 1];
      if (prev === undefined || Math.abs(tickAt[i] - tickAt[prev]) >= boxH + 6) shownTicks.push(i);
      else if (i === ticks.length - 1 && shownTicks.length > 1) shownTicks.splice(-1, 1, i);
    });

    // Item labels: two lines (name, value), spread apart on each side and tied back with a leader.
    const nameSize = 13;
    const valueSize = 16;
    const pitch = 40;
    const iconH = 22;
    const iconOf = items.map((it) => (it.icon ? resolveIcon(it.icon) : null));
    const iconW = Math.max(0, ...iconOf.map((ic) => (ic ? Math.min(28, iconH * ic.aspect) : 0)));
    const iconRoom = iconW ? iconW + 8 : 0;
    // Zone names take a strip along the outer edge.
    const zoneStrip = zones.length ? 22 : 0;
    const textRoom = Math.max(40, (compact ? W - bandX - bandW : bandX) - reach - iconRoom - 2 - zoneStrip);
    const truePos = items.map((it) => pos(it.value));
    const labelY = new Array<number>(n).fill(0);
    for (const s of [-1, 1]) {
      const idx = items.map((_it, i) => i).filter((i) => side[i] === s);
      const loY = Math.min(top, bottom) + 14;
      const hiY = Math.max(top, bottom) - 14;
      // Shrink the pitch before letting labels run off the ends of a short figure.
      const gap = Math.min(pitch, idx.length > 1 ? (hiY - loY) / (idx.length - 1) : pitch);
      let ys = dodge(idx.map((i) => truePos[i]), gap, loY, hiY);
      for (let pass = 0; pass < 6; pass++) {
        const sorted = [...ys].sort((a, b) => a - b);
        if (!sorted.some((v, k) => k > 0 && v - sorted[k - 1] < gap - 0.5)) break;
        ys = dodge(ys, gap, loY, hiY);
      }
      idx.forEach((i, k) => (labelY[i] = ys[k]));
    }
    const names = items.map((it) => truncateText(it.name, textRoom, nameSize, t.fontFamily, 600));
    const zoneOf = (v: number) => zones.find((z) => v >= z.from && v <= z.to);

    const renderItem = (params: any) => {
      const i = params.dataIndex;
      const it = items[i];
      if (!it) return null;
      const dim = ctx.dimmed(it.key);
      const live = ctx.selected(it.key);
      const opacity = live ? 1 : 0.35;
      const s = side[i];
      const y = truePos[i];
      const ly = labelY[i];
      const edge = s === 1 ? bandX + bandW : bandX;
      const elbow = edge + s * 10;
      const end = edge + s * (reach - 6);
      const mark = dim ? t.muted : t.ink;
      const color = ctx.selected(it.key) ? ctx.color(it.key) : alpha(ctx.color(it.key), 0.3);
      const anim = { enterAnimation: { duration: 350, delay: i * 45 } };
      const children: any[] = [
        // A notch across the band marks the exact position; the leader carries it out to the label.
        { type: "line", shape: { x1: bandX, y1: y, x2: bandX + bandW, y2: y }, style: { stroke: t.surface, lineWidth: dim ? 1 : 2, opacity }, silent: true, transition: ["shape"] },
        { type: "polyline", shape: { points: [[edge, y], [elbow, y], [end - s * 8, ly], [end, ly]] }, style: { stroke: mark, lineWidth: 1, fill: "none", opacity: opacity * (dim ? 0.7 : 1), enterFrom: { opacity: 0 } }, ...anim, transition: ["shape"] },
        { type: "circle", shape: { cx: edge, cy: y, r: dim ? 3.5 : 5 }, style: { fill: mark, stroke: t.surface, lineWidth: 2, opacity }, emphasis: { style: { fill: ctx.color(it.key) } }, transition: ["shape"] },
      ];
      let x = edge + s * reach;
      const icon = iconOf[i];
      if (icon) {
        const w = Math.min(28, iconH * icon.aspect);
        // The icon is laid out once at the origin of its own group and the group is moved: ECharts fits a path to its
        // box only when it creates it, so a path given a new box on a later render would stay where it was.
        children.push({
          type: "group",
          x: s === 1 ? x + (iconW - w) / 2 : x - iconW + (iconW - w) / 2,
          y: ly - iconH / 2,
          transition: ["x", "y"],
          children: [{ type: "path", shape: { pathData: icon.d, x: 0, y: 0, width: w, height: iconH, layout: "center" }, style: { fill: color, opacity: 1, enterFrom: { opacity: 0 } }, ...anim, blur: { style: { opacity: 0.2 } } }],
        });
      }
      x += s * iconRoom;
      const align = s === 1 ? "left" : "right";
      // The label is the natural thing to point at (the dot is 10px wide): an unpainted box over the icon, name and
      // value takes the hover and the click for this item.
      const textW = Math.max(measureText(names[i], nameSize, t.fontFamily, 600), measureText(fmt(it.value), valueSize, t.displayFamily, 300));
      const hitFrom = edge + s * (reach - 4);
      const hitTo = x + s * (textW + 4);
      children.unshift({ type: "rect", shape: { x: Math.min(hitFrom, hitTo), y: ly - 20, width: Math.abs(hitTo - hitFrom), height: 40 }, style: { fill: "rgba(0,0,0,0)" }, blur: { style: { opacity: 1 } } });
      children.push({ type: "text", silent: true, style: { x, y: ly - 9, text: names[i], fill: dim ? t.muted : t.ink, fontSize: nameSize, fontWeight: dim ? 400 : 600, fontFamily: t.fontFamily, align, verticalAlign: "middle", opacity }, transition: ["style"] });
      children.push({ type: "text", silent: true, style: { x, y: ly + 9.5, text: fmt(it.value), fill: dim ? t.muted : t.inkSecondary, fontSize: valueSize, fontWeight: 300, fontFamily: t.displayFamily, align, verticalAlign: "middle", opacity }, transition: ["style"] });
      // Custom shapes have no built-in blur: state it, so hovering one mark dims the rest.
      for (const c of children) c.blur ??= { style: { opacity: c.type === "text" ? 0.35 : 0.2 } };
      // In a custom series the hover focus is declared on the returned element. It stays on with `select`: core
      // downplays before it pushes the rebuilt option, so a click leaves no mark stuck in its blur state.
      return { type: "group", focus: "self", children };
    };

    const renderBand = () => {
      const children: any[] = [];
      // Zone washes run the full width so labels on either side read as belonging to their zone.
      for (const s of segments) {
        const a = pos(s.from);
        const b = pos(s.to);
        const y = Math.min(a, b);
        const h = Math.abs(b - a);
        if (s.zone) children.push({ type: "rect", shape: { x: 0, y, width: W, height: h }, style: { fill: alpha(s.fill, 0.1) } });
      }
      for (const s of segments) {
        const a = pos(s.from);
        const b = pos(s.to);
        const y = Math.min(a, b);
        const h = Math.abs(b - a);
        // Touching steps are separated by a hairline of the surface colour.
        children.push({ type: "rect", shape: { x: bandX, y: y + 1, width: bandW, height: Math.max(0, h - 2) }, style: { fill: s.fill, opacity: 1, enterFrom: { opacity: 0 } }, enterAnimation: { duration: 400 } });
      }
      // Zone names run up the outer edge of their wash, clear of the labels.
      for (const z of zones) {
        const a = Math.min(pos(z.from), pos(z.to));
        const b = Math.max(pos(z.from), pos(z.to));
        const room = b - a - 10;
        if (room < 30) continue;
        const text = truncateText(z.label, room, 11.5, t.fontFamily, 600);
        children.push({ type: "text", x: compact ? W - 10 : 10, y: (a + b) / 2, rotation: Math.PI / 2, style: { text, fill: t.inkSecondary, fontSize: 11.5, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      }
      return { type: "group", silent: true, children };
    };
    // Tick boxes are drawn over the item notches, so a box is never struck through by an item at the same value.
    const renderTicks = () => {
      const children: any[] = [];
      for (const i of shownTicks) {
        const text = fmt(ticks[i]);
        const w = Math.max(bandW - 14, measureText(text, 12, t.displayFamily, 700) + 14);
        children.push({ type: "rect", shape: { x: Math.max(1, cx - w / 2), y: tickAt[i] - boxH / 2, width: w, height: boxH, r: 4 }, style: { fill: t.ink, stroke: t.surface, lineWidth: 2 } });
        children.push({ type: "text", style: { x: Math.max(w / 2, cx), y: tickAt[i] + 0.5, text, fill: inkOn(t.ink), fontSize: 12, fontWeight: 700, fontFamily: t.displayFamily, align: "center", verticalAlign: "middle" } });
      }
      if (heading) {
        const w = measureText(heading, 12, t.fontFamily, 600);
        const x = Math.min(W - w / 2, Math.max(w / 2, cx));
        children.push({ type: "text", style: { x, y: 8, text: truncateText(heading, W, 12, t.fontFamily, 600), fill: t.ink, fontSize: 12, fontWeight: 600, fontFamily: t.fontFamily, align: "center", verticalAlign: "middle" } });
      }
      return { type: "group", silent: true, children };
    };

    const first = items[0];
    const lastItem = items[n - 1];
    const focus = ctx.highlight.length ? items.filter((it) => !ctx.dimmed(it.key)) : [];
    return {
      legend: [],
      alt: `Scale ladder of ${p.scaleLabel ?? p.value} for ${n} items on a ${log ? "log" : "linear"} scale from ${fmt(lo)} to ${fmt(hi)}, larger values ${down ? "lower" : "higher"}.${n ? ` Lowest value: ${first.name} (${fmt(first.value)}). Highest: ${lastItem.name} (${fmt(lastItem.value)}).` : ""}${focus.length ? ` Highlighted: ${focus.map((it) => `${it.name} (${fmt(it.value)})`).join(", ")}.` : ""}${zones.length ? ` Zones: ${zones.map((z) => `${z.label}, ${fmt(z.from)} to ${fmt(z.to)}`).join("; ")}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; an empty off-canvas cartesian series takes them instead.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        tooltip: {
          trigger: "item",
          formatter: (d: any) => {
            const it = items[d.dataIndex];
            if (!it || d.seriesId !== "items") return "";
            const zone = zoneOf(it.value);
            return tooltipHtml(ctx, it.name, [{ name: p.scaleLabel ?? p.value, value: fmt(it.value), color: ctx.color(it.key) }, ...(zone ? [{ name: "Zone", value: zone.label }] : [])]);
          },
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          { id: "band", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderBand as any, data: [0], z: 1 },
          {
            id: "items",
            type: "custom" as const,
            coordinateSystem: "none" as any,
            ...morph,
            // ECharts rebuilds every element of a custom series when universal transition is on, and its path morph
            // scrambles a group of strokes and labels. With it off the elements are kept and each one tweens through
            // its own `transition`, which is what a data change needs here.
            universalTransition: { enabled: false },
            z: 2,
            dimensions: ["value"],
            encode: { tooltip: [0] },
            emphasis: { focus: "self" as const },
            renderItem: renderItem as any,
            data: items.map((it) => ({ id: it.key, name: it.key, value: [it.value] })),
          },
          { id: "ticks", type: "custom" as const, coordinateSystem: "none" as any, silent: true, tooltip: { show: false }, renderItem: renderTicks as any, data: [0], z: 3 },
        ],
      },
    };
  },
});

export const examples = {
  "Depth, log scale, running down, one highlighted": {
    data: [
      { thing: "Water main", m: 1.2, icon: "drop" },
      { thing: "Street tree roots", m: 2, icon: "tree" },
      { thing: "Cellar floor", m: 3, icon: "house" },
      { thing: "Main sewer", m: 6 },
      { thing: "Metro platform", m: 24, icon: "person" },
      { thing: "Road tunnel", m: 40, icon: "car" },
      { thing: "Geothermal borehole", m: 180, icon: "bolt" },
      { thing: "Drinking-water well", m: 320, icon: "drop" },
    ],
    name: "thing",
    value: "m",
    iconField: "icon",
    scale: "log",
    direction: "down",
    scaleLabel: "Depth below street level, metres",
    format: "{value} m",
    highlight: "Drinking-water well",
    title: "The drinking-water well reached 320 metres below street level",
    subtitle: "Depth of eight things under one city street, metres below street level",
    note: "Illustrative figures for an invented city.",
  },
  "Stress: 14 items, crowded values, long names": {
    theme: "blueprint",
    data: [
      ["Cathedral spire", 96], ["Old telecommunications tower", 142], ["Harbour crane", 68], ["Riverside residential tower, phase two", 131], ["City hall clock tower", 74],
      ["Northgate office block", 88], ["Stadium floodlight mast", 62], ["University library", 41], ["Grain silo", 58], ["Central Station roof", 33],
      ["Suspension bridge pylon", 127], ["Wind turbine at the port, blade tip", 198], ["Water tower", 47], ["Observation wheel", 110],
    ].map(([structure, m]) => ({ structure, m })),
    name: "structure",
    value: "m",
    icon: "square",
    scaleLabel: "Height, metres",
    format: "{value} m",
    min: 0,
    title: "The port wind turbine reached 198 metres at its blade tip",
    subtitle: "Height of 14 structures in one city, metres above ground",
    note: "Illustrative figures for an invented city.",
  },
  "Height, one icon for all, one highlighted": {
    theme: "forest",
    data: [
      { tree: "Apple tree", m: 5 },
      { tree: "Silver birch", m: 20 },
      { tree: "English oak", m: 30 },
      { tree: "Norway spruce", m: 45 },
      { tree: "Douglas fir", m: 75 },
      { tree: "Coast redwood", m: 115 },
    ],
    name: "tree",
    value: "m",
    icon: "tree",
    scaleLabel: "Height, metres",
    format: "{value} m",
    min: 0,
    max: 120,
    ticks: [0, 30, 60, 90, 120],
    highlight: "Coast redwood",
    title: "The coast redwood reaches 115 metres, 23 times the apple tree",
    subtitle: "Height of six trees at maturity, metres",
    note: "Approximate, rounded figures for illustration.",
  },
};
