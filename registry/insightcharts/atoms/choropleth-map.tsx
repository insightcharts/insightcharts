"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";
import { MapChart as EMap } from "echarts/charts";
import { GeoComponent } from "echarts/components";
import { type ChartHandle, alpha, inkOn, mix, ramp, defineChart, type ChartComponent, type CommonChartProps, echarts, Figure, measureText, tooltipHtml } from "insightcharts/core";
import { toNumber } from "insightcharts/data";

/** A GeoJSON FeatureCollection. Kept structural so no GeoJSON typings are required. */
export interface GeoJsonLike {
  type: string;
  features: { type?: string; properties?: Record<string, unknown> | null; geometry?: unknown; [key: string]: unknown }[];
  [key: string]: unknown;
}

export interface ChoroplethMapProps {
  /** The map: a GeoJSON FeatureCollection object, or a URL to fetch one from. */
  geo: GeoJsonLike | string;
  /** Row field holding the region name that joins to the GeoJSON. */
  region: string;
  /** Row field holding the value. Use a rate or share, not a raw count. */
  value: string;
  /** GeoJSON feature property that holds each region's name. Default `"name"`. */
  nameProperty?: string;
  /** `"sequential"` for magnitude; `"diverging"` for values either side of a midpoint. */
  scale?: "sequential" | "diverging";
  /** Centre of the diverging scale. Default 0. */
  midpoint?: number;
  /** Fix the colour scale to `[min, max]` instead of the data's range, so maps can be compared. */
  domain?: [number, number];
  /** Print region names on the map; `"value"` adds the value on a second line. Suits tile maps and maps with few regions. Default false. */
  labels?: boolean | "value";
  /** GeoJSON feature property to print instead of the full name, e.g. a postal or ISO code. */
  labelProperty?: string;
  /** Legend text for regions without a value. */
  missingLabel?: string;
  /** Horizontal stretch for longitude. Default 0.75 suits mid-latitudes; use 1 for tile maps and projected coordinates. */
  aspectScale?: number;
}

type InnerProps = Omit<ChoroplethMapProps, "geo"> & {
  /** Name the GeoJSON was registered under. Set by the wrapper. */
  mapName: string;
  /** Region names found in the GeoJSON, for spotting regions without data. Set by the wrapper. */
  regionNames: string[];
  /** Short labels by region name, read from `labelProperty`. Set by the wrapper. */
  regionLabels?: Record<string, string>;
};

type Ring = [number, number][];
const feature = (name: string, rings: Ring[], properties: Record<string, unknown> = {}) => ({ type: "Feature", properties: { name, ...properties }, geometry: { type: "Polygon", coordinates: rings } });
const box = (x0: number, y0: number, x1: number, y1: number): Ring => [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];

/** A deliberately blocky Australia, drawn by hand for the examples: eight rectangles on an abstract grid. */
const AUSTRALIA_BLOCKS: GeoJsonLike = {
  type: "FeatureCollection",
  features: [
    feature("Western Australia", [box(0, 1, 4, 6)], { code: "WA" }),
    feature("Northern Territory", [box(4, 3.5, 6.5, 6.5)], { code: "NT" }),
    feature("South Australia", [box(4, 1, 6.5, 3.5)], { code: "SA" }),
    feature("Queensland", [[[6.5, 3], [10, 3], [10, 5.2], [8.6, 5.2], [8.6, 7.2], [7.6, 7.2], [7.6, 6.2], [6.5, 6.2], [6.5, 3]]], { code: "Qld" }),
    feature("New South Wales", [box(6.5, 1.4, 10, 3), [[8.7, 1.8], [8.7, 2.4], [9.4, 2.4], [9.4, 1.8], [8.7, 1.8]]], { code: "NSW" }),
    feature("Australian Capital Territory", [box(8.7, 1.8, 9.4, 2.4)], { code: "ACT" }),
    feature("Victoria", [box(6.5, 0.3, 9.2, 1.4)], { code: "Vic" }),
    feature("Tasmania", [box(7.6, -1.1, 8.7, -0.3)], { code: "Tas" }),
  ],
};
const EXAMPLE = {
  type: "choropleth-map",
  geo: AUSTRALIA_BLOCKS,
  data: [
    { state: "Queensland", share: 45 },
    { state: "South Australia", share: 47 },
    { state: "Western Australia", share: 39 },
    { state: "New South Wales", share: 31 },
    { state: "Australian Capital Territory", share: 29 },
    { state: "Victoria", share: 26 },
    { state: "Northern Territory", share: 22 },
    { state: "Tasmania", share: 19 },
  ],
  region: "state",
  value: "share",
  format: "{value}%",
  aspectScale: 1,
  labels: true,
  labelProperty: "code",
  height: 380,
  title: "47% of homes in South Australia had rooftop solar in 2023",
  subtitle: "Share of dwellings with a solar installation, by state and territory, 2023",
  source: "Australian PV Institute",
  note: "Approximate figures on a simplified block map",
};

const Inner = defineChart<InnerProps>({
  name: "choropleth-map",
  title: "Choropleth map",
  category: "geo",
  description: "Colours the regions of a map by a normalised value, from GeoJSON you supply.",
  whenToUse: "A rate, share or per-capita figure that varies by place, where the geographic pattern (a north-south divide, a cluster) is what the reader needs to see. Use a diverging scale for change or for values either side of a meaningful midpoint.",
  avoid: "Raw counts, which mostly map population (normalise first, or use bar-chart); ranking regions precisely (use bar-chart); a handful of regions with no spatial pattern (use bar-chart); regions so different in size that small ones vanish (use a tile-grid GeoJSON).",
  use: [EMap, GeoComponent],
  defaults: { nameProperty: "name", scale: "sequential", midpoint: 0, labels: false, missingLabel: "No data", height: 400 },
  selectField: (p) => p.region,
  markCount: (_rows, p) => p.regionNames?.length ?? 0,
  props: [
    { name: "geo", type: "GeoJSON FeatureCollection | string", required: true, description: "The map: a GeoJSON object, or a URL to fetch one from. Registered with ECharts automatically." },
    { name: "region", type: "string", required: true, description: "Row field holding the region name that joins to the GeoJSON." },
    { name: "value", type: "string", required: true, description: "Row field holding the value. Use a rate or share, not a raw count." },
    { name: "nameProperty", type: "string", default: '"name"', description: "GeoJSON feature property holding each region's name." },
    { name: "scale", type: '"sequential" | "diverging"', default: '"sequential"', description: "Sequential for magnitude; diverging for values either side of a midpoint." },
    { name: "midpoint", type: "number", default: "0", description: "Centre of the diverging scale." },
    { name: "domain", type: "[number, number]", description: "Fix the colour scale instead of using the data's range." },
    { name: "labels", type: 'boolean | "value"', default: "false", description: 'Print region names on the map; `"value"` adds the value on a second line.' },
    { name: "labelProperty", type: "string", description: "GeoJSON feature property to print instead of the full name, e.g. a postal or ISO code." },
    { name: "missingLabel", type: "string", default: '"No data"', description: "Legend text for regions without a value." },
    { name: "aspectScale", type: "number", default: "0.75", description: "Horizontal stretch for longitude; 1 for tile maps and projected coordinates." },
  ],
  example: EXAMPLE,
  build(p, ctx) {
    const t = ctx.tokens;
    const values = new Map<string, number>();
    for (const r of ctx.rows) {
      const v = toNumber(r[p.value]);
      if (r[p.region] != null && !Number.isNaN(v)) values.set(String(r[p.region]), v);
    }
    const names = p.regionNames ?? [];
    const known = names.filter((n) => values.has(n));
    const missing = names.filter((n) => !values.has(n));
    const nums = known.map((n) => values.get(n)!);
    const diverging = p.scale === "diverging";
    const mid = p.midpoint ?? 0;
    let lo = p.domain?.[0] ?? (nums.length ? Math.min(...nums) : 0);
    let hi = p.domain?.[1] ?? (nums.length ? Math.max(...nums) : 1);
    if (diverging && !p.domain) {
      // Symmetric around the midpoint so equal distances get equal colour.
      const reach = Math.max(Math.abs(hi - mid), Math.abs(lo - mid)) || 1;
      lo = mid - reach;
      hi = mid + reach;
    }
    const colors = diverging ? t.diverging : t.sequential;
    const norm = (v: number) => (hi === lo ? 0.5 : (v - lo) / (hi - lo));
    const fillOf = (name: string) => {
      const base = ramp(colors, norm(values.get(name)!));
      return ctx.selected(name) ? base : mix(t.surface, base, 0.25);
    };
    // A light region and a faded one can look alike on a sequential ramp, so the selection is also outlined.
    const selecting = !ctx.selected("\u0000");
    const picked = (name: string) => selecting && ctx.selected(name);
    // Missing must not read as "low": a neutral, hatched fill outside the ramp.
    const missingFill = mix(t.surface, t.muted, 0.16);
    const hatch = { symbol: "rect", dashArrayX: [1, 0], dashArrayY: [1.5, 4.5], rotation: -Math.PI / 4, color: alpha(t.muted, 0.55) };
    const focus = (name: string) => !ctx.dimmed(name) && ctx.dimmed("\u0000");

    // Legend: a compact continuous key above the map, plus a "no data" swatch when needed.
    const barW = ctx.compact ? 96 : 140;
    const loText = ctx.fmt(lo);
    const hiText = ctx.fmt(hi);
    const loW = measureText(loText, 11.5, t.fontFamily) + 8;
    const label = (x: number, text: string, align = "left") => ({ type: "text", silent: true, style: { x, y: 10, text, align, verticalAlign: "middle", fill: t.muted, fontSize: 11.5, fontFamily: t.fontFamily } });
    const graphic: any[] = [
      label(0, loText),
      { type: "rect", silent: true, shape: { x: loW, y: 5, width: barW, height: 9, r: 2 }, style: { fill: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: colors.map((c, i) => ({ offset: i / (colors.length - 1), color: c })) } } },
      label(loW + barW + 8, hiText),
    ];
    if (diverging) graphic.push({ type: "rect", silent: true, shape: { x: loW + barW * norm(mid) - 0.5, y: 2, width: 1, height: 15 }, style: { fill: t.inkSecondary } });
    if (missing.length) {
      const mx = loW + barW + 8 + measureText(hiText, 11.5, t.fontFamily) + 20;
      graphic.push({ type: "rect", silent: true, shape: { x: mx, y: 4, width: 11, height: 11, r: 2 }, style: { fill: missingFill, stroke: alpha(t.muted, 0.7), lineWidth: 1, lineDash: [2, 2] } }, label(mx + 17, p.missingLabel ?? "No data"));
    }

    const hiName = known.reduce<string | undefined>((a, n) => (a == null || values.get(n)! > values.get(a)! ? n : a), undefined);
    const loName = known.reduce<string | undefined>((a, n) => (a == null || values.get(n)! < values.get(a)! ? n : a), undefined);

    return {
      alt: `Choropleth map of ${p.value} by ${p.region} across ${names.length} regions${diverging ? `, on a diverging scale around ${ctx.fmt(mid)}` : ""}. ${hiName ? `Highest: ${hiName} (${ctx.fmt(values.get(hiName))}). Lowest: ${loName} (${ctx.fmt(values.get(loName!))}).` : ""}${missing.length ? ` ${missing.length} region${missing.length > 1 ? "s have" : " has"} no data: ${missing.slice(0, 6).join(", ")}.` : ""}`,
      option: {
        // Annotations are cartesian and core attaches them to the first series; on this series ECharts
        // would throw. An empty off-canvas cartesian series takes them instead, so they are ignored.
        ...(p.annotations?.length ? { grid: { left: -2000, top: -2000, width: 1, height: 1, outerBoundsMode: "none" as const }, xAxis: { type: "value" as const, show: false }, yAxis: { type: "value" as const, show: false } } : null),
        graphic,
        tooltip: {
          trigger: "item",
          formatter: (d: any) => (values.has(d.name) ? tooltipHtml(ctx, d.name, [{ name: p.value, value: ctx.fmt(values.get(d.name)), color: fillOf(d.name) }]) : tooltipHtml(ctx, d.name, [{ name: p.missingLabel ?? "No data", value: "", muted: true }])),
        },
        series: [
          ...(p.annotations?.length ? [{ id: "annotations-sink", type: "custom" as const, silent: true, tooltip: { show: false }, data: [], renderItem: () => null }] : []),
          {
            id: "map",
            type: "map" as const,
            map: p.mapName,
            nameProperty: p.nameProperty ?? "name",
            // Never pan or zoom: a map inside a scrolling page must not capture the wheel.
            roam: false,
            selectedMode: false as const,
            aspectScale: p.aspectScale ?? 0.75,
            // Fit inside the box without stretching (ECharts 6 fills the box otherwise).
            preserveAspect: "contain",
            // Centred, so a wide container does not leave the map stranded at the left edge.
            preserveAspectAlign: "center",
            preserveAspectVerticalAlign: "top",
            left: 0,
            right: 0,
            top: 30,
            bottom: 2,
            // Regions without a row fall back to this style.
            itemStyle: { areaColor: missingFill, borderColor: t.surface, borderWidth: 1, decal: hatch as any },
            label: {
              show: !!p.labels,
              color: t.muted,
              fontSize: ctx.compact ? 10.5 : 11.5,
              fontWeight: 600,
              fontFamily: t.fontFamily,
              lineHeight: 15,
              formatter: (d: any) => `${p.regionLabels?.[d.name] ?? d.name}${p.labels === "value" && values.has(d.name) ? `\n{v|${ctx.fmt(values.get(d.name))}}` : ""}`,
              rich: { v: { fontSize: ctx.compact ? 10.5 : 11.5, fontWeight: 400, fontFamily: t.fontFamily, lineHeight: 15 } },
            },
            labelLayout: { hideOverlap: true },
            emphasis: { label: { show: !!p.labels, color: t.muted }, itemStyle: { areaColor: missingFill, borderColor: t.ink, borderWidth: 1.5 } },
            select: { disabled: true },
            data: known.map((name) => {
              const fill = fillOf(name);
              return {
                name,
                value: values.get(name),
                itemStyle: { areaColor: fill, decal: { symbol: "none" } as any, ...(focus(name) || picked(name) ? { borderColor: t.ink, borderWidth: 2 } : null) },
                label: { color: inkOn(fill) },
                emphasis: { itemStyle: { areaColor: fill }, label: { color: inkOn(fill) } },
              };
            }),
          },
        ],
      },
    };
  },
});

// GeoJSON registration. ECharts keeps maps in a global registry keyed by name, so each
// distinct GeoJSON object or URL is registered once and reused by every chart that shows it.
const objectIds = new WeakMap<object, string>();
const loaded = new Map<string, { mapName: string; geo: GeoJsonLike }>();
const pending = new Map<string, Promise<{ mapName: string; geo: GeoJsonLike }>>();
let sequence = 0;

function registerObject(geo: GeoJsonLike): string {
  let name = objectIds.get(geo);
  if (!name) {
    name = `ic-geo-${++sequence}`;
    echarts.registerMap(name, geo as any);
    objectIds.set(geo, name);
  }
  return name;
}

function loadUrl(url: string): Promise<{ mapName: string; geo: GeoJsonLike }> {
  let job = pending.get(url);
  if (!job) {
    job = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load the map (${res.status} ${res.statusText}).`);
        return res.json() as Promise<GeoJsonLike>;
      })
      .then((geo) => {
        if (!geo || !Array.isArray(geo.features)) throw new Error("The map is not a GeoJSON FeatureCollection.");
        const entry = { mapName: registerObject(geo), geo };
        loaded.set(url, entry);
        return entry;
      });
    // A failed load is not cached, so a later mount can retry.
    job.catch(() => pending.delete(url));
    pending.set(url, job);
  }
  return job;
}

/**
 * A region map coloured by value. `geo` may be a GeoJSON object or a URL; this wrapper
 * loads and registers it, then hands the pure chart a map name, so the option builder
 * itself never does I/O.
 */
export const ChoroplethMap = Object.assign(
  forwardRef<ChartHandle, ChoroplethMapProps & CommonChartProps>(function ChoroplethMap(props, ref) {
    const { geo, ...rest } = props;
    const url = typeof geo === "string" ? geo : null;
    const [state, setState] = useState<{ url: string; error: Error } | { url: string; done: true } | null>(null);
    useEffect(() => {
      if (!url || loaded.has(url)) return;
      let live = true;
      loadUrl(url).then(
        () => live && setState({ url, done: true }),
        (error: unknown) => live && setState({ url, error: error instanceof Error ? error : new Error(String(error)) }),
      );
      return () => {
        live = false;
      };
    }, [url]);

    const entry = useMemo(() => {
      if (url) return loaded.get(url) ?? null;
      if (!geo || typeof geo !== "object" || !Array.isArray((geo as GeoJsonLike).features)) return null;
      return { mapName: registerObject(geo as GeoJsonLike), geo: geo as GeoJsonLike };
      // `state` is listed so a finished load re-reads the cache.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geo, url, state]);
    const nameProperty = props.nameProperty ?? "name";
    const regionNames = useMemo(() => (entry ? entry.geo.features.map((f) => String(f.properties?.[nameProperty] ?? "")).filter(Boolean) : []), [entry, nameProperty]);

    const labelProperty = props.labelProperty;
    const regionLabels = useMemo(() => {
      if (!entry || !labelProperty) return undefined;
      const out: Record<string, string> = {};
      for (const f of entry.geo.features) if (f.properties?.[nameProperty] != null && f.properties[labelProperty] != null) out[String(f.properties[nameProperty])] = String(f.properties[labelProperty]);
      return out;
    }, [entry, nameProperty, labelProperty]);

    if (!entry) {
      const failed = state && "error" in state && state.url === url ? state.error : !url ? new Error("`geo` must be a GeoJSON FeatureCollection or a URL to one.") : null;
      return <Figure title={props.title} subtitle={props.subtitle} source={props.source} note={props.note} status={failed ? "error" : "loading"} error={failed} height={props.height ?? 400} theme={props.theme} mode={props.mode} className={props.className} style={props.style} />;
    }
    return <Inner ref={ref} {...rest} mapName={entry.mapName} regionNames={regionNames} regionLabels={regionLabels} />;
  }),
  { meta: Inner.meta, displayName: Inner.meta.component },
) as ChartComponent<ChoroplethMapProps>;
