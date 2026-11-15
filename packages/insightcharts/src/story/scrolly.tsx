import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInsightStyles } from "../core/figure";
import { useColorMode, type ModeInput } from "../core/mode";
import { useInsightConfig, useTheme } from "../core/provider";
import { chromeVars, type ThemeInput } from "../core/theme";

export interface StoryStep {
  /** Stable id, also used as the anchor for deep links. */
  id?: string;
  /** The text for this step: one or two plain sentences that state what the chart shows at this step, with the number. */
  content: ReactNode;
  /** Any other keys are yours: the state the graphic should be in at this step. */
  [key: string]: unknown;
}

export interface StoryState<S extends StoryStep = StoryStep> {
  /** Index of the active step. */
  index: number;
  step: S;
  /** 0 to 1 through the active step (scroll mode only; 0 otherwise). */
  progress: number;
  /** Total number of steps. */
  count: number;
}

export interface ScrollyProps<S extends StoryStep = StoryStep> {
  steps: S[];
  /** Renders the graphic for the active step. Change ONE thing per step: the data, the highlight, or the encoding. */
  children: (state: StoryState<S>) => ReactNode;
  /**
   * `"scroll"`: the graphic pins while the steps scroll past.
   * `"swipe"`: steps become cards that swipe horizontally under the graphic.
   * `"steps"`: previous/next buttons only, the static-friendly fallback.
   * `"auto"` (default): scroll on wide screens, swipe on touch screens under 640px.
   */
  mode?: "auto" | "scroll" | "swipe" | "steps";
  /** Which side the text column sits on in scroll mode. Narrow containers always overlay. */
  side?: "left" | "right";
  /** Distance from the top of the viewport at which the graphic pins. */
  stickyTop?: number | string;
  /** Scroll distance per step, as a CSS length. Default `80vh`. */
  stepHeight?: string;
  /** Controlled active index. */
  index?: number;
  onStepChange?: (index: number, step: S) => void;
  theme?: ThemeInput;
  colorMode?: ModeInput;
  className?: string;
  style?: CSSProperties;
}

const card: CSSProperties = { background: "var(--_ic-surface)", border: "1px solid var(--_ic-grid)", borderRadius: 12, padding: "1rem 1.125rem", fontSize: "1rem", lineHeight: 1.55, color: "var(--_ic-ink)", boxShadow: "0 4px 20px rgba(0,0,0,.06)" };
const navButton: CSSProperties = { all: "unset", cursor: "pointer", padding: "0.3rem 0.7rem", borderRadius: 999, border: "1px solid var(--_ic-grid)", fontSize: "0.8125rem", color: "var(--_ic-ink)" };

/**
 * A sequence of text steps driven by scroll or swipe. The graphic stays in place and changes state as the
 * reader moves through the steps; because the same chart instance receives each new
 * state, ECharts morphs between them. Every step is reachable by keyboard, and all the
 * text is in the document, so the story still reads with scripting or motion off.
 */
export function Scrolly<S extends StoryStep = StoryStep>(props: ScrollyProps<S>) {
  const { steps, children, side = "left", stickyTop = 0, stepHeight = "80vh", onStepChange, className, style } = props;
  useInsightStyles();
  const config = useInsightConfig();
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const stepEls = useRef<(HTMLElement | null)[]>([]);
  const theme = useTheme(props.theme);
  const { mode: colorMode } = useColorMode(root, props.colorMode ?? config.mode);
  const [internal, setInternal] = useState(0);
  const [progress, setProgress] = useState(0);
  const [width, setWidth] = useState(1024);
  const index = Math.min(steps.length - 1, Math.max(0, props.index ?? internal));
  const latest = useRef({ onStepChange, steps, index });
  latest.current = { onStepChange, steps, index };

  useEffect(() => {
    const node = root.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const requested = props.mode ?? "auto";
  const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  const mode = requested === "auto" ? (width < 640 && coarse ? "swipe" : "scroll") : requested;
  const narrow = width < 768;

  const go = useCallback((next: number) => {
    const { steps: s, index: current, onStepChange: cb } = latest.current;
    const clamped = Math.min(s.length - 1, Math.max(0, next));
    if (clamped === current) return;
    setInternal(clamped);
    cb?.(clamped, s[clamped] as S);
  }, []);

  // Scroll mode: the step crossing the middle of the viewport is the active one.
  useEffect(() => {
    if (mode !== "scroll" || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) go(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    stepEls.current.forEach((el) => el && io.observe(el));
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = stepEls.current[latest.current.index];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight / 2 - r.top) / Math.max(1, r.height)));
        setProgress((prev) => (Math.abs(prev - p) < 0.01 ? prev : p));
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [mode, steps.length, go]);

  // Swipe mode: the card snapped into view is the active one.
  const onStripScroll = useCallback(() => {
    const el = strip.current;
    if (el) go(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
  }, [go]);
  const jump = useCallback(
    (next: number) => {
      const el = strip.current;
      if (el && mode === "swipe") el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      else go(next);
    },
    [go, mode],
  );

  const state: StoryState<S> = { index, step: steps[index], progress: mode === "scroll" ? progress : 0, count: steps.length };
  const vars = chromeVars(theme[colorMode]) as CSSProperties;
  const graphic = steps.length ? children(state) : null;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") jump(index + 1);
    else if (e.key === "ArrowLeft") jump(index - 1);
  };

  if (mode === "scroll") {
    const overlay = narrow;
    return (
      <div ref={root} data-slot="ic-scrolly" data-mode="scroll" data-ic-mode={colorMode} className={className} style={{ ...vars, fontFamily: "var(--_ic-font)", position: "relative", display: overlay ? "block" : "grid", gridTemplateColumns: side === "left" ? "minmax(0, 1fr) minmax(0, 1.8fr)" : "minmax(0, 1.8fr) minmax(0, 1fr)", gap: "2.5rem", ...style }}>
        <div data-slot="ic-scrolly-graphic" style={{ position: "sticky", top: stickyTop, alignSelf: "start", order: side === "left" && !overlay ? 2 : 0, zIndex: 0, minWidth: 0, ...(overlay ? { background: "var(--_ic-surface)", paddingBlock: "0.75rem" } : { height: `calc(100vh - ${typeof stickyTop === "number" ? `${stickyTop}px` : stickyTop})`, display: "flex", flexDirection: "column", justifyContent: "center" }) }}>
          {graphic}
        </div>
        <div data-slot="ic-scrolly-steps" style={{ position: "relative", zIndex: 1, minWidth: 0, pointerEvents: overlay ? "none" : undefined }}>
          {steps.map((s, i) => (
            <section key={s.id ?? i} id={s.id} ref={(el) => void (stepEls.current[i] = el)} data-index={i} data-slot="ic-scrolly-step" data-active={i === index || undefined} style={{ minHeight: stepHeight, display: "flex", alignItems: "center", paddingBlock: "1rem" }}>
              <div style={{ ...card, pointerEvents: "auto", width: "100%", opacity: i === index ? 1 : 0.4, transition: "opacity .3s" }}>{s.content}</div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={root} data-slot="ic-scrolly" data-mode={mode} data-ic-mode={colorMode} className={className} style={{ ...vars, fontFamily: "var(--_ic-font)", minWidth: 0, ...style }} onKeyDown={onKey}>
      <div data-slot="ic-scrolly-graphic">{graphic}</div>
      {mode === "swipe" ? (
        <div ref={strip} data-slot="ic-scrolly-steps" onScroll={onStripScroll} tabIndex={0} aria-label="Story steps" style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", marginTop: "0.75rem", outlineOffset: 2 }}>
          {steps.map((s, i) => (
            <section key={s.id ?? i} id={s.id} data-slot="ic-scrolly-step" data-active={i === index || undefined} aria-hidden={i !== index} style={{ flex: "0 0 100%", scrollSnapAlign: "center", padding: "0 2px", boxSizing: "border-box" }}>
              <div style={card}>{s.content}</div>
            </section>
          ))}
        </div>
      ) : (
        <section data-slot="ic-scrolly-step" data-active aria-live="polite" style={{ marginTop: "0.75rem" }}>
          <div style={card}>{steps[index]?.content}</div>
        </section>
      )}
      <nav data-slot="ic-scrolly-nav" aria-label="Story navigation" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginTop: "0.75rem" }}>
        <button type="button" style={{ ...navButton, opacity: index <= 0 ? 0.4 : 1 }} disabled={index <= 0} onClick={() => jump(index - 1)}>
          Previous
        </button>
        <div style={{ display: "flex", gap: 6 }} aria-hidden>
          {steps.map((_, i) => (
            <span key={i} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 999, background: i === index ? "var(--_ic-accent)" : "var(--_ic-grid)", transition: "width .25s" }} />
          ))}
        </div>
        {/* With no steps the index is -1: nothing to announce, and Previous must not be live. */}
        {steps.length ? (
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            Step {index + 1} of {steps.length}
          </span>
        ) : null}
        <button type="button" style={{ ...navButton, opacity: index === steps.length - 1 ? 0.4 : 1 }} disabled={index === steps.length - 1} onClick={() => jump(index + 1)}>
          Next
        </button>
      </nav>
    </div>
  );
}
