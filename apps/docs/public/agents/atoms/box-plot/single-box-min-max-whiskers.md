# Reproduce the "Single box, min-max whiskers" example of the InsightCharts Box plot

These are instructions for an AI coding agent (Claude Code, Cursor, Codex or similar) working in the user's project. Library: InsightCharts, a React chart library for infographics and data stories, built on Apache ECharts 6. Package: `insightcharts` version 0.1.0 on npm. Peer dependencies: `echarts` >=6.0.0, `react` >=18, `react-dom` >=18.

Task: reproduce the "Single box, min-max whiskers" example of `box-plot` (an atom) exactly as written below and check that it renders. Then replace the example data and text with the user's. If the user has not given you their data and the one fact to show, reproduce the example first and then ask for both.

## 1. Check that this is the right component

Summarises a numeric field per group as median, quartile box, whiskers and outlier dots, computed from raw rows.

Use it when: Comparing the centre and spread of a numeric value across several groups, especially with many rows per group and an audience comfortable with quartiles.

Pick something else when: A general audience or fewer than about 20 rows per group (use strip-plot or beeswarm-chart, which show the observations themselves); one group whose shape matters, such as two peaks, which a box hides (use histogram).

Instructions for the alternatives: `beeswarm-chart` https://insightcharts.dev/agents/atoms/beeswarm-chart.md, `strip-plot` https://insightcharts.dev/agents/atoms/strip-plot.md.

## 2. Install

Find the package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, otherwise npm). Skip this step if `insightcharts` is already in `package.json`. If the project has `components/insightcharts/`, import from that folder instead of the package.

From npm (use the project's package manager):

```bash
npm install insightcharts echarts      # or: pnpm add / yarn add / bun add
```

Or copy the component's source into the project with the shadcn CLI, when the user wants to edit it. The project needs a `components.json`. The CLI also installs the `insightcharts` package, because the engine still comes from it.

```bash
npx shadcn@latest registry add @insightcharts=https://insightcharts.dev/r/{name}.json   # once per project
npx shadcn@latest add @insightcharts/box-plot
```

The file lands at `components/insightcharts/atoms/box-plot.tsx`. Import the component from there when you install it this way.

## 3. Import

```tsx
import { BoxPlot } from "insightcharts";
```

In Next.js the component can be imported into a server component when every prop is plain data. A file that passes a function prop must start with `"use client"`.

## 4. Data

Pass `data` as an array of row objects. CSV text, a URL, `{ url, path }`, an async function and an Arrow-style table also work. Field props are strings that name columns of the rows. The example's rows look like this:

```json
[
  { "parcel": "Swift-1000", "carrier": "Swift", "days": 1.9 },
  { "parcel": "Swift-1001", "carrier": "Swift", "days": 1.2 },
  { "parcel": "Swift-1002", "carrier": "Swift", "days": 1.3 }
]
```

How the example maps columns to props:

- `value` = `"days"`. Numeric field to summarise. Pass raw rows; quartiles are computed in the chart.

With the user's data, keep the props and change the column names.

## 5. The "Single box, min-max whiskers" example

This example sets `theme="ledger"`, a built-in theme that paints its own background behind the component. Keep it to reproduce the look. Remove `theme` to follow the host page instead, or keep the colours and set `frame={false}` to drop the painted background.

```tsx
import { BoxPlot } from "insightcharts";

const data = [
  { parcel: "Swift-1000", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1001", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1002", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1003", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1004", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1005", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1006", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1007", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1008", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1009", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1010", carrier: "Swift", days: 1 },
  { parcel: "Swift-1011", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1012", carrier: "Swift", days: 1 },
  { parcel: "Swift-1013", carrier: "Swift", days: 3.1 },
  { parcel: "Swift-1014", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1015", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1016", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1017", carrier: "Swift", days: 0.7 },
  { parcel: "Swift-1018", carrier: "Swift", days: 0.8 },
  { parcel: "Swift-1019", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1020", carrier: "Swift", days: 0.8 },
  { parcel: "Swift-1021", carrier: "Swift", days: 1 },
  { parcel: "Swift-1022", carrier: "Swift", days: 3.1 },
  { parcel: "Swift-1023", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1024", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1025", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1026", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1027", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1028", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1029", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1030", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1031", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1032", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1033", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1034", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1035", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1036", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1037", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1038", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1039", carrier: "Swift", days: 2 },
  { parcel: "Swift-1040", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1041", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1042", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1043", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1044", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1045", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1046", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1047", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1048", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1049", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1050", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1051", carrier: "Swift", days: 3.1 },
  { parcel: "Swift-1052", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1053", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1054", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1055", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1056", carrier: "Swift", days: 2.5 },
  { parcel: "Swift-1057", carrier: "Swift", days: 2.6 },
  { parcel: "Swift-1058", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1059", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1060", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1061", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1062", carrier: "Swift", days: 2.7 },
  { parcel: "Swift-1063", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1064", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1065", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1066", carrier: "Swift", days: 2.4 },
  { parcel: "Swift-1067", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1068", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1069", carrier: "Swift", days: 1 },
  { parcel: "Swift-1070", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1071", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1072", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1073", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1074", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1075", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1076", carrier: "Swift", days: 2.9 },
  { parcel: "Swift-1077", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1078", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1079", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1080", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1081", carrier: "Swift", days: 2.5 },
  { parcel: "Swift-1082", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1083", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1084", carrier: "Swift", days: 0.5 },
  { parcel: "Swift-1085", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1086", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1087", carrier: "Swift", days: 1 },
  { parcel: "Swift-1088", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1089", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1090", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1091", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1092", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1093", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1094", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1095", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1096", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1097", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1098", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1099", carrier: "Swift", days: 2 },
  { parcel: "Swift-1100", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1101", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1102", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1103", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1104", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1105", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1106", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1107", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1108", carrier: "Swift", days: 1 },
  { parcel: "Swift-1109", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1110", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1111", carrier: "Swift", days: 2.9 },
  { parcel: "Swift-1112", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1113", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1114", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1115", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1116", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1117", carrier: "Swift", days: 2 },
  { parcel: "Swift-1118", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1119", carrier: "Swift", days: 2.4 },
  { parcel: "Swift-1120", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1121", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1122", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1123", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1124", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1125", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1126", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1127", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1128", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1129", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1130", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1131", carrier: "Swift", days: 2.5 },
  { parcel: "Swift-1132", carrier: "Swift", days: 2.6 },
  { parcel: "Swift-1133", carrier: "Swift", days: 1.1 },
  { parcel: "Swift-1134", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1135", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1136", carrier: "Swift", days: 2.9 },
  { parcel: "Swift-1137", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1138", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1139", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1140", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1141", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1142", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1143", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1144", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1145", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1146", carrier: "Swift", days: 2.4 },
  { parcel: "Swift-1147", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1148", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1149", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1150", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1151", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1152", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1153", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1154", carrier: "Swift", days: 1.9 },
  { parcel: "Swift-1155", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1156", carrier: "Swift", days: 1.2 },
  { parcel: "Swift-1157", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1158", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1159", carrier: "Swift", days: 2.3 },
  { parcel: "Swift-1160", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1161", carrier: "Swift", days: 0.9 },
  { parcel: "Swift-1162", carrier: "Swift", days: 2.2 },
  { parcel: "Swift-1163", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1164", carrier: "Swift", days: 2 },
  { parcel: "Swift-1165", carrier: "Swift", days: 1.4 },
  { parcel: "Swift-1166", carrier: "Swift", days: 1.7 },
  { parcel: "Swift-1167", carrier: "Swift", days: 1.5 },
  { parcel: "Swift-1168", carrier: "Swift", days: 1.8 },
  { parcel: "Swift-1169", carrier: "Swift", days: 2.6 },
  { parcel: "Swift-1170", carrier: "Swift", days: 1.3 },
  { parcel: "Swift-1171", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1172", carrier: "Swift", days: 2.8 },
  { parcel: "Swift-1173", carrier: "Swift", days: 2.9 },
  { parcel: "Swift-1174", carrier: "Swift", days: 1.6 },
  { parcel: "Swift-1175", carrier: "Swift", days: 2.5 },
  { parcel: "Swift-1176", carrier: "Swift", days: 3.2 },
  { parcel: "Swift-1177", carrier: "Swift", days: 2.1 },
  { parcel: "Swift-1178", carrier: "Swift", days: 1 },
  { parcel: "Swift-1179", carrier: "Swift", days: 1.2 },
];

<BoxPlot
  theme="ledger"
  data={data}
  value="days"
  whiskers="minmax"
  format="{value}d"
  height={120}
  title="Swift delivery times, 180 parcels"
  subtitle="Days from dispatch to delivery, minimum to maximum"
  note="Illustrative data"
/>
```

Put the element in the `return` of a component. The same thing as a JSON spec, rendered with `<Insight spec={spec} />` (`import { Insight } from "insightcharts"`):

```json
{
  "theme": "ledger",
  "data": [
    { "parcel": "Swift-1000", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1001", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1002", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1003", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1004", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1005", "carrier": "Swift", "days": 0.9 },
    { "parcel": "Swift-1006", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1007", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1008", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1009", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1010", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1011", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1012", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1013", "carrier": "Swift", "days": 3.1 },
    { "parcel": "Swift-1014", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1015", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1016", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1017", "carrier": "Swift", "days": 0.7 },
    { "parcel": "Swift-1018", "carrier": "Swift", "days": 0.8 },
    { "parcel": "Swift-1019", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1020", "carrier": "Swift", "days": 0.8 },
    { "parcel": "Swift-1021", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1022", "carrier": "Swift", "days": 3.1 },
    { "parcel": "Swift-1023", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1024", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1025", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1026", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1027", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1028", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1029", "carrier": "Swift", "days": 0.9 },
    { "parcel": "Swift-1030", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1031", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1032", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1033", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1034", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1035", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1036", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1037", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1038", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1039", "carrier": "Swift", "days": 2 },
    { "parcel": "Swift-1040", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1041", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1042", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1043", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1044", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1045", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1046", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1047", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1048", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1049", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1050", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1051", "carrier": "Swift", "days": 3.1 },
    { "parcel": "Swift-1052", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1053", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1054", "carrier": "Swift", "days": 0.9 },
    { "parcel": "Swift-1055", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1056", "carrier": "Swift", "days": 2.5 },
    { "parcel": "Swift-1057", "carrier": "Swift", "days": 2.6 },
    { "parcel": "Swift-1058", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1059", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1060", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1061", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1062", "carrier": "Swift", "days": 2.7 },
    { "parcel": "Swift-1063", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1064", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1065", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1066", "carrier": "Swift", "days": 2.4 },
    { "parcel": "Swift-1067", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1068", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1069", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1070", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1071", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1072", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1073", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1074", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1075", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1076", "carrier": "Swift", "days": 2.9 },
    { "parcel": "Swift-1077", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1078", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1079", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1080", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1081", "carrier": "Swift", "days": 2.5 },
    { "parcel": "Swift-1082", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1083", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1084", "carrier": "Swift", "days": 0.5 },
    { "parcel": "Swift-1085", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1086", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1087", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1088", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1089", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1090", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1091", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1092", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1093", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1094", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1095", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1096", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1097", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1098", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1099", "carrier": "Swift", "days": 2 },
    { "parcel": "Swift-1100", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1101", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1102", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1103", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1104", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1105", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1106", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1107", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1108", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1109", "carrier": "Swift", "days": 0.9 },
    { "parcel": "Swift-1110", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1111", "carrier": "Swift", "days": 2.9 },
    { "parcel": "Swift-1112", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1113", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1114", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1115", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1116", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1117", "carrier": "Swift", "days": 2 },
    { "parcel": "Swift-1118", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1119", "carrier": "Swift", "days": 2.4 },
    { "parcel": "Swift-1120", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1121", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1122", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1123", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1124", "carrier": "Swift", "days": 0.9 },
    { "parcel": "Swift-1125", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1126", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1127", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1128", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1129", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1130", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1131", "carrier": "Swift", "days": 2.5 },
    { "parcel": "Swift-1132", "carrier": "Swift", "days": 2.6 },
    { "parcel": "Swift-1133", "carrier": "Swift", "days": 1.1 },
    { "parcel": "Swift-1134", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1135", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1136", "carrier": "Swift", "days": 2.9 },
    { "parcel": "Swift-1137", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1138", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1139", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1140", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1141", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1142", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1143", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1144", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1145", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1146", "carrier": "Swift", "days": 2.4 },
    { "parcel": "Swift-1147", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1148", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1149", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1150", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1151", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1152", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1153", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1154", "carrier": "Swift", "days": 1.9 },
    { "parcel": "Swift-1155", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1156", "carrier": "Swift", "days": 1.2 },
    { "parcel": "Swift-1157", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1158", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1159", "carrier": "Swift", "days": 2.3 },
    { "parcel": "Swift-1160", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1161", "carrier": "Swift", "days": 0.9 },
    { "parcel": "Swift-1162", "carrier": "Swift", "days": 2.2 },
    { "parcel": "Swift-1163", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1164", "carrier": "Swift", "days": 2 },
    { "parcel": "Swift-1165", "carrier": "Swift", "days": 1.4 },
    { "parcel": "Swift-1166", "carrier": "Swift", "days": 1.7 },
    { "parcel": "Swift-1167", "carrier": "Swift", "days": 1.5 },
    { "parcel": "Swift-1168", "carrier": "Swift", "days": 1.8 },
    { "parcel": "Swift-1169", "carrier": "Swift", "days": 2.6 },
    { "parcel": "Swift-1170", "carrier": "Swift", "days": 1.3 },
    { "parcel": "Swift-1171", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1172", "carrier": "Swift", "days": 2.8 },
    { "parcel": "Swift-1173", "carrier": "Swift", "days": 2.9 },
    { "parcel": "Swift-1174", "carrier": "Swift", "days": 1.6 },
    { "parcel": "Swift-1175", "carrier": "Swift", "days": 2.5 },
    { "parcel": "Swift-1176", "carrier": "Swift", "days": 3.2 },
    { "parcel": "Swift-1177", "carrier": "Swift", "days": 2.1 },
    { "parcel": "Swift-1178", "carrier": "Swift", "days": 1 },
    { "parcel": "Swift-1179", "carrier": "Swift", "days": 1.2 }
  ],
  "value": "days",
  "whiskers": "minmax",
  "format": "{value}d",
  "height": 120,
  "title": "Swift delivery times, 180 parcels",
  "subtitle": "Days from dispatch to delivery, minimum to maximum",
  "note": "Illustrative data",
  "type": "box-plot"
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` (required) | `string` |  | Numeric field to summarise. Pass raw rows; quartiles are computed in the chart. |
| `group` | `string` |  | Category field: one box per distinct value. Omit for a single box. |
| `label` | `string` |  | Field naming each row, shown when hovering an outlier. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Horizontal leaves room for long names; vertical suits ordered categories. |
| `whiskers` | `"tukey" \| "minmax"` | `"tukey"` | `tukey`: furthest point within 1.5 × IQR, the rest drawn as outliers. `minmax`: the extremes. |
| `sort` | `"none" \| "asc" \| "desc"` | `"none"` | Order boxes by median. |

Every chart also accepts these common props:

| Prop | Type | Description |
|---|---|---|
| `data` | `DataInput` | Rows, CSV text, a URL, `{ url, path }`, an async function, or an Arrow-style table. Omit inside `<InsightData>`. |
| `transform` | `Transform \| Transform[]` | A pipeline of transforms applied before drawing. |
| `title` | `string` | The title. One plain statement of what the data shows, with the number and the period ("Monthly churn fell from 4.2% to 2.1% in 2024"), or a plain label ("Monthly churn, 2024"). One clause, no figures of speech. |
| `subtitle` | `string` | Measure, unit, population, period. |
| `source` | `string` | Data source, shown as "Source: ...". |
| `note` | `string` | Method notes or caveats. |
| `height` | `number \| string` | CSS height of the plot. Default 360. |
| `aspect` | `number` | Width / height. Overrides `height`. |
| `highlight` | `string \| string[]` | The entity (or entities) the title is about. Every other series is drawn in grey. |
| `annotations` | `Annotation[]` | Reference lines, shaded bands and callouts, in data coordinates. |
| `format` | `FormatSpec` | How to print values: `"compact"`, `"percent"`, `"currency:USD"`, `"{value} kg"`, Intl options, or a function. |
| `legend` | `boolean` | Show the legend. Default: shown when there are two or more series. |
| `select` | `boolean \| string` | Make marks clickable to filter. Inside `<InsightData>` the selection filters every other chart. Pass a field name, or `true` to use the chart's category field. |
| `onSelect` | `(values: string[], field: string) => void` | Called with the selected values whenever the selection changes. |
| `option` | `EChartsOption \| ((option: EChartsOption, ctx: BuildContext) => EChartsOption)` | Deep-merged over the generated ECharts option, or a function that receives and returns it. Use it for ECharts settings no prop covers. |
| `theme` | `ThemeInput` | A built-in theme name (`"editorial"`, `"ledger"`, `"noir"`...), or a theme object. A named theme paints its own background behind the chart. |
| `frame` | `boolean` | Paint the theme's background behind the chart. Default: on for a named theme with its own surface. |
| `mode` | `ModeInput` | `"auto"` (default) follows the page, `"system"` follows the OS, or force `"light"` / `"dark"`. |
| `renderer` | `RendererInput` | `"auto"` (default) uses SVG for light charts and canvas for heavy ones. |
| `animate` | `boolean` | Set false to disable animation for this chart. Reduced-motion preferences are always respected. |
| `lazy` | `boolean` | Mount the chart only when it scrolls within 200px of the viewport. Default true (from `InsightProvider`). |
| `group` | `string` | Link tooltips with other charts sharing this group id. |
| `exportable` | `boolean \| ExportFormat[]` | Show an export menu: `true` or a list of formats from png, jpeg, svg, pdf, csv, json. |
| `table` | `boolean` | Show a collapsible "View data" table under the chart. |
| `alt` | `string` | Accessible description: the chart type and measures, then the main pattern and the notable values. |
| `id` | `string` | Stable id for this chart's selection in the shared store. |
| `onEvents` | `Record<string, ChartEventHandler>` | ECharts event handlers: `{ click: (params, chart) => {} }`. |
| `onReady` | `(chart: EChartsInstance) => void` | Called with the ECharts instance once it is initialised. |
| `className` | `string` | Class on the figure element. |
| `style` | `CSSProperties` | Inline style on the figure element. |

## Composition

- Built from: nothing. It is a primitive.
- Used by: no molecule or template yet.

## Rules for this form

- Name the measure and its unit in `subtitle`.
- State how many observations the chart draws when the number is small.
- Do not set colours per series. Set `highlight` to the one or two entities the title is about. The others are drawn in grey.
- Use at most three `annotations`. Their values must match values in the data.
- No dual axes and no 3D. The chart must read without hovering.
- Write `title` as one plain statement of fact with its number and its period, in one clause ("Monthly churn fell from 4.2% to 2.1% in 2024"), or as a plain label ("Monthly churn, 2024"). No metaphors, no dramatic verbs, no second half joined with a comma, "and" or a dash.

## Accessibility

- The chart is exposed as an image (`role="img"`) with a description the component writes from the data. Set `alt` when the title states a different fact from that description: chart type and measures first, then the main pattern and the notable values.
- Set `table` to add a collapsible "View data" table under the chart, for readers who need exact values or use a screen reader.
- The title is a heading, the legend a list and the source a `<figcaption>`. Do not repeat them in surrounding markup.

## Verify

- [ ] The project typechecks (`npx tsc --noEmit`). Props are typed, so a misspelt prop is an error in JSX.
- [ ] A JSON spec validates against https://insightcharts.dev/schema/insight-spec.json. Unknown props fail.
- [ ] It renders in a browser at desktop width and at about 380px wide with no clipped or overlapping text.
- [ ] It reads in light and in dark mode.
- [ ] The title is one clause that states one fact with its number and period, or it is a plain label.
- [ ] Every number in the text can be found in the data or computed from it.
- [ ] `source` is set.
- [ ] One entity is highlighted and the others are grey, or the chart has one series.
- [ ] The chart can be read without hovering.
- [ ] No example data or example text is left in place.

## Reference

- Instructions for the component without this example: https://insightcharts.dev/agents/atoms/box-plot.md
- Component reference with every example: https://insightcharts.dev/llms/box-plot.md
- Registry item: https://insightcharts.dev/r/box-plot.json
- Source: https://github.com/insightcharts/insightcharts/blob/main/packages/insightcharts/src/atoms/box-plot.tsx
- How to choose a different atom: https://insightcharts.dev/agents/atoms.md
- This page: https://insightcharts.dev/atoms/box-plot#example-single-box-min-max-whiskers
- These instructions as plain text: https://insightcharts.dev/agents/atoms/box-plot/single-box-min-max-whiskers.md
- Instructions for one component: https://insightcharts.dev/agents/<atoms|molecules|templates>/<name>.md
- Every guide, component and prompt: https://insightcharts.dev/llms.txt
- JSON Schema for specs: https://insightcharts.dev/schema/insight-spec.json
- Component manifest: https://insightcharts.dev/schema/manifest.json
- Registry catalogue: https://insightcharts.dev/r/registry.json
