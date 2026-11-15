import { Fragment, isValidElement, type ComponentType, type ReactNode } from "react";
import type { ComponentMeta } from "./define";

/**
 * A component described as plain JSON: `{ type: "bar-chart", ...props }`. Specs nest, so a
 * template's sections can themselves be specs. This is the form agents should emit when
 * they cannot (or need not) write JSX.
 */
export interface InsightSpec {
  /** A component's kebab-case name, e.g. `"line-chart"`, `"stat-row"`, `"visual-essay"`. */
  type: string;
  [prop: string]: unknown;
}

/** A place that accepts either rendered React content or a JSON spec. */
export type Slot = ReactNode | InsightSpec;

type Registered = ComponentType<any> & { meta?: ComponentMeta };
const registry = new Map<string, Registered>();

/** Make components available to `<Insight>` and `renderSlot` by their `meta.name`. */
export function registerComponents(components: Record<string, unknown>): void {
  for (const value of Object.values(components)) {
    const meta = (value as Registered | null)?.meta;
    if (meta?.name) registry.set(meta.name, value as Registered);
  }
}

export function getComponent(type: string): Registered | undefined {
  return registry.get(type);
}

export function listComponents(): ComponentMeta[] {
  return [...registry.values()].map((c) => c.meta!);
}

export const isSpec = (value: unknown): value is InsightSpec => typeof value === "object" && value !== null && !isValidElement(value) && !Array.isArray(value) && typeof (value as InsightSpec).type === "string";

/**
 * Render a slot. React content passes through; a spec is looked up in the registry.
 * Molecules and templates call this for every slot prop, which is what lets the same
 * component be driven from JSX or from JSON.
 */
export function renderSlot(slot: Slot, key?: string | number): ReactNode {
  if (!isSpec(slot)) return key !== undefined && isValidElement(slot) ? <Fragment key={key}>{slot}</Fragment> : (slot as ReactNode);
  const { type, ...props } = slot;
  const Component = registry.get(type);
  if (!Component) {
    const known = [...registry.keys()];
    const message = known.length ? `Unknown component type "${type}". Available: ${known.join(", ")}.` : `Component type "${type}" is not registered. Render specs through <Insight>, or call registerComponents() with the components you use.`;
    return (
      <div key={key} role="alert" data-slot="ic-state" style={{ padding: "1rem", border: "1px dashed currentColor", borderRadius: 8, fontSize: 13, opacity: 0.8 }}>
        {message}
      </div>
    );
  }
  return <Component key={key} {...props} />;
}
