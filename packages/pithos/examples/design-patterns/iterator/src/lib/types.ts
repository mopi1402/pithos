export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  /** Marks the start of a new group (evolution chain or type group). */
  groupStart?: string;
}

export type SourceId = "byIndex" | "byEvolution" | "byType";

export const SOURCES: Record<SourceId, { label: string; description: string; tech: string }> = {
  byIndex:     { label: "Index",     description: "#001 → #151",        tech: "array[i++]" },
  byEvolution: { label: "Evolution", description: "Chain traversal",    tech: "chain walk" },
  byType:      { label: "Type",      description: "Grouped by type",    tech: "grouped DFS" },
};

export const SOURCE_IDS: SourceId[] = ["byIndex", "byEvolution", "byType"];
