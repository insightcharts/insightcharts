import { posterBackgrounds, posterThemes } from "insightcharts/themes";

// What each poster theme looks like, in a line. A theme added to the library shows without
// one until it is described here.
const ABOUT: Record<string, string> = {
  noir: "Near-black sheet, white type, yellow and sky blue marks.",
  magenta: "Saturated magenta sheet, pale pink blocks, cyan accent.",
  dusk: "Violet gradient, marks from orange to yellow.",
  paper: "Warm off-white stock, black ink, one red.",
  ocean: "Navy to teal gradient, aqua and coral marks.",
  forest: "Dark green sheet, lime and cream marks.",
  blueprint: "Cobalt sheet, white linework, yellow accent.",
  sunrise: "Cream to peach gradient, plum and tangerine marks.",
};

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Every poster theme on its own ground, read from `posterThemes` and `posterBackgrounds`. */
export function PosterThemes() {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      {Object.entries(posterThemes).map(([name, theme]) => {
        const ground = (posterBackgrounds as Record<string, { light: string; dark: string }>)[name];
        const t = theme.light;
        const single = same(theme.light, theme.dark) && ground.light === ground.dark;
        return (
          <div key={name} className="overflow-hidden rounded-xl border">
            <div className="flex min-h-[132px] flex-col justify-between gap-5 p-4" style={{ background: ground.light, color: t.ink }}>
              <div className="flex items-baseline justify-between gap-3">
                <span style={{ fontFamily: t.displayFamily, fontSize: 30, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}>{name}</span>
                <span className="text-[11px]" style={{ color: t.muted }}>
                  {single ? "one look" : "light and dark"}
                </span>
              </div>
              <div className="flex items-center gap-1.5" aria-hidden>
                {t.categorical.map((c, i) => (
                  <span key={i} className="h-6 flex-1 rounded-[4px]" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="grid gap-1 border-t px-4 py-3 text-[13px] leading-5">
              <p className="text-foreground/90">{ABOUT[name] ?? ""}</p>
              <p className="break-words font-mono text-[11px] leading-4 text-muted-foreground">{ground.light}</p>
              {single ? null : <p className="break-words font-mono text-[11px] leading-4 text-muted-foreground">dark: {ground.dark}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
