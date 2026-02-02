import { defineConfig } from "vitest/config";
import { resolve } from "path";

export const globalExclude = [
  "**/node_modules/**",
  "**/packages/tmp/**",
  "**/tmp/**",
  "**/vendor/**",
   "**/scripts/**",
  "**/.stryker-tmp/**",
];

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      include: ["**/inference.test.ts"],
      exclude: globalExclude,
    },
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [
      ...globalExclude,
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    coverage: {
      reportsDirectory: "reports/coverage",
      include: ["packages/pithos/src/**/*.ts"],
      exclude: [
        ...globalExclude,
        "**/dist/**",
        "**/reports/**",
        "**/packages/pithos/src/kanon/v1/**",
        "**/packages/pithos/src/kanon/v2/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@arkhe": resolve(__dirname, "./packages/pithos/src/arkhe"),
      "@kanon": resolve(__dirname, "./packages/pithos/src/kanon"),
      "@zygos": resolve(__dirname, "./packages/pithos/src/zygos"),
      "@taphos": resolve(__dirname, "./packages/pithos/src/taphos"),
      "@sphalma": resolve(__dirname, "./packages/pithos/src/sphalma"),
      _internal: resolve(__dirname, "./packages/pithos/src/_internal"),
    },
  },
});
