import { StrictMode, useEffect, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { InsightProvider, registerAll, type ComponentMeta } from "insightcharts";

// Examples use JSON specs in slots; make every component resolvable.
registerAll();
import { Lab } from "./lab";
import { LabAtoms } from "./lab-atoms";
import { LabIcons } from "./lab-icons";
import { LabPosters } from "./lab-posters";
import { LabPosterB } from "./lab-poster-b";
import { LabPosterA } from "./lab-poster-a";
import { LabPosterC } from "./lab-poster-c";
import { LabModes } from "./lab-modes";
import { ThemesLab } from "./themes-lab";

// Development gallery. Every component under atoms/, molecules/ and templates/ that carries
// `meta` is rendered from its `meta.example`, so adding a component makes it appear here.
//   /                 everything
//   /#bar-chart       one component, full width
//   ?mode=dark        dark page         ?w=380   constrain width (mobile check)
const modules = import.meta.glob("../../../packages/insightcharts/src/{atoms,molecules,templates}/*.tsx", { eager: true }) as Record<string, Record<string, unknown>>;

type Entry = { meta: ComponentMeta; Component: ComponentType<any>; file: string };
const entries: Entry[] = [];
for (const [file, mod] of Object.entries(modules)) {
  for (const value of Object.values(mod)) {
    const meta = (value as { meta?: ComponentMeta } | null)?.meta;
    if (meta?.name) entries.push({ meta, Component: value as ComponentType<any>, file });
  }
}
const levels = ["atom", "molecule", "template"] as const;
entries.sort((a, b) => levels.indexOf(a.meta.level) - levels.indexOf(b.meta.level) || a.meta.name.localeCompare(b.meta.name));

// Extra examples: a file may export `examples: Record<string, props>` for more states.
function extraExamples(file: string): Record<string, Record<string, unknown>> {
  return (modules[file].examples as Record<string, Record<string, unknown>> | undefined) ?? {};
}

function Card({ entry, wide }: { entry: Entry; wide: boolean }) {
  const { type: _type, ...props } = entry.meta.example ?? {};
  const extras = wide ? Object.entries(extraExamples(entry.file)) : [];
  return (
    <section data-component={entry.meta.name} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>
        <a href={`#${entry.meta.name}`}>{entry.meta.name}</a>
        <span>
          {entry.meta.level} · {entry.meta.category}
        </span>
      </div>
      {entry.meta.example ? <entry.Component {...props} /> : <em>No meta.example</em>}
      {extras.map(([name, p]) => (
        <div key={name} data-example={name} style={{ marginTop: 32, paddingTop: 20, borderTop: "1px dashed var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>{name}</div>
          <entry.Component {...p} />
        </div>
      ))}
    </section>
  );
}

function App() {
  const params = new URLSearchParams(location.search);
  const [hash, setHash] = useState(location.hash.slice(1));
  const [dark, setDark] = useState(params.get("mode") === "dark");
  useEffect(() => {
    const on = () => setHash(location.hash.slice(1));
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  useEffect(() => void document.documentElement.classList.toggle("dark", dark), [dark]);
  const shown = hash ? entries.filter((e) => e.meta.name === hash) : entries;
  const width = params.get("w");
  return (
    <main style={{ maxWidth: width ? Number(width) : hash ? 860 : 1400, margin: "0 auto", padding: width ? 12 : 24 }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, fontSize: 14 }}>
        <strong>InsightCharts gallery</strong>
        <a href="#">All ({entries.length})</a>
        <button id="toggle-mode" onClick={() => setDark((d) => !d)} style={{ marginLeft: "auto" }}>
          {dark ? "Light" : "Dark"}
        </button>
      </header>
      {shown.length === 0 ? <p>No component named “{hash}”.</p> : null}
      {/* ?eager mounts every chart immediately, for full-page screenshots. */}
      <InsightProvider lazy={!params.has("eager")} animate={!params.has("eager")}>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: hash || width ? "minmax(0, 1fr)" : "repeat(auto-fill, minmax(420px, 1fr))" }}>
        {shown.map((e) => (
          <Card key={e.meta.name} entry={e} wide={!!hash} />
        ))}
      </div>
      </InsightProvider>
    </main>
  );
}

// Reuse the root across hot reloads instead of creating a second one.
const w = window as unknown as { __icRoot?: ReturnType<typeof createRoot> };
(w.__icRoot ??= createRoot(document.getElementById("root")!)).render(
  <StrictMode>
    {new URLSearchParams(location.search).has("lab-poster-b") ? <LabPosterB /> : new URLSearchParams(location.search).has("lab-poster-c") ? <LabPosterC /> : new URLSearchParams(location.search).has("lab-poster-a") ? <LabPosterA /> : new URLSearchParams(location.search).has("lab-icons") ? <LabIcons /> : new URLSearchParams(location.search).has("lab-posters") ? <LabPosters /> : new URLSearchParams(location.search).has("lab-modes") ? <LabModes /> : new URLSearchParams(location.search).has("lab-atoms") ? <LabAtoms /> : new URLSearchParams(location.search).has("lab") ? <Lab /> : new URLSearchParams(location.search).has("themes") ? <ThemesLab /> : <App />}
  </StrictMode>,
);
