import * as echarts from "echarts/core";
import { AriaComponent, DatasetComponent, GraphicComponent, GridComponent, MarkAreaComponent, MarkLineComponent, MarkPointComponent, TooltipComponent, TransformComponent } from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

// The shared baseline every InsightCharts component relies on. Chart-specific series and
// components are registered by each chart through `defineChart({ use: [...] })`, so an app
// only ships the ECharts modules for the charts it imports.
echarts.use([CanvasRenderer, SVGRenderer, GridComponent, TooltipComponent, DatasetComponent, TransformComponent, MarkLineComponent, MarkAreaComponent, MarkPointComponent, GraphicComponent, AriaComponent, LabelLayout, UniversalTransition]);

export { echarts };
export type { EChartsOption };
export type EChartsInstance = echarts.ECharts;
export type EChartsExtension = Exclude<Parameters<typeof echarts.use>[0], readonly unknown[]>;

const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;

/**
 * Deep-merge ECharts options. Objects merge key by key; arrays of objects merge by index
 * (so `{ series: [{ smooth: true }] }` patches the first series instead of replacing all
 * of them); everything else is replaced.
 */
export function mergeOption<T>(base: T, patch: unknown): T {
  if (patch === undefined) return base;
  if (isPlain(base) && isPlain(patch)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(patch)) out[key] = mergeOption(out[key], patch[key]);
    return out as T;
  }
  if (Array.isArray(base) && Array.isArray(patch) && base.some(isPlain) && patch.every((p) => isPlain(p) || p === undefined)) {
    const out = [...base];
    patch.forEach((p, i) => {
      out[i] = i < base.length ? mergeOption(base[i], p) : p;
    });
    return out as T;
  }
  if (Array.isArray(base) && isPlain(patch) && base.some(isPlain)) return base.map((b) => mergeOption(b, patch)) as T;
  return patch as T;
}
