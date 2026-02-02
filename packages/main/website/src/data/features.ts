export interface Feature {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "🚀",
    title: "Best Performance",
    description:
      "2-3× better performance in modern JavaScript runtimes compared to alternatives.",
    link: "/comparisons/overview/",
  },
  {
    icon: "📦",
    title: "Tiny Bundle Size",
    description:
      "Up to 97% less JavaScript code. Fully tree-shakeable for optimal bundle size.",
    link: "/comparisons/arkhe/bundle-size",
  },
  {
    icon: "🧪",
    title: "Battle-tested",
    description:
      "100% test coverage and 100% mutation testing for maximum reliability.",
    link: "/guide/basics/testing-strategy",
  },
  {
    icon: "🔄",
    title: "Smart Migration",
    description:
      "IDE-guided migration path from Lodash with Taphos. Migrate at your own pace.",
    link: "/guide/modules/taphos/#ide-guided-migration",
  },
  {
    icon: "📚",
    title: "Use Cases Discovery",
    description:
      "800+ documented use cases to find the right utility for your needs.",
    link: "/use-cases",
  },
  {
    icon: "💎",
    title: "TypeScript-first",
    description: "Native types included. Zero @types dependencies needed.",
    link: "/guide/contribution/design-principles/typescript-first/",
  },
];
