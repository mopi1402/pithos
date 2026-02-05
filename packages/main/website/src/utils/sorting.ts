import type { ScenarioData } from "@site/src/components/comparisons/BenchmarkTable/types";

/**
 * Extracts the utility/function name from a scenario name (before any newline).
 */
export function getUtilityName(scenarioName: string): string {
  return scenarioName.split("\n")[0].trim();
}

/**
 * Sorts libraries with "native" first, then the primary library, then alphabetically.
 * Excludes libraries in the exclusion list.
 */
export function sortLibraries(
  libraries: string[],
  primaryLibrary: string,
  excludedLibraries: string[],
): string[] {
  return [...libraries]
    .filter((lib) => !excludedLibraries.includes(lib))
    .sort((a, b) => {
      if (a === "native") return -1;
      if (b === "native") return 1;
      if (a === primaryLibrary) return -1;
      if (b === primaryLibrary) return 1;
      return a.localeCompare(b);
    });
}

/**
 * Sorts scenarios by category order, then alphabetically within each category.
 */
export function sortScenarios<TCategory extends string>(
  scenarios: ScenarioData[],
  functionToCategory: Record<string, TCategory>,
  categoryOrder: TCategory[],
): ScenarioData[] {
  return [...scenarios].sort((a, b) => {
    const catA = functionToCategory[getUtilityName(a.name)];
    const catB = functionToCategory[getUtilityName(b.name)];
    const indexA = catA ? categoryOrder.indexOf(catA) : 999;
    const indexB = catB ? categoryOrder.indexOf(catB) : 999;
    if (indexA !== indexB) return indexA - indexB;
    return a.name.localeCompare(b.name);
  });
}
