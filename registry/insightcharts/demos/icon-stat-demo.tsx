import { IconStat } from "@/components/insightcharts/atoms/icon-stat";

export function IconStatDemo() {
  return (
    <IconStat
      icon="person"
      count={1}
      total={4}
      text="households could not cover an unexpected bill of €500 without borrowing."
    />
  );
}
