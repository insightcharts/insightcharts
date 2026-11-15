"use client";

import { posterThemes, themes, themeSurfaces } from "insightcharts/themes";

const Swatches = ({ colors, surface }: { colors: string[]; surface?: string }) => (
  <span className="inline-flex gap-1 rounded-md p-1.5 ring-1 ring-foreground/10" style={{ background: surface }} aria-hidden>
    {colors.map((c, i) => (
      <span key={i} className="size-3.5 rounded-full" style={{ background: c }} />
    ))}
  </span>
);

// What each preset is for, in a line. A preset added to the library shows without one until
// it is described here.
const ABOUT: Record<string, string> = {
  insight: "The default theme. It reads shadcn/ui variables for surface and ink.",
  shadcn: "Reads the page variables and takes series colours from --chart-1 to --chart-5.",
  editorial: "Newspaper graphics. Off-white surface, blue-black ink, serif titles, carmine accent.",
  ledger: "Financial reports. Salmon surface, dark blue accent, claret and teal series.",
  mono: "High contrast. Black and white text and axes, square marks, a thick baseline.",
  earth: "Environmental reports. Warm grey surface, green accent, blue, ochre and clay series.",
  science: "Journal figures. Blue-grey surface, thin lines, small corner radius, teal accent.",
  poster: "Posters and social cards. Saturated magenta accent, thick lines, round bar ends.",
};

/** Every preset in the `themes` record, enumerated at runtime so new presets appear by themselves. */
export function ThemePresets() {
  const surfaces = themeSurfaces as Record<string, { light: string; dark: string } | undefined>;
  return (
    <div className="not-prose scroll-quiet my-6 overflow-x-auto rounded-xl border text-[13px]">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
            <th scope="col" className="px-4 py-2.5 font-medium">Preset</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Light, on its surface</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Dark, on its surface</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Designed for</th>
          </tr>
        </thead>
        <tbody>
          {/* The poster themes are in the same record; they have a table of their own (PosterThemes). */}
          {Object.entries(themes)
            .filter(([key]) => !(key in posterThemes))
            .map(([key, theme]) => {
            const s = surfaces[key];
            return (
              <tr key={key} className="border-b align-top last:border-0">
                <th scope="row" className="whitespace-nowrap px-4 py-3 font-mono text-[12.5px] font-medium">
                  themes.{/^[a-z_$][\w$]*$/i.test(key) ? key : `["${key}"]`}
                </th>
                <td className="px-4 py-2.5">
                  <Swatches colors={theme.light.categorical} surface={s?.light} />
                  <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{s?.light ?? "the page"}</span>
                </td>
                <td className="px-4 py-2.5">
                  <Swatches colors={theme.dark.categorical} surface={s?.dark} />
                  <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{s?.dark ?? "the page"}</span>
                </td>
                <td className="min-w-[200px] px-4 py-3 leading-5 text-foreground/90">{ABOUT[key] ?? ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
