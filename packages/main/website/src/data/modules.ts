export type ModuleItem = {
  name: string;
  description: string;
  docLink: string;
  apiLink: string;
  status?: "stable" | "beta" | "deprecated";
};

export const MODULE_LIST: ModuleItem[] = [
  {
    name: "Arkhe",
    description: "Modern Lodash replacement with pure utility functions",
    docLink: "/guide/modules/arkhe",
    apiLink: "/api/arkhe",
    status: "stable",
  },
  {
    name: "Kanon",
    description: "Schema validation with JIT compilation",
    docLink: "/guide/modules/kanon",
    apiLink: "/api/kanon",
    status: "stable",
  },
  {
    name: "Zygos",
    description: "Result pattern & monads for functional error handling",
    docLink: "/guide/modules/zygos",
    apiLink: "/api/zygos",
    status: "stable",
  },
  {
    name: "Sphalma",
    description: "Typed error factories with error codes",
    docLink: "/guide/modules/sphalma",
    apiLink: "/api/sphalma",
    status: "stable",
  },
  {
    name: "Taphos",
    description: "Lodash migration guide with IDE integration",
    docLink: "/guide/modules/taphos",
    apiLink: "/api/taphos",
    status: "stable",
  },
];


