import { Delta } from "@/components/insightcharts/atoms/delta";

export function DeltaDemo() {
  return (
    <Delta value={0.124} label="vs last quarter" size="md" />
  );
}
