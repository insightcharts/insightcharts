import { BigNumber } from "@/components/insightcharts/atoms/big-number";

export function BigNumberDemo() {
  return (
    <BigNumber
      value={0.317}
      format="percent"
      label="Share of global electricity from renewables"
      delta={0.021}
      deltaLabel="vs 2023"
      context="Up from 19% in 2010"
    />
  );
}
