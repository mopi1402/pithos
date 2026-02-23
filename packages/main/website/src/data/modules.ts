import { translate } from "@docusaurus/Translate";

export type ModuleItem = {
  name: string;
  logo: string;
  description: string;
  docLink: string;
  apiLink: string;
  status?: "stable" | "beta" | "deprecated" | "new";
  /** e.g. "Lodash alternative" */
  alternative?: string;
  /** Key to match in QuickComparisonTable calculations: "arkhe" | "kanon" | "zygos" */
  comparisonKey?: "arkhe" | "kanon" | "zygos";
};

export const MODULE_LIST: ModuleItem[] = [
  {
    name: "Arkhe",
    logo: "img/emoji/letter-a.png",
    description: translate({ id: 'homepage.modules.arkhe.description', message: 'Pure utility functions' }),
    docLink: "/guide/modules/arkhe",
    apiLink: "/api/arkhe",
    status: "stable",
    alternative: translate({ id: 'homepage.modules.arkhe.alternative', message: 'Lodash alternative' }),
    comparisonKey: "arkhe",
  },
  {
    name: "Kanon",
    logo: "img/emoji/letter-k.png",
    description: translate({ id: 'homepage.modules.kanon.description', message: 'JIT-compiled schema validation' }),
    docLink: "/guide/modules/kanon",
    apiLink: "/api/kanon",
    status: "stable",
    alternative: translate({ id: 'homepage.modules.kanon.alternative', message: 'Zod alternative' }),
    comparisonKey: "kanon",
  },
  {
    name: "Zygos",
    logo: "img/emoji/letter-z.png",
    description: translate({ id: 'homepage.modules.zygos.description', message: 'Result pattern & monads' }),
    docLink: "/guide/modules/zygos",
    apiLink: "/api/zygos",
    status: "stable",
    alternative: translate({ id: 'homepage.modules.zygos.alternative', message: 'Neverthrow & fp-ts alternative' }),
    comparisonKey: "zygos",
  },
  {
    name: "Sphalma",
    logo: "img/emoji/letter-s.png",
    description: translate({ id: 'homepage.modules.sphalma.description', message: 'Typed error factories with error codes' }),
    docLink: "/guide/modules/sphalma",
    apiLink: "/api/sphalma",
    status: "stable",
  },
  {
    name: "Taphos",
    logo: "img/emoji/letter-t.png",
    description: translate({ id: 'homepage.modules.taphos.description', message: 'Lodash migration guide with IDE integration' }),
    docLink: "/guide/modules/taphos",
    apiLink: "/api/taphos",
    status: "stable",
  },
];
