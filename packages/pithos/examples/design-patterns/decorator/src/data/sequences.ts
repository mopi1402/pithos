import type { DecoratorOption } from "@/lib/types";

export const SAMPLE_SEQUENCES = [
  { name: "High GC", sequence: "GCGCGCGCGCGCGCGCGCGCGCGCGCGCGCGC", description: "High GC content (~100%)" },
  { name: "Balanced", sequence: "ATCGATCGATCGATCGATCGATCGATCGATCG", description: "Balanced AT/GC (~50%)" },
  { name: "Low GC", sequence: "ATATATATATATATATATATATATATATATATAT", description: "Low GC content (~0%)" },
  { name: "Mixed", sequence: "ATCGNNNATCGNNNATCGNNNATCGNNNATCG", description: "Contains invalid bases (N)" },
];

export const DECORATOR_INFO: Record<DecoratorOption, { label: string; color: string }> = {
  qualityFilter: { label: "Quality Filter", color: "bg-amber-500" },
  cache: { label: "Cache", color: "bg-blue-500" },
  retry: { label: "Retry (3x)", color: "bg-purple-500" },
  timing: { label: "Timing", color: "bg-emerald-500" },
};
