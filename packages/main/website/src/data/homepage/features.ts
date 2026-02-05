import { translate } from "@docusaurus/Translate";

export interface Feature {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "/img/generated/homepage/best_performance",
    title: translate({ id: 'homepage.features.performance.title', message: 'Best Performance' }),
    description: translate({ id: 'homepage.features.performance.description', message: '2-3× better performance in modern JavaScript runtimes compared to alternatives.' }),
    link: "/comparisons/overview/",
  },
  {
    icon: "/img/generated/homepage/tiny_bundle_size",
    title: translate({ id: 'homepage.features.bundleSize.title', message: 'Tiny Bundle Size' }),
    description: translate({ id: 'homepage.features.bundleSize.description', message: 'Up to 97% less JavaScript code. Fully tree-shakeable for optimal bundle size.' }),
    link: "/comparisons/arkhe/bundle-size",
  },
  {
    icon: "/img/generated/homepage/battle_tested",
    title: translate({ id: 'homepage.features.battleTested.title', message: 'Battle-tested' }),
    description: translate({ id: 'homepage.features.battleTested.description', message: '100% test coverage and 100% mutation testing for maximum reliability.' }),
    link: "/guide/basics/testing-strategy",
  },
  {
    icon: "/img/generated/homepage/smart_migration",
    title: translate({ id: 'homepage.features.migration.title', message: 'Smart Migration' }),
    description: translate({ id: 'homepage.features.migration.description', message: 'IDE-guided migration path from Lodash with Taphos. Migrate at your own pace.' }),
    link: "/guide/modules/taphos/#ide-guided-migration",
  },
  {
    icon: "/img/generated/homepage/use_cases_discovery",
    title: translate({ id: 'homepage.features.useCases.title', message: 'Use Cases Discovery' }),
    description: translate({ id: 'homepage.features.useCases.description', message: '850+ documented use cases to find the right utility for your needs.' }),
    link: "/use-cases",
  },
  {
    icon: "/img/generated/homepage/typescript_first",
    title: translate({ id: 'homepage.features.typescript.title', message: 'TypeScript-first' }),
    description: translate({ id: 'homepage.features.typescript.description', message: 'Native types included. Zero @types dependencies needed.' }),
    link: "/guide/contribution/design-principles/typescript-first/",
  },
];
