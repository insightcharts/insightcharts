import { ProportionStatement } from "@/components/insightcharts/molecules/proportion-statement";

export function ProportionStatementDemo() {
  return (
    <ProportionStatement
      theme="sunrise"
      value={33}
      total={100}
      text="people in the world have never used the internet."
      detail="That was about 2.6 billion people in 2023."
      source="ITU Facts and Figures 2023"
      note="Figures are approximate, for illustration"
    />
  );
}
