import { useEffect, useRef, useState } from "react";
import { Icon, iconGroups, icons, type IconName } from "insightcharts";

// The icon sheet: every icon in core/icons.ts at 16, 32 and 96 px on a light and a dark
// ground, with its name. Each path is measured in the browser; an icon whose `aspect` does
// not match its real bounding box, or that leaves the 24 x 24 grid, is outlined in red.
//   ?lab-icons          the sheet        ?lab-icons&group=Transport   one group

type Box = { x: number; y: number; w: number; h: number };

function Cell({ name, dark, box }: { name: IconName; dark: boolean; box?: Box }) {
  const shape = icons[name];
  const bad = box ? Math.abs(box.w / box.h - shape.aspect) > 0.012 || box.x < -0.01 || box.y < -0.01 || box.x + box.w > 24.01 || box.y + box.h > 24.01 : false;
  const ink = dark ? "#f2f1ee" : "#161616";
  return (
    <div data-icon-cell={name} data-bad={bad ? "" : undefined} style={{ background: dark ? "#141414" : "#ffffff", color: ink, border: `1px solid ${bad ? "#e5484d" : dark ? "#2c2c2c" : "#e4e4e0"}`, borderRadius: 8, padding: "12px 12px 8px", display: "grid", gap: 8, justifyItems: "center", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 100 }}>
        <Icon name={name} size={16} />
        <Icon name={name} size={32} />
        <span style={{ display: "inline-flex", background: dark ? "#1f1f1f" : "#f4f4f1", borderRadius: 4 }}>
          <Icon name={name} size={96} />
        </span>
      </div>
      <div style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", opacity: 0.8 }}>
        {name}
        {box ? <span style={{ opacity: 0.55 }}> {box.w.toFixed(1)}×{box.h.toFixed(1)}</span> : null}
      </div>
    </div>
  );
}

export function LabIcons() {
  const params = new URLSearchParams(location.search);
  const only = params.get("group");
  const probe = useRef<SVGSVGElement>(null);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  useEffect(() => {
    const svg = probe.current;
    if (!svg) return;
    const out: Record<string, Box> = {};
    for (const [name, shape] of Object.entries(icons)) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", shape.d);
      svg.appendChild(path);
      const b = path.getBBox();
      out[name] = { x: b.x, y: b.y, w: b.width, h: b.height };
      path.remove();
    }
    setBoxes(out);
    (window as unknown as { __icIconBoxes?: unknown }).__icIconBoxes = out;
  }, []);
  const groups = Object.entries(iconGroups).filter(([g]) => !only || g === only);
  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <svg ref={probe} width={0} height={0} style={{ position: "absolute" }} aria-hidden />
      <h1 style={{ fontSize: 18, margin: "0 0 4px" }}>Icons ({Object.keys(icons).length})</h1>
      <p style={{ fontSize: 13, margin: "0 0 16px", opacity: 0.7 }}>Each icon at 16, 32 and 96 px. The grey square is the 24 × 24 grid. A red outline marks a wrong `aspect` or a path outside the grid.</p>
      {groups.map(([group, names]) => (
        <section key={group} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 13, margin: "0 0 8px" }}>{group}</h2>
          {[false, true].map((dark) => (
            <div key={String(dark)} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 8 }}>
              {names.map((n) => (
                <Cell key={n} name={n} dark={dark} box={boxes[n]} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
