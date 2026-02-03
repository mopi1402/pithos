import type { ReactNode } from "react";

export interface Feature {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "/img/homepage/best_performance.png",
    title: "Best Performance",
    description:
      "2-3× better performance in modern JavaScript runtimes compared to alternatives.",
    link: "/comparisons/overview/",
  },
  {
    icon: "/img/homepage/tiny_bundle_size.png",
    title: "Tiny Bundle Size",
    description:
      "Up to 97% less JavaScript code. Fully tree-shakeable for optimal bundle size.",
    link: "/comparisons/arkhe/bundle-size",
  },
  {
    icon: "/img/homepage/battle_tested.png",
    title: "Battle-tested",
    description:
      "100% test coverage and 100% mutation testing for maximum reliability.",
    link: "/guide/basics/testing-strategy",
  },
  {
    icon: "/img/homepage/smart_migration.png",
    title: "Smart Migration",
    description:
      "IDE-guided migration path from Lodash with Taphos. Migrate at your own pace.",
    link: "/guide/modules/taphos/#ide-guided-migration",
  },
  {
    icon: "/img/homepage/use_cases_discovery.png",
    title: "Use Cases Discovery",
    description:
      "800+ documented use cases to find the right utility for your needs.",
    link: "/use-cases",
  },
  {
    icon: "/img/homepage/typescript_first.png",
    title: "TypeScript-first",
    description: "Native types included. Zero @types dependencies needed.",
    link: "/guide/contribution/design-principles/typescript-first/",
  },
];
