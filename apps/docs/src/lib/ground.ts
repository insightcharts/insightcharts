import type { CSSProperties } from "react";

/** The CSS background an example paints behind itself in each colour mode. */
export interface Ground {
  light: string;
  dark: string;
}

// A box with this class takes the ground from two variables, by mode. The site's `dark`
// variant also follows a mode forced on a preview with `data-preview`.
const GROUND = "[background:var(--ground-light)] dark:[background:var(--ground-dark)]";

export const groundVars = (ground: Ground | undefined) => (ground ? ({ "--ground-light": ground.light, "--ground-dark": ground.dark } as CSSProperties) : undefined);
export const groundClass = (ground: Ground | undefined) => (ground ? GROUND : undefined);
