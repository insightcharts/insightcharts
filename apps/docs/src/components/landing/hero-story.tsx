"use client";

import { BeeswarmChart, BigNumber, ChoroplethMap, InsightData, InsightProvider, RibbonChart, SankeyChart, WaffleChart, useInsightData } from "insightcharts";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { DISTRICTS, districtTiles, MODES, trips, type Mode, type TripRow } from "./hero-data";
import { chromeOf, HERO_THEMES, type HeroTheme } from "./hero-themes";

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
  return <p className="mb-2 text-[11px] font-medium uppercase leading-4 tracking-[0.12em] text-[var(--h-muted)] transition-colors duration-700">{children}</p>;
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
      <span aria-live="polite" className="truncate text-[var(--h-ink2)] transition-colors duration-700">
        {active.length ? active.join(" · ") : "Click any mark to filter"}
      </span>
      <button
        type="button"
        onClick={() => store?.clear()}
        disabled={!active.length}
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-[var(--h-line)] px-2.5 font-medium text-[var(--h-ink)] transition-colors duration-700 hover:bg-[var(--h-wash)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--h-ink)] disabled:opacity-35"
      >
        <RotateCcw className="size-3" aria-hidden />
        Reset
      </button>
    </div>
  );
}

/**
 * Shows the crossfilter working while it is mounted: it picks a district, then a trip
 * purpose, then clears, and calls `onDone`. The hero mounts it once, before the themes start
 * to rotate, and unmounts it at the first interaction, which cancels the steps still to come.
 */
function Demonstrate({ onDone }: { onDone: () => void }) {
  const store = useInsightData();
  const latest = useRef({ store, onDone });
  latest.current = { store, onDone };
  useEffect(() => {
    const timers = [
      setTimeout(() => latest.current.store?.select(ID.map, { field: "district", values: ["Harbour"] }), 2400),
      setTimeout(() => {
        latest.current.store?.select(ID.map, null);
        latest.current.store?.select(ID.purpose, { field: "purpose", values: ["Leisure"] });
      }, 5000),
      setTimeout(() => latest.current.store?.clear(), 7600),
      setTimeout(() => latest.current.onDone(), 9400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  return null;
}

/** Seconds each theme stays on show while the themes rotate. */
const DWELL = 4.2;

/**
 * One pill per theme: its name and a strip of its own colours. A radio group, so the arrow
 * keys move between themes. While the themes rotate, a bar on the active pill fills over the
 * dwell, and its end is what moves the hero to the next theme: pausing the bar pauses the rotation.
 */
function ThemePills({ active, onPick, rotating, paused, onElapsed }: { active: HeroTheme; onPick: (t: HeroTheme) => void; rotating: boolean; paused: boolean; onElapsed: () => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const i = HERO_THEMES.indexOf(active);
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? HERO_THEMES.length - 1 : null;
    if (to == null) return;
    e.preventDefault();
    const next = (to + HERO_THEMES.length) % HERO_THEMES.length;
    onPick(HERO_THEMES[next]);
    refs.current[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label="Theme" onKeyDown={onKey} className="flex min-w-0 flex-wrap gap-1.5">
      {HERO_THEMES.map((t, i) => {
        const on = t === active;
        return (
          <button
            key={t.name}
            ref={(el) => void (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onPick(t)}
            className={`relative inline-flex h-7 items-center gap-1.5 overflow-hidden rounded-full border pl-1 pr-2.5 text-xs transition-colors duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--h-ink)] ${on ? "border-[var(--h-ink)] bg-[var(--h-wash)] font-medium text-[var(--h-ink)]" : "border-[var(--h-line)] text-[var(--h-ink2)] hover:bg-[var(--h-wash)]"}`}
          >
            <span aria-hidden className="flex h-5 items-center gap-[3px] rounded-full px-1.5 ring-1 ring-[var(--h-line)]" style={{ background: t.ground }}>
              {t.tokens.categorical.slice(0, 4).map((c) => (
                <span key={c} className="size-2 rounded-full" style={{ background: c }} />
              ))}
            </span>
            {t.label}
            {on && rotating ? <span key={t.name} aria-hidden onAnimationEnd={onElapsed} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[var(--h-ink)]" style={{ animation: `hero-pill-fill ${DWELL}s linear forwards`, animationPlayState: paused ? "paused" : "running" }} /> : null}
          </button>
        );
      })}
    </div>
  );
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
      (option: Option, ctx: { tokens: { categorical: string[]; context: string } }): Option => {
        const hueOf = (mode: string) => ctx.tokens.categorical[MODES.indexOf(mode as Mode)] ?? ctx.tokens.context;
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
 * `InsightData` store. A click on a mark in any chart filters all the others, and a theme pill
 * repaints the whole piece.
 *
 * Left alone, it shows itself in one sequence: the crossfilter demo once on the first theme,
 * then the themes in turn. The rotation pauses while the pointer or the focus is inside the
 * piece, while it is off screen and while the tab is hidden. It stops for good when the reader
 * picks a theme or touches a chart. With reduced motion preferred, nothing runs by itself.
 */
export function HeroStory() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(HERO_THEMES[0]);
  // "idle" until first seen, then the demo, then the rotation. "stopped" is final unless the reader presses play.
  const [phase, setPhase] = useState<"idle" | "demo" | "rotate" | "stopped" | "manual">("idle");
  const [held, setHeld] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [away, setAway] = useState(true);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (reducedMotion() || typeof IntersectionObserver === "undefined") {
      setPhase("manual");
      return;
    }
    const seen = { visible: false, hidden: document.hidden };
    const update = () => {
      const here = seen.visible && !seen.hidden;
      setAway(!here);
      if (here) setPhase((p) => (p === "idle" ? "demo" : p));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        seen.visible = e.isIntersecting;
        update();
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    const onVisibility = () => {
      seen.hidden = document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // The first press or key inside the piece ends the demo and the rotation. The pause and play control is the exception.
  const stop = (target: EventTarget) => {
    if ((target as HTMLElement).closest?.("[data-hero-play]")) return;
    setPhase((p) => (p === "manual" ? p : "stopped"));
  };
  const pick = (t: HeroTheme) => {
    setActive(t);
    setPhase((p) => (p === "manual" ? p : "stopped"));
  };
  const next = () => setActive((t) => HERO_THEMES[(HERO_THEMES.indexOf(t) + 1) % HERO_THEMES.length]);
  const auto = phase === "demo" || phase === "rotate";
  const running = auto && !held;

  return (
    <div
      ref={root}
      data-hero-story
      data-theme={active.name}
      onPointerDown={(e) => stop(e.target)}
      onKeyDown={(e) => (e.key === "Tab" || e.key === "Shift" ? undefined : stop(e.target))}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      // Keyboard focus only: a pointer press also focuses a button, and must not hold the rotation.
      onFocus={(e) => e.target.matches(":focus-visible") && setFocus(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocus(false)}
      className="relative isolate overflow-hidden rounded-2xl text-[var(--h-ink)] shadow-[0_30px_80px_-40px_rgba(11,16,34,0.7)] ring-1 ring-[var(--h-line)] transition-colors duration-700"
      style={chromeOf(active) as CSSProperties}
    >
      {/* One layer per ground, cross-faded: a gradient cannot be animated as a background. */}
      {HERO_THEMES.map((t) => (
        <div key={t.name} aria-hidden className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700 motion-reduce:transition-none" style={{ background: t.ground, opacity: t === active ? 1 : 0 }} />
      ))}
      <InsightProvider theme={active.theme} mode={active.mode} lazy={false} renderer="svg">
        <InsightData data={trips}>
          {phase === "demo" ? <Demonstrate onDone={() => setPhase((p) => (p === "demo" ? "rotate" : p))} /> : null}
          <div className="p-4 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="text-[13px] font-medium">How a city of {DISTRICTS.length} districts gets around</p>
              <Filter />
            </div>
            <div className="mt-3 flex items-start gap-2">
              <ThemePills active={active} onPick={pick} rotating={phase === "rotate" && !held} paused={hover || focus || away} onElapsed={next} />
              {phase === "manual" ? null : (
                <button
                  type="button"
                  data-hero-play
                  aria-label={running ? "Pause the theme rotation" : "Play the theme rotation"}
                  onClick={() => {
                    if (running) setHeld(true);
                    else {
                      setHeld(false);
                      setPhase((p) => (p === "demo" ? p : "rotate"));
                    }
                  }}
                  className="ml-auto inline-grid size-7 shrink-0 place-items-center rounded-full border border-[var(--h-line)] text-[var(--h-ink)] transition-colors duration-700 hover:bg-[var(--h-wash)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--h-ink)]"
                >
                  {running ? <Pause className="size-3" aria-hidden /> : <Play className="size-3" aria-hidden />}
                </button>
              )}
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
            <p className="mt-4 text-[11px] leading-4 text-[var(--h-muted)] transition-colors duration-700">Illustrative data for an invented city. Trips in millions.</p>
          </div>
        </InsightData>
      </InsightProvider>
    </div>
  );
}
