import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "InsightCharts, a React chart library built on Apache ECharts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** A plain card: the mark, the name, the one-line description and a few bars. */
export default function OpengraphImage() {
  const bars = [38, 52, 47, 68, 84, 100];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0a0a", color: "#fafafa", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 600 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="#fafafa">
            <rect x="3" y="14" width="4" height="7" rx="1" opacity="0.35" />
            <rect x="10" y="9" width="4" height="12" rx="1" />
            <circle cx="12" cy="4.5" r="2.25" />
            <rect x="17" y="11.5" width="4" height="9.5" rx="1" opacity="0.6" />
          </svg>
          InsightCharts
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>A React chart library built on Apache ECharts</div>
            <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.35, color: "#a3a3a3" }}>{site.description}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 260 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ width: 34, height: `${h}%`, borderRadius: "6px 6px 0 0", background: i === bars.length - 1 ? "#3987e5" : "#404040" }} />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
