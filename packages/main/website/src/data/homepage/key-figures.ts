import { translate } from "@docusaurus/Translate";
import { KANON_JIT_RATIO } from "@site/src/data/generated/pre-computed-comparisons";

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
    value: KANON_JIT_RATIO ? KANON_JIT_RATIO.toFixed(1) : "11.0",
    suffix: "×",
    label: translate({ id: 'homepage.keyFigures.fastValidation', message: 'Fast Validation (JIT)' }),
    highlight: translate({ id: 'homepage.keyFigures.vsZod', message: 'vs Zod' }),
    link: "/comparisons/kanon/performances",
  },
  {
    prefix: "-",
    value: 89,
    suffix: "%",
    label: translate({ id: 'homepage.keyFigures.bundleSize', message: 'Bundle size' }),
    highlight: translate({ id: 'homepage.keyFigures.vsLodash', message: 'vs Lodash' }),
    link: "/comparisons/arkhe/bundle-size",
  },
  {
    value: 100,
    suffix: "%",
    label: translate({ id: 'homepage.keyFigures.testCoverage', message: 'Test + Mutation coverage' }),
    link: "/guide/basics/testing-strategy",
  },
  {
    value: 100,
    suffix: "%",
    label: translate({ id: 'homepage.keyFigures.apiCompatible', message: 'API compatible' }),
    highlight: translate({ id: 'homepage.keyFigures.withNeverthrow', message: 'with Neverthrow' }),
    link: "/comparisons/zygos/interoperability",
  },
];
