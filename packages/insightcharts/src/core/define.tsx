import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from "react";
import type { DataInput, Row, Transform } from "../data/types";
import { applyAnnotations, type Annotation } from "./annotations";
import { Chart, type ChartContext, type ChartEventHandler, type ChartHandle } from "./chart";
import { echarts, mergeOption, type EChartsExtension, type EChartsInstance, type EChartsOption } from "./echarts";
import { Figure, type LegendItem } from "./figure";
import { makeFormatter, type FormatSpec, type Formatter } from "./format";
import type { ModeInput } from "./mode";
import type { ExportFormat, RendererInput } from "./provider";
import { stableKey, useData, useInsightData } from "./store";
import { useContainerWidth } from "./use-container-width";
import type { ThemeInput } from "./theme";

/** Props every InsightCharts chart accepts, on top of its own. All are JSON-serialisable except callbacks. */
export interface CommonChartProps {
  /** Rows, CSV text, a URL, `{ url, path }`, an async function, or an Arrow-style table. Omit inside `<InsightData>`. */
  data?: DataInput;
  /** A pipeline of transforms applied before drawing. */
  transform?: Transform | Transform[];
  /** The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. */
  title?: string;
  /** Measure, unit, population, period. */
  subtitle?: string;
  /** Data source, shown as "Source: ...". */
  source?: string;
  /** Method notes or caveats. */
  note?: string;
  /** CSS height of the plot. Default 360. */
  height?: number | string;
  /** Width / height. Overrides `height`. */
  aspect?: number;
  /** The entity (or entities) the title is about. Every other series is drawn in grey. */
  highlight?: string | string[];
  /** Reference lines, shaded bands and callouts, in data coordinates. */
  annotations?: Annotation[];
  /** How to print values: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, Intl options, or a function. */
  format?: FormatSpec;
  /** Show the legend. Default: shown when there are two or more series. */
  legend?: boolean;
  /**
   * Make marks clickable to filter. Inside `<InsightData>` the selection filters every
   * other chart. Pass a field name, or `true` to use the chart's category field.
   */
  select?: boolean | string;
  /** Called with the selected values whenever the selection changes. */
  onSelect?: (values: string[], field: string) => void;
  /** Deep-merged over the generated ECharts option, or a function that receives and returns it. Use it for ECharts settings no prop covers. */
  option?: EChartsOption | ((option: EChartsOption, ctx: BuildContext) => EChartsOption);
  theme?: ThemeInput;
  /** `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. */
  mode?: ModeInput;
  /** `"auto"` (default) uses SVG for light charts and canvas for heavy ones. */
  renderer?: RendererInput;
  animate?: boolean;
  lazy?: boolean;
  /** Link tooltips with other charts sharing this group id. */
  group?: string;
  /** Show an export menu: `true` or a list of formats from png, jpeg, svg, pdf, csv, json. */
  exportable?: boolean | ExportFormat[];
  /** Show a collapsible "View data" table under the chart. */
  table?: boolean;
  /** Accessible description: the chart type and measures, then the main pattern and the notable values. */
  alt?: string;
  /** Stable id for this chart's selection in the shared store. */
  id?: string;
  onEvents?: Record<string, ChartEventHandler>;
  onReady?: (chart: EChartsInstance) => void;
  className?: string;
  style?: CSSProperties;
}

/** What a chart's `build` function receives. */
export interface BuildContext extends ChartContext {
  rows: Row[];
  /**
   * Colour for an entity. Pass its key and its index in the stable entity order.
   * Handles `highlight` (others turn grey) and falls back to the accent for a single series.
   */
  color(key?: string, index?: number): string;
  /** The `highlight` prop as a list (empty when nothing is highlighted). */
  highlight: string[];
  /** True when `highlight` is set and this key is not part of it. */
  dimmed(key?: string): boolean;
  /** True when this value passes the chart's own click selection (or nothing is selected). */
  selected(value: unknown): boolean;
  /** Formatter built from the `format` prop. */
  fmt: Formatter;
  /** Build a formatter from any spec. */
  formatter(spec?: FormatSpec): Formatter;
}

export type BuildResult = EChartsOption | { option: EChartsOption; legend?: LegendItem[]; alt?: string };

export interface PropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
}

/** Machine-readable description of a component: feeds the docs, llms.txt, the registry and the agent skill. */
export interface ComponentMeta {
  /** Kebab-case id, also the registry item name: `bar-chart`. */
  name: string;
  /** Exported React component name: `BarChart`. */
  component: string;
  title: string;
  level: "atom" | "molecule" | "template";
  /** Grouping in the docs: comparison, trend, distribution, part-to-whole, relationship, flow, geo, figure, text, layout, story. */
  category: string;
  /** One sentence: what it shows. */
  description: string;
  /** When this is the right form. */
  whenToUse?: string;
  /** When to pick something else, and what. */
  avoid?: string;
  /** Component-specific props. Common props are documented once, centrally. */
  props: PropDoc[];
  /** Names of the atoms / molecules this is composed from. */
  composes?: string[];
  /** A minimal JSON spec that renders it: `{ type, ...props }`. */
  example?: Record<string, unknown>;
}

export interface ChartDefinition<P> extends Omit<ComponentMeta, "level" | "component"> {
  component?: string;
  level?: ComponentMeta["level"];
  /** ECharts series and components this chart needs, registered once. */
  use: EChartsExtension[];
  defaults?: Partial<P & CommonChartProps>;
  /** The field a click selects on when `select` is `true`. */
  selectField?: (props: P & CommonChartProps) => string | undefined;
  /** The value a click event selects. Defaults to the mark's category name. */
  selectValue?: (params: any, props: P & CommonChartProps) => unknown;
  /** Estimated mark count, for renderer selection. Defaults to the row count. */
  markCount?: (rows: Row[], props: P & CommonChartProps) => number;
  /**
   * Natural plot height in px when the `height` prop is not given, e.g. rows times a row
   * height. `width` is the plot's measured width in px (undefined before first layout and
   * on the server), so a graphic can be taller on a phone than on a desktop.
   */
  height?: (props: P & CommonChartProps, rows: Row[], width?: number) => number | undefined;
  /** Turn props and rows into an ECharts option. Must be pure. */
  build(props: P & CommonChartProps, ctx: BuildContext): BuildResult;
}

export type ChartComponent<P> = ForwardRefExoticComponent<P & CommonChartProps & RefAttributes<ChartHandle>> & { meta: ComponentMeta };

const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_m, _d, c: string) => c.toUpperCase());
const asList = (v: string | string[] | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]);

/**
 * Define a chart from a pure option builder. The factory supplies everything else:
 * data loading and transforms, the shared crossfilter store, theme and dark mode,
 * highlighting, annotations, the figure chrome, legend, export, loading/empty/error
 * states and the typed `option` override.
 */
export function defineChart<P extends object>(def: ChartDefinition<P>): ChartComponent<P> {
  const { use, defaults, build, selectField, selectValue, markCount, height: naturalHeight, ...metaRest } = def;
  try {
    echarts.use(use);
  } catch (error) {
    // Hot reload re-evaluates this module and ECharts refuses to register some extensions twice.
    if (!/exists/i.test(String(error))) throw error;
  }
  const meta: ComponentMeta = { level: "atom", component: pascal(def.name), ...metaRest };

  const Component = forwardRef<ChartHandle, P & CommonChartProps>(function InsightChart(input, ref) {
    const props = { ...defaults, ...input } as P & CommonChartProps;
    const autoId = useId();
    const id = props.id ?? autoId;
    const store = useInsightData();
    const shared = props.data === undefined && store !== null;
    const own = useData(shared ? null : props.data, shared ? undefined : props.transform);
    const sharedRows = useData(shared ? store!.rowsFor(id) : null, shared ? props.transform : undefined);
    const state = shared ? { rows: sharedRows.rows, status: store!.status === "ready" ? sharedRows.status : store!.status, error: store!.error ?? sharedRows.error } : own;
    const rows = state.rows;

    // Selection: shared through the store when there is one, local otherwise.
    const field = typeof props.select === "string" ? props.select : props.select ? selectField?.(props) : undefined;
    const [local, setLocal] = useState<string[]>([]);
    const storeSel = store?.selections[id];
    const selection = store ? (storeSel?.field === field ? storeSel?.values ?? [] : []) : local;
    const selectionKey = selection.join("\u0000");

    const latest = useRef({ props, rows, selection, field });
    latest.current = { props, rows, selection, field };
    const [legend, setLegend] = useState<LegendItem[]>([]);
    const [autoAlt, setAutoAlt] = useState<string | undefined>();
    const chart = useRef<ChartHandle>(null);
    const [plotRef, plotWidth] = useContainerWidth<HTMLDivElement>(0);
    // Colour follows the entity, not its position: inside a shared store, remember which
    // palette slot each key first took so filtering never repaints the survivors.
    const slots = useRef(new Map<string, number>());

    const { data: _d, transform: _t, onEvents: _e, onReady: _r, onSelect: _s, className: _c, style: _st, ...keyed } = props as CommonChartProps & Record<string, unknown>;
    const propsKey = stableKey(keyed);

    const option = useCallback(
      (ctx: ChartContext): EChartsOption => {
        const { props: p, rows: r, selection: sel } = latest.current;
        const highlight = asList(p.highlight);
        const t = ctx.tokens;
        const fmt = makeFormatter(p.format, ctx.locale);
        const bctx: BuildContext = {
          ...ctx,
          rows: r,
          highlight,
          fmt,
          formatter: (spec) => makeFormatter(spec, ctx.locale),
          dimmed: (key) => highlight.length > 0 && (key == null || !highlight.includes(key)),
          selected: (value) => sel.length === 0 || sel.includes(String(value)),
          color: (key, index) => {
            if (highlight.length) {
              const at = key == null ? -1 : highlight.indexOf(key);
              return at === -1 ? t.context : at === 0 ? t.accent : t.categorical[at % t.categorical.length];
            }
            if (index == null) return t.accent;
            let slot = index;
            if (shared && key != null) {
              const known = slots.current.get(key);
              if (known !== undefined) slot = known;
              else {
                const taken = new Set(slots.current.values());
                while (taken.has(slot) && taken.size < t.categorical.length) slot = (slot + 1) % t.categorical.length;
                slots.current.set(key, slot);
              }
            }
            return t.categorical[slot % t.categorical.length];
          },
        };
        const result = build(p, bctx);
        const isWrapped = (x: BuildResult): x is { option: EChartsOption; legend?: LegendItem[]; alt?: string } => typeof (x as { option?: unknown }).option === "object" && (x as { series?: unknown }).series === undefined;
        let built = isWrapped(result) ? result.option : result;
        const items = isWrapped(result) ? result.legend ?? [] : [];
        const alt = isWrapped(result) ? result.alt : undefined;
        setLegend((prev) => (JSON.stringify(prev) === JSON.stringify(items) ? prev : items));
        setAutoAlt(alt);
        const description = p.alt ?? alt;
        if (description && built.aria === undefined) built = { ...built, aria: { enabled: true, label: { description } } };
        built = applyAnnotations(built, p.annotations, ctx);
        if (typeof p.option === "function") built = p.option(built, bctx);
        else if (p.option) built = mergeOption(built, p.option);
        return built;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [propsKey, rows, selectionKey],
    );

    // Report every change, however it happened: a click here, or the shared store being cleared.
    const reported = useRef(selectionKey);
    useEffect(() => {
      if (reported.current === selectionKey) return;
      reported.current = selectionKey;
      const { props: p, selection: sel, field: f } = latest.current;
      if (f) p.onSelect?.(sel, f);
    }, [selectionKey]);

    const toggle = useCallback(
      (value: unknown) => {
        const { field: f, selection: sel, props: p } = latest.current;
        if (!f) return;
        const v = value == null ? null : String(value);
        const next = v == null ? [] : sel.includes(v) ? sel.filter((s) => s !== v) : [...sel, v];
        if (store) store.select(id, next.length ? { field: f, values: next } : null);
        else setLocal(next);
      },
      [store, id],
    );

    const events = useMemo(() => {
      const user = props.onEvents ?? {};
      if (!field) return user;
      return {
        ...user,
        click: (params: any, c: EChartsInstance) => {
          user.click?.(params, c);
          toggle(selectValue ? selectValue(params, latest.current.props) : params.name);
        },
        // A click on empty canvas clears the selection.
        "zr:click": (e: any, c: EChartsInstance) => {
          user["zr:click"]?.(e, c);
          if (!e.target && latest.current.selection.length) toggle(null);
        },
      } as Record<string, ChartEventHandler>;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field, toggle, props.onEvents]);

    useImperativeHandle(ref, () => ({ getInstance: () => chart.current?.getInstance() ?? null, getOption: () => chart.current?.getOption() ?? null, export: (o) => chart.current!.export(o) }), []);

    const height = props.height ?? naturalHeight?.(props, rows, plotWidth || undefined) ?? 360;
    const status = state.status === "ready" && rows.length === 0 ? "empty" : state.status;
    const alt = props.alt ?? autoAlt ?? ([props.title, props.subtitle].filter(Boolean).join(". ") || undefined);

    return (
      <Figure
        title={props.title}
        subtitle={props.subtitle}
        source={props.source}
        note={props.note}
        legend={props.legend === false ? undefined : legend}
        table={props.table}
        tableRows={rows}
        exportable={props.exportable}
        onExport={(format) => void chart.current?.export({ format })}
        status={status}
        error={state.error}
        height={props.aspect ? undefined : height}
        theme={props.theme}
        mode={props.mode}
        className={props.className}
        style={props.style}
      >
        <div ref={plotRef} data-slot="ic-plot-size" style={{ minWidth: 0 }}>
        <Chart
          ref={chart}
          option={option}
          height={height}
          aspect={props.aspect}
          renderer={props.renderer}
          markCount={markCount ? markCount(rows, props) : rows.length}
          theme={props.theme}
          mode={props.mode}
          animate={props.animate}
          lazy={props.lazy}
          group={props.group}
          onEvents={events}
          onReady={props.onReady}
          alt={alt}
          exportMeta={{ title: props.title, subtitle: props.subtitle, source: [props.source && `Source: ${props.source}`, props.note].filter(Boolean).join(" · ") || undefined, rows }}
          style={field ? { cursor: "pointer" } : undefined}
        />
        </div>
      </Figure>
    );
  }) as ChartComponent<P>;

  Component.displayName = meta.component;
  Component.meta = meta;
  return Component;
}
