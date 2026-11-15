import { StepMarker } from "@/components/insightcharts/atoms/step-marker";

export function StepMarkerDemo() {
  return (
    <StepMarker
      step={1}
      title="Electricity sources in 2015"
      text="Europe's electricity generation by source in 2015."
      size="lg"
    />
  );
}
