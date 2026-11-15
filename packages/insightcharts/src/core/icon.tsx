import type { CSSProperties } from "react";
import { resolveIcon, type IconInput, type IconName } from "./icons";

export interface IconProps {
  /** A built-in icon name, or a custom single path as `path://M0 0...` drawn on the same 24 x 24 grid. */
  name: IconInput;
  /** Height and width of the icon's square box, in px or any CSS length. Default `"1em"`. */
  size?: number | string;
  /** Fill colour. Default `currentColor`. */
  color?: string;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  title?: string;
  /** Icon drawn when `name` is not a built-in. Default `"circle"`. */
  fallback?: IconName;
  className?: string;
  style?: CSSProperties;
}

/**
 * One icon from `core/icons.ts` as inline SVG. Every icon is drawn in the same 24 x 24 box, so
 * icons of different shapes line up when set side by side at one `size`.
 */
export function Icon({ name, size = "1em", color = "currentColor", title, fallback, className, style }: IconProps) {
  const shape = resolveIcon(name, fallback);
  return (
    <svg data-slot="ic-icon" data-icon={name.startsWith("path://") ? undefined : name} viewBox="0 0 24 24" width={size} height={size} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false" className={className} style={{ display: "inline-block", flex: "none", verticalAlign: "-0.125em", overflow: "visible", ...style }}>
      {title ? <title>{title}</title> : null}
      <path d={shape.d} fill={color} />
    </svg>
  );
}
