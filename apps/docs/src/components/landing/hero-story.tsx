"use client";

import { BeeswarmChart, BigNumber, ChoroplethMap, InsightData, InsightProvider, RibbonChart, SankeyChart, WaffleChart, useInsightData } from "insightcharts";
import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DISTRICTS, districtTiles, MODES, trips, type Mode, type TripRow } from "./hero-data";

// One painted design for both site modes: a night ground, six hues for the six modes, and a
// ramp from the ground to white for magnitude, so the map never borrows a mode's colour.
const tokens = {
  surface: "#0b1022",
  ink: "#f5f6ff",
  inkSecondary: "#c3c9ea",
  muted: "#8a92bd",
  grid: "#232b52",
  axis: "#39427a",
  accent: "#4cc9f0",
  context: "#39416d",
  positive: "#3ddc97",
  negative: "#ff7a7a",
  categorical: ["#4cc9f0", "#ffd23f", "#3ddc97", "#ff6fa5", "#a594ff", "#ff9547"],
  sequential: ["#1a2146", "#35408a", "#7482d8", "#c3cbff", "#ffffff"],
};
const THEME = { name: "night", light: tokens, dark: tokens };

const GROUND = "radial-gradient(120% 90% at 12% 0%, #1b2357 0%, rgba(27,35,87,0) 55%), radial-gradient(90% 80% at 100% 100%, #2a1650 0%, rgba(42,22,80,0) 60%), #0b1022";

const sum = (groupBy: string | string[]) => ({ type: "aggregate" as const, groupBy, measures: { trips: { op: "sum" as const, field: "trips" } } });

// Selections in the shared store are keyed by an owner, and a chart is never filtered by its
// own owner's selection: it fades the marks left out instead. The three charts that draw one
// mark per mode share one owner, so picking a mode fades the other modes in all three and
// filters only the map and the figures. A chart of modes filtered to one mode would be one mark.
const ID = { mode: "hero-mode", map: "hero-map", purpose: "hero-purpose" };

const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Eases a number towards its target, so the figures count to the filtered value. */
function useTween(target: number, ms = 600): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reducedMotion() || from.current === target) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = origin + (target - origin) * eased;
      from.current = next;
      setValue(next);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);
  return value;
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium uppercase leading-4 tracking-[0.12em] text-[#8a92bd]">{children}</p>;
}

/** Three figures computed from the rows every selection leaves. */
function Figures() {
  const store = useInsightData();
  const rows = (store?.rowsFor() ?? []) as TripRow[];
  // The same rows before the mode selection, as the base for the selection's share.
  const base = (store?.rowsFor(ID.mode) ?? []) as TripRow[];
  const modes = store?.selections[ID.mode]?.values ?? [];
  const stats = useMemo(() => {
    let total = 0;
    let car = 0;
    let first = 0;
    let last = 0;
    for (const r of rows) {
      total += r.trips;
      if (r.mode === "Car") car += r.trips;
      if (r.year === "2017") first += r.trips;
      if (r.year === "2024") last += r.trips;
    }
    let all = 0;
    for (const r of base) all += r.trips;
    return { total, carFree: total ? 1 - car / total : 0, share: all ? total / all : 0, change: first ? last / first - 1 : 0 };
  }, [rows, base]);
  const total = useTween(stats.total);
  // With a mode picked, "without a car" is 0% or 100%. The mode's share of all trips says more.
  const second = useTween(modes.length ? stats.share : stats.carFree);
  const change = useTween(stats.change);
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1">
      <div className="col-span-2 lg:col-span-1">
        <BigNumber value={tripsFormat(total)} label="Trips, 2017 to 2024" size="hero" />
      </div>
      <BigNumber value={`${Math.round(second * 100)}%`} label={modes.length ? `Share made by ${modes.length === 1 ? modes[0].toLowerCase() : "these modes"}` : "Made without a car"} />
      <BigNumber value={`${change >= 0 ? "+" : "−"}${Math.abs(Math.round(change * 100))}%`} label="2024 against 2017" />
    </div>
  );
}

/** The active filter and the control that clears it. */
function Filter() {
  const store = useInsightData();
  const active = Object.values(store?.selections ?? {}).flatMap((s) => s.values ?? []);
  return (
    <div className="flex min-h-7 items-center gap-2 text-xs">
      <span aria-live="polite" className="truncate text-[#c3c9ea]">
        {active.length ? active.join(" · ") : "Click any mark to filter"}
      </span>
      <button
        type="button"
        onClick={() => store?.clear()}
        disabled={!active.length}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-2.5 font-medium text-white transition-opacity hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none disabled:opacity-35"
      >
        <RotateCcw className="size-3" aria-hidden />
        Reset
      </button>
    </div>
  );
}

/**
 * Shows the crossfilter working: once the piece is on screen and nobody has touched it, it
 * picks a district, then a trip purpose, then clears. It runs once, stops for good at the first
 * pointer or key press inside the piece, and never runs when reduced motion is preferred.
 */
function Demonstrate({ root }: { root: React.RefObject<HTMLDivElement | null> }) {
  const store = useInsightData();
  const latest = useRef(store);
  latest.current = store;
  useEffect(() => {
    const node = root.current;
    if (!node || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    let stopped = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const stop = () => {
      stopped = true;
      timers.forEach(clearTimeout);
      io.disconnect();
    };
    const at = (ms: number, run: () => void) => timers.push(setTimeout(() => !stopped && run(), ms));
    const play = () => {
      at(2400, () => latest.current?.select(ID.map, { field: "district", values: ["Harbour"] }));
      at(5000, () => {
        latest.current?.select(ID.map, null);
        latest.current?.select(ID.purpose, { field: "purpose", values: ["Leisure"] });
      });
      at(7600, () => latest.current?.clear());
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        play();
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    node.addEventListener("pointerdown", stop, { once: true });
    node.addEventListener("keydown", stop, { once: true });
    return () => {
      stop();
      node.removeEventListener("pointerdown", stop);
      node.removeEventListener("keydown", stop);
    };
  }, [root]);
  return null;
}

/** Trips are in millions: 1,316 reads as 1.32bn. */
const tripsFormat = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(2)}bn` : `${Math.round(v)}m`);

type Option = Record<string, any>;

// Purposes are not modes, so they never take a mode's colour. The chart colours every node
// when a filter leaves fewer than nine.
const neutralEnds = (option: Option, ctx: { tokens: { context: string } }): Option => ({
  ...option,
  series: (option.series as Option[]).map((s) => (s.type === "sankey" ? { ...s, data: (s.data as Option[]).map((n) => (n.origin ? n : { ...n, itemStyle: { ...n.itemStyle, color: ctx.tokens.context } })) } : s)),
});

/** The flows from each mode to each purpose. A click on a purpose picks it; a click on a mode or a flow picks the mode. */
function Flow() {
  const store = useInsightData();
  const latest = useRef(store);
  latest.current = store;
  const events = useMemo(
    () => ({
      click: (params: { dataType?: string; name?: string; data?: { origin?: boolean } }) => {
        const s = latest.current;
        if (!s || params.dataType !== "node" || params.data?.origin || !params.name) return;
        const picked = s.selections[ID.purpose]?.values ?? [];
        s.select(ID.purpose, picked.includes(params.name) ? null : { field: "purpose", values: [params.name] });
      },
    }),
    [],
  );
  return <SankeyChart id={ID.mode} select from="mode" to="purpose" value="trips" transform={sum(["mode", "purpose"])} option={neutralEnds as never} onEvents={events as never} format={tripsFormat} height={250} {...quiet} alt="Flows of trips from each mode to each purpose." />;
}

const hueOf = (mode: string) => tokens.categorical[MODES.indexOf(mode as Mode)] ?? tokens.context;

/**
 * One dot per district and mode. Every dot stays whatever is picked: a swarm of districts
 * filtered to one district would be six dots. A picked district or mode keeps its colour and
 * the rest fade. A click on a dot picks its district, the same as a click on its tile.
 */
function Swarm() {
  const store = useInsightData();
  const latest = useRef(store);
  latest.current = store;
  const selections = store?.selections ?? {};
  const districts = selections[ID.map]?.values;
  const modes = selections[ID.mode]?.values;
  // Rows filtered by purpose only. The district and the mode are shown by fading instead.
  const rows = useMemo(() => {
    const purposes = selections[ID.purpose]?.values;
    return purposes?.length ? trips.filter((r) => purposes.includes(r.purpose)) : trips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections[ID.purpose]]);
  const paint = useMemo(
    () =>
      (option: Option): Option => {
        const series = option.series as Option[];
        const isLit = (s: Option, d: Option) => (!districts?.length || districts.includes(d.name)) && (!modes?.length || modes.includes(s.id));
        // One name is enough: of a picked district's dots, only the one furthest along the axis keeps its label.
        let named: Option | undefined;
        if (districts?.length === 1) for (const s of series) if (MODES.includes(s.id)) for (const d of s.data as Option[]) if (isLit(s, d) && (!named || d.value[3] > named.value[3])) named = d;
        return {
          ...option,
          series: series.map((s) =>
            MODES.includes(s.id)
              ? {
                  ...s,
                  z: 2,
                  data: (s.data as Option[]).map((d) => {
                    const lit = isLit(s, d);
                    return { ...d, itemStyle: { ...d.itemStyle, color: hueOf(s.id), opacity: lit ? 1 : 0.28 }, z2: lit ? 2 : 0, label: d === named ? { ...d.label, show: true, position: "top" } : { show: false } };
                  }),
                }
              : s,
          ),
        };
      },
    [districts, modes],
  );
  const events = useMemo(
    () => ({
      click: (params: { name?: string }) => {
        const s = latest.current;
        if (!s || !params?.name) return;
        const picked = s.selections[ID.map]?.values ?? [];
        s.select(ID.map, picked.includes(params.name) ? null : { field: "district", values: [params.name] });
      },
    }),
    [],
  );
  return (
    <BeeswarmChart
      data={rows}
      value="rate"
      series="mode"
      label="district"
      highlight={districts}
      transform={{ type: "aggregate", groupBy: ["district", "mode"], measures: { rate: { op: "sum", field: "rate" } } }}
      format="integer"
      height={250}
      option={paint as never}
      onEvents={events as never}
      {...quiet}
      alt="Trips per resident a year by mode, one dot per district."
    />
  );
}

const quiet = { exportable: false as const, legend: false as const };

/**
 * The landing page's hero: one live piece built from library components that share a single
 * `InsightData` store. A click on a mark in any chart filters all the others.
 */
export function HeroStory() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root} data-hero-story className="relative overflow-hidden rounded-2xl text-[#f5f6ff] shadow-[0_30px_80px_-40px_rgba(11,16,34,0.7)] ring-1 ring-white/10" style={{ background: GROUND }}>
      <InsightProvider theme={THEME} mode="dark" lazy={false} renderer="svg">
        <InsightData data={trips}>
          <Demonstrate root={root} />
          <div className="p-4 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="text-[13px] font-medium text-white">
                How a city of {DISTRICTS.length} districts gets around
              </p>
              <Filter />
            </div>
            <div className="mt-5 grid gap-x-8 gap-y-7 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,5.5fr)_minmax(0,4fr)]">
              <div className="min-w-0 lg:row-span-2">
                <Figures />
                <div className="mt-7">
                  <Label>Share by mode</Label>
                  <WaffleChart id={ID.mode} select name="mode" value="trips" transform={sum("mode")} shape="circle" height={228} legend alt="Share of trips by mode, as 100 dots." exportable={false} />
                </div>
              </div>
              <div className="min-w-0">
                <Label>Trips by mode and year, ranked</Label>
                <RibbonChart id={ID.mode} select x="year" y="trips" series="mode" transform={sum(["year", "mode"])} values={false} labels="end" format={tripsFormat} height={300} {...quiet} alt="Trips by mode in each year from 2017 to 2024, as ranked ribbons." />
              </div>
              <div className="min-w-0">
                <Label>Trips by district</Label>
                <ChoroplethMap id={ID.map} select geo={districtTiles} region="district" value="trips" transform={sum("district")} labels labelProperty="code" aspectScale={1} format={tripsFormat} height={300} {...quiet} alt="Tile map of trips by district." />
              </div>
              <div className="min-w-0">
                <Label>What each mode is used for</Label>
                <Flow />
              </div>
              <div className="min-w-0">
                <Label>Trips per resident a year, by district</Label>
                <Swarm />
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-4 text-[#8a92bd]">Illustrative data for an invented city. Trips in millions.</p>
          </div>
        </InsightData>
      </InsightProvider>
    </div>
  );
}
