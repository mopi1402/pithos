import type { ModuleTransform } from "./types.js";

/**
 * Configuration for module transformations for display.
 * Allows renaming modules and skipping levels in the hierarchy.
 */
export const MODULE_TRANSFORMS: readonly ModuleTransform[] = [
  {
    sourceModule: "kanon",
    displayName: "Kanon (v3)",
    skipLevels: ["v3"],
    filePathPrefix: "kanon/v3/",
  },
] as const;

/**
 * Configuration for module display order based on the number of columns.
 * Each inner array represents a column with the modules it contains.
 */
export const MODULE_ORDER_3_COLUMNS: readonly (readonly string[])[] = [
  ["arkhe", "zygos"],
  ["kanon", "taphos"],
  ["sphalma"],
] as const;

export const MODULE_ORDER_2_COLUMNS: readonly (readonly string[])[] = [
  ["arkhe", "sphalma"],
  ["kanon", "zygos", "taphos"],
] as const;

export const MODULE_ORDER_1_COLUMN: readonly (readonly string[])[] = [
  ["arkhe", "kanon", "zygos", "taphos", "sphalma"],
] as const;


