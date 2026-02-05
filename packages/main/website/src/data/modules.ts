import { translate } from "@docusaurus/Translate";

export type ModuleItem = {
  name: string;
  logo: string;
  description: string;
  docLink: string;
  apiLink: string;
  status?: "stable" | "beta" | "deprecated" | "new";
};

export const MODULE_LIST: ModuleItem[] = [
  {
    name: "Arkhe",
    logo: "img/emoji/letter-a.png",
    description: translate({ id: 'homepage.modules.arkhe.description', message: 'Modern Lodash replacement with pure utility functions' }),
    docLink: "/guide/modules/arkhe",
    apiLink: "/api/arkhe",
    status: "stable",
  },
  {
    name: "Kanon",
    logo: "img/emoji/letter-k.png",
    description: translate({ id: 'homepage.modules.kanon.description', message: 'Schema validation with JIT compilation' }),
    docLink: "/guide/modules/kanon",
    apiLink: "/api/kanon",
    status: "stable",
  },
  {
    name: "Zygos",
    logo: "img/emoji/letter-z.png",
    description: translate({ id: 'homepage.modules.zygos.description', message: 'Result pattern & monads for functional error handling' }),
    docLink: "/guide/modules/zygos",
    apiLink: "/api/zygos",
    status: "stable",
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
