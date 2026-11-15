import type { ComponentMeta } from "./define";

/** Attach machine-readable metadata to a non-chart component (figures, text atoms, molecules, templates). */
export function withMeta<C extends object>(component: C, meta: ComponentMeta): C & { meta: ComponentMeta } {
  return Object.assign(component, { meta, displayName: meta.component });
}
