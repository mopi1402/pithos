// scripts/merge-docs/types.ts
// Type definitions for merge-docs

/**
 * Represents a single use case for a function.
 */
export interface UseCase {
    title: string;
    description: string;
    isPrimary: boolean;
    codeExample?: string; // Code example for new format
    keywords?: string[];
}

/**
 * Represents all use cases and metadata for a function.
 */
export interface FunctionUseCases {
    module: string;
    function: string;
    isImportant: boolean;
    isHiddenGem: boolean;
    hiddenGemDescription?: string;
    useCases: UseCase[];
    format?: "old" | "new"; // Format detection
}

/**
 * Represents a collected doc item for deduplication.
 */
export interface CollectedDocItem {
    filePath: string;
    outputDir: string;
    moduleKey: string;
    providedType?: string;
    depth: number; // Depth of the source path to determine priority
    mergedContent?: string; // Content merged from auxiliary items (e.g. Options interfaces)
    mergedTypes?: string[]; // Names of types that were merged into this item
}

/**
 * A custom merge group configuration.
 * Defines a parent item and an ordered list of children to merge into it.
 */
export interface MergeGroup {
    /** Module key prefix, e.g. "kanon/jit" */
    module: string;
    /** Name of the parent item (must exist in collectedItems as module/parent) */
    parent: string;
    /** Ordered list of child item names to merge into the parent */
    children: string[];
}

/**
 * Top-level configuration for custom merge groups.
 */
export interface MergeGroupsConfig {
    mergeGroups: MergeGroup[];
}
