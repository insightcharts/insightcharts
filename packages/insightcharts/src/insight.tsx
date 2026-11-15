import { allComponents } from "./components.generated";
import { registerComponents, renderSlot, type InsightSpec } from "./core/spec";

let registered = false;
/** Register every built-in component for spec rendering. Called by `<Insight>`; safe to call yourself. */
export function registerAll(): void {
  if (registered) return;
  registered = true;
  registerComponents(allComponents() as unknown as Record<string, unknown>);
}

export interface InsightProps {
  /** `{ type: "bar-chart", data, x, y, ... }`. Any InsightCharts component, described as JSON. */
  spec: InsightSpec;
}

/**
 * Render any atom, molecule or template from a JSON spec. Importing this registers every
 * component, so prefer named imports (`BarChart`) when bundle size matters and `Insight`
 * when the chart is chosen at runtime, e.g. by an AI agent or a CMS.
 */
export function Insight({ spec }: InsightProps) {
  // Registered on first render rather than at import, so bundlers that drop side-effect-only
  // modules cannot remove it.
  registerAll();
  return <>{renderSlot(spec)}</>;
}
