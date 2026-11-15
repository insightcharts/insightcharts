import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Row } from "../data/types";
import { luminance } from "./color";
import { echarts, mergeOption, type EChartsInstance, type EChartsOption } from "./echarts";
import { exportChart, type ExportOptions } from "./export";
import { useColorMode, usePrefersReducedMotion, type ColorMode, type ModeInput } from "./mode";
import { useInsightConfig, useTheme, type RendererInput } from "./provider";
import { resolveTokens, type ResolvedTokens, type ThemeInput } from "./theme";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Everything an option builder knows about where it is being drawn. */
export interface ChartContext {
  /** Design tokens with every colour resolved to a concrete value. */
  tokens: ResolvedTokens;
  mode: ColorMode;
  /** Container size in CSS px. */
  width: number;
  height: number;
  /** True under 480px wide: drop secondary labels, rotate to horizontal bars, thin the ticks. */
  compact: boolean;
  locale?: string;
  /** False when animation is disabled or the reader prefers reduced motion. */
  animate: boolean;
  /**
   * True when the surface the chart draws on is dark. Use this, not `mode`, to choose
   * overlay strengths and fades: a poster theme can paint a dark ground in light mode.
   */
  onDark: boolean;
}

export interface ChartHandle {
  /** The underlying ECharts instance, for anything the wrapper does not cover. */
  getInstance(): EChartsInstance | null;
  /** Export as PNG, JPEG, SVG, PDF, CSV or JSON. */
  export(options?: ExportOptions): Promise<Blob>;
  /** The last option pushed to ECharts. */
  getOption(): EChartsOption | null;
}

export type ChartEventHandler = (params: any, chart: EChartsInstance) => void;

export interface ChartProps {
  /** A full ECharts option, or a function of the chart context that returns one. */
  option: EChartsOption | ((ctx: ChartContext) => EChartsOption);
  /** CSS height. Default 360. Ignored when `aspect` is set. */
  height?: number | string;
  /** Width divided by height, e.g. `16 / 9`. */
  aspect?: number;
  renderer?: RendererInput;
  /** Rough number of marks, used by `renderer="auto"`. */
  markCount?: number;
  theme?: ThemeInput;
  mode?: ModeInput;
  animate?: boolean;
  /** Mount when scrolled near the viewport. Default true. */
  lazy?: boolean;
  /** Charts sharing a group id link their tooltips and axis pointers. */
  group?: string;
  /** ECharts events: `{ click: (params, chart) => {} }`. */
  onEvents?: Record<string, ChartEventHandler>;
  onReady?: (chart: EChartsInstance) => void;
  /** Called with the context each time an option is built. */
  onContext?: (ctx: ChartContext) => void;
  /** Accessible description: the chart type and measures, then the main pattern and the notable values. */
  alt?: string;
  /** Used by export. */
  exportMeta?: { title?: string; subtitle?: string; source?: string; rows?: Row[] };
  className?: string;
  style?: CSSProperties;
}

/** Theme-derived defaults applied under every option. */
export function baseOption(ctx: ChartContext): EChartsOption {
  const t = ctx.tokens;
  return {
    backgroundColor: "transparent",
    color: t.categorical,
    textStyle: { fontFamily: t.fontFamily, fontSize: t.fontSize, color: t.inkSecondary },
    animation: ctx.animate,
    animationDuration: 700,
    animationEasing: "cubicOut",
    animationDurationUpdate: 600,
    animationEasingUpdate: "cubicInOut",
    stateAnimation: { duration: 200 },
    grid: { left: 4, right: 12, top: 12, bottom: 4, outerBoundsMode: "same", outerBoundsContain: "axisLabel" },
    tooltip: {
      confine: true,
      backgroundColor: t.surface,
      borderColor: t.grid,
      borderWidth: 1,
      padding: [8, 10],
      textStyle: { color: t.ink, fontFamily: t.fontFamily, fontSize: 12 },
      extraCssText: "box-shadow:0 6px 24px rgba(0,0,0,.12);border-radius:8px;",
      axisPointer: { lineStyle: { color: t.axis, type: "solid" }, crossStyle: { color: t.axis }, label: { backgroundColor: t.ink, color: t.surface } },
    },
  };
}

/**
 * The engine: one ECharts instance with its lifecycle handled. It initialises lazily when
 * scrolled into view, resizes with its container, resolves the theme from CSS, follows
 * dark/light changes, morphs between options and disposes cleanly. Every InsightCharts
 * component renders through this; use it directly for a fully custom option.
 */
export const Chart = forwardRef<ChartHandle, ChartProps>(function Chart(props, ref) {
  const config = useInsightConfig();
  const { option, height = 360, aspect, markCount = 0, group, onEvents, onReady, onContext, alt, exportMeta, className, style } = props;
  const lazy = props.lazy ?? config.lazy;
  const rendererInput = props.renderer ?? config.renderer;
  const renderer = rendererInput === "auto" ? (markCount > 1500 ? "canvas" : "svg") : rendererInput;
  const theme = useTheme(props.theme);
  const reduced = usePrefersReducedMotion();
  const animate = (props.animate ?? config.animate) && !reduced;

  const el = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsInstance | null>(null);
  const lastOption = useRef<EChartsOption | null>(null);
  const lastCtx = useRef<ChartContext | null>(null);
  const latest = useRef({ onEvents, onReady, onContext, exportMeta, alt });
  latest.current = { onEvents, onReady, onContext, exportMeta, alt };

  const { mode, epoch } = useColorMode(el, props.mode ?? config.mode);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [visible, setVisible] = useState(!lazy);
  const [ready, setReady] = useState(0);
  const [tokens, setTokens] = useState<ResolvedTokens | null>(null);

  // Visibility: defer the (expensive) ECharts init until the chart is near the viewport,
  // which also means the entrance animation plays when the reader actually arrives.
  useEffect(() => {
    if (visible || !el.current) return;
    if (typeof IntersectionObserver === "undefined") return setVisible(true);
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setVisible(true), { rootMargin: "200px" });
    io.observe(el.current);
    return () => io.disconnect();
  }, [visible]);

  // Size: resize ECharts immediately, but debounce the React state so the option is only
  // rebuilt once a resize settles.
  useIsoLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    const read = () => {
      // Layout size, not getBoundingClientRect: a CSS-scaled ancestor must not change what
      // the chart thinks its width is.
      const next = { width: node.clientWidth, height: node.clientHeight };
      setSize((s) => (s && s.width === next.width && s.height === next.height ? s : next));
    };
    read();
    if (typeof ResizeObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      chartRef.current?.resize();
      clearTimeout(timer);
      timer = setTimeout(read, 120);
    });
    ro.observe(node);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Tokens: resolve CSS variables against this node whenever the theme, mode or page appearance changes.
  const modeTokens = theme[mode];
  useIsoLayoutEffect(() => {
    const next = resolveTokens(modeTokens, el.current);
    setTokens((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [modeTokens, epoch]);

  // Instance lifecycle. ECharts cannot initialise in a zero-sized box (a hidden tab, a
  // collapsed panel), so wait until the container has been laid out.
  const sized = !!size && size.width > 0 && size.height > 0;
  useEffect(() => {
    const node = el.current;
    if (!visible || !sized || !node) return;
    const chart = echarts.init(node, null, { renderer });
    chartRef.current = chart;
    if (group) {
      chart.group = group;
      echarts.connect(group);
    }
    setReady((n) => n + 1);
    latest.current.onReady?.(chart);
    return () => {
      chartRef.current = null;
      lastOption.current = null;
      chart.dispose();
    };
  }, [visible, sized, renderer, group]);

  // Events: bind once per name and always call the latest handler.
  const eventNames = Object.keys(onEvents ?? {}).sort().join(",");
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !eventNames) return;
    const names = eventNames.split(",");
    const handlers = names.map((name) => {
      const handler = (params: unknown) => latest.current.onEvents?.[name]?.(params, chart);
      // "zr:click" style names bind to the canvas itself, so blank areas can be handled.
      if (name.startsWith("zr:")) chart.getZr().on(name.slice(3), handler);
      else chart.on(name, handler);
      return handler;
    });
    return () => {
      if (chart.isDisposed()) return;
      names.forEach((name, i) => (name.startsWith("zr:") ? chart.getZr().off(name.slice(3), handlers[i]) : chart.off(name, handlers[i])));
    };
  }, [eventNames, ready]);

  const width = size?.width ?? 0;
  const pxHeight = size?.height ?? 0;
  const ctx = useMemo<ChartContext | null>(() => (tokens && width > 0 && pxHeight > 0 ? { tokens, mode, width, height: pxHeight, compact: width < 480, locale: config.locale, animate, onDark: luminance(tokens.surface) < 0.22 } : null), [tokens, mode, width, pxHeight, config.locale, animate]);

  // Option: built from the context and pushed whole. `notMerge` keeps the chart a pure
  // function of its props; stable series ids plus universalTransition make changes morph.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ctx) return;
    const built = typeof option === "function" ? option(ctx) : option;
    const full = mergeOption(baseOption(ctx), built);
    // Read through a ref: generated alt text arrives one render after the option that
    // produced it, and must not trigger a second push.
    const description = latest.current.alt;
    if (full.aria === undefined) full.aria = description ? { enabled: true, label: { description } } : { enabled: true };
    const first = lastOption.current === null;
    lastCtx.current = ctx;
    lastOption.current = full;
    latest.current.onContext?.(ctx);
    // Clear hover state first: a mark left emphasised under the pointer would otherwise
    // keep the rest of the new chart blurred.
    if (!first) chart.dispatchAction({ type: "downplay" });
    chart.setOption(full, { notMerge: true, lazyUpdate: !first });
    // And once more after: a rebuild under a resting pointer re-applies the blur state.
    if (!first) chart.dispatchAction({ type: "downplay" });
  }, [option, ctx, ready]);

  useImperativeHandle(
    ref,
    () => ({
      getInstance: () => chartRef.current,
      getOption: () => lastOption.current,
      export: (options) => {
        if (!lastOption.current || !lastCtx.current) return Promise.reject(new Error("InsightCharts: the chart has not rendered yet"));
        const c = lastCtx.current;
        return exportChart({ option: lastOption.current, width: c.width, height: c.height, tokens: c.tokens, ...latest.current.exportMeta }, options);
      },
    }),
    [],
  );

  return <div ref={el} data-slot="ic-chart" data-ic-mode={mode} role="img" aria-label={alt} className={className} style={{ width: "100%", minWidth: 0, ...(aspect ? { aspectRatio: String(aspect) } : { height }), ...style }} />;
});
