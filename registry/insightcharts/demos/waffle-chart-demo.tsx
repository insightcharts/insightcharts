import { WaffleChart } from "@/components/insightcharts/atoms/waffle-chart";

export function WaffleChartDemo() {
  return (
    <WaffleChart
      theme="poster"
      data={[{ group: "Have never been online", share: 33 }]}
      name="group"
      value="share"
      total={100}
      restLabel="Use the internet"
      title="33% of the world's population had never used the internet in 2023"
      subtitle="Share of the global population, 2023. Each square is 1% of people"
      source="ITU Facts and Figures 2023"
      note="Figures are approximate, for illustration"
    />
  );
}
