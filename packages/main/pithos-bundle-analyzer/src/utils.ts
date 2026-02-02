import type { ModuleTransform } from "./types.js";
import {
  MODULE_TRANSFORMS,
  MODULE_ORDER_1_COLUMN,
  MODULE_ORDER_2_COLUMNS,
  MODULE_ORDER_3_COLUMNS,
} from "./config.js";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} kB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Finds the transformation for a given module.
 */
export function findModuleTransform(
  moduleName: string
): ModuleTransform | undefined {
  return MODULE_TRANSFORMS.find((t) => t.sourceModule === moduleName);
}

/**
 * Finds the transformation by display name.
 */
export function findModuleTransformByDisplayName(
  displayName: string
): ModuleTransform | undefined {
  return MODULE_TRANSFORMS.find((t) => t.displayName === displayName);
}

/**
 * Gets the display name of a module, or returns the original name if there is no transformation.
 */
export function getModuleDisplayName(moduleName: string): string {
  const transform = findModuleTransform(moduleName);
  return transform?.displayName ?? moduleName;
}

/**
 * Gets the source name of a module from its display name.
 */
export function getModuleSourceName(displayName: string): string {
  const transform = findModuleTransformByDisplayName(displayName);
  return transform?.sourceModule ?? displayName;
}

/**
 * Gets the module column configuration based on the number of columns.
 */
export function getModuleColumns(
  numColumns: number
): readonly (readonly string[])[] {
  if (numColumns === 1) return MODULE_ORDER_1_COLUMN;
  if (numColumns === 2) return MODULE_ORDER_2_COLUMNS;
  return MODULE_ORDER_3_COLUMNS;
}
