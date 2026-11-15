import { Callout } from "@/components/insightcharts/atoms/callout";

export function CalloutDemo() {
  return (
    <Callout
      tone="accent"
      label="Summary"
      lead="Solar supplied more than half of demand on 4 in 10 summer afternoons in 2024"
      text="Wholesale prices were below zero on those afternoons."
    />
  );
}
