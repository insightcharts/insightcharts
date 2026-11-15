import { StatTile } from "@/components/insightcharts/atoms/stat-tile";

export function StatTileDemo() {
  return (
    <StatTile
      label="Monthly active users"
      value={48210}
      format="compact"
      delta={0.083}
      deltaLabel="vs September"
      trend={[38.1, 39.4, 39, 40.8, 42.2, 41.9, 43.5, 44.1, 44.5, 46, 47.2, 48.2]}
      style={{ maxWidth: 300 }}
    />
  );
}
