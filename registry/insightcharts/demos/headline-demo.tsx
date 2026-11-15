import { Headline } from "@/components/insightcharts/atoms/headline";

export function HeadlineDemo() {
  return (
    <Headline
      size="page"
      kicker="Energy transition"
      title="Solar generated more electricity than coal in Europe in 2024"
      deck="Solar was the continent's second-largest source of electricity that year."
      byline="By Ana Ruiz and Tom Okafor"
      date="2025-03-14"
    />
  );
}
