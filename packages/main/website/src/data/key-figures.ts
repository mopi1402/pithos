export interface KeyFigure {
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
  highlight?: string;
  link?: string;
}

export const KEY_FIGURES: KeyFigure[] = [
  {
    value: "2.5",
    suffix: "×",
    label: "Fast Validation",
    highlight: "vs Zod",
    link: "/comparisons/kanon/performances",
  },
  {
    prefix: "-",
    value: 89,
    suffix: "%",
    label: "Bundle size",
    highlight: "vs Lodash",
    link: "/comparisons/arkhe/bundle-size",
  },
  {
    value: 100,
    suffix: "%",
    label: "Test + Mutation coverage",
    link: "/guide/basics/testing-strategy",
  },
  {
    value: 100,
    suffix: "%",
    label: "API compatible",
    highlight: "with Neverthrow",
    link: "/comparisons/zygos/interoperability",
  },
];
