export type ModuleSize = {
  readonly moduleName: string;
  readonly rawBytes: number;
  readonly gzipBytes: number;
  readonly brotliBytes: number;
};

export type FileRow = ModuleSize & {
  readonly fileName: string;
  readonly categoryName: string;
};

export type CategorySize = {
  readonly categoryName: string;
  readonly rawBytes: number;
  readonly gzipBytes: number;
  readonly brotliBytes: number;
};

export type ModuleWithFiles = ModuleSize & {
  readonly categories: CategorySize[];
  readonly files: FileRow[];
};

export type SizeData = {
  readonly modules: ModuleWithFiles[];
  readonly grandTotal: ModuleSize;
};

export const metrics = ["raw", "gzip", "brotli"] as const;
export type Metric = (typeof metrics)[number];

/**
 * Configuration for module transformations for display.
 * Allows renaming modules and skipping levels in the hierarchy.
 */
export type ModuleTransform = {
  /**
   * Source module name (in files)
   */
  readonly sourceModule: string;
  /**
   * Display module name (for display)
   */
  readonly displayName: string;
  /**
   * Levels to skip in the path (e.g., ["v3"] to skip the v3 level)
   */
  readonly skipLevels?: readonly string[];
  /**
   * Prefix to remove from file names (e.g., "kanon/v3/")
   */
  readonly filePathPrefix?: string;
};
