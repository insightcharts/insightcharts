import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The social card: the mark, the name, the title and six bars in the six colours of the landing page's hero. */
export default function OpengraphImage() {
  const bars = [38, 52, 47, 68, 84, 100];
  const hues = ["#4cc9f0", "#ffd23f", "#3ddc97", "#ff6fa5", "#a594ff", "#ff9547"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b1022", color: "#f5f6ff", padding: 72 }}>
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
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: -1.5, lineHeight: 1.08 }}>{site.tagline}</div>
            <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.4, color: "#c3c9ea" }}>{site.description}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 260 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ width: 34, height: `${h}%`, borderRadius: "6px 6px 0 0", background: hues[i] }} />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
