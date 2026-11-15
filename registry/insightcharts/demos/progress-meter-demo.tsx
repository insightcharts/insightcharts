import { ProgressMeter } from "@/components/insightcharts/atoms/progress-meter";

export function ProgressMeterDemo() {
  return (
    <ProgressMeter
      label="Homes with a heat pump or district heating"
      value={0.46}
      max={1}
      showMax={false}
      target={0.7}
      targetLabel="2030 target"
      context="Up from 31% in 2020. At the current rate the target is reached in 2033."
    />
  );
}
