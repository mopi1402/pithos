import React from "react";

// Interface for the data prop
interface AliasData {
  [key: string]: { name: string; group: string } | null;
}

interface AlsoKnownAsProps {
  data: AliasData;
}

// Order and configuration for libraries
const LIBRARY_CONFIG: Record<string, { label: string; priority: number }> = {
  lodash: { label: "Lodash", priority: 1 },
  "es-toolkit": { label: "es-toolkit", priority: 2 },
  remeda: { label: "Remeda", priority: 3 },
  radashi: { label: "Radashi", priority: 4 },
  ramda: { label: "Ramda", priority: 5 },
  effect: { label: "Effect", priority: 6 },
  moderndash: { label: "Modern Dash", priority: 7 },
  antfu: { label: "Antfu", priority: 8 },
  python: { label: "Python", priority: 90 },
  kotlin: { label: "Kotlin", priority: 91 },
};

// Start priority for unknown libraries
const UNKNOWN_PRIORITY_START = 100;

// Libraries to exclude from the display
const EXCLUDED_LIBRARIES = ["python", "kotlin"];

export default function AlsoKnownAs({ data }: AlsoKnownAsProps) {
  const missingLibraries: { label: string; priority: number }[] = [];

  // Use a Set to merge keys from data and our config, ensuring we check everything
  const allKeys = new Set([...Object.keys(data), ...Object.keys(LIBRARY_CONFIG)]);

  // Helper to get library info
  const getLibraryInfo = (key: string) => {
    if (LIBRARY_CONFIG[key]) {
      return LIBRARY_CONFIG[key];
    }
    // Default for unknown libraries
    return {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      priority: UNKNOWN_PRIORITY_START,
    };
  };


  // We need a slightly more complex structure for nameMap to allow sorting
  const nameMapStruct = new Map<
    string,
    { label: string; priority: number }[]
  >();

  for (const key of allKeys) {
    if (EXCLUDED_LIBRARIES.includes(key)) continue;

    const alias = data[key];
    const info = getLibraryInfo(key);

    if (alias) {
      if (!nameMapStruct.has(alias.name)) {
        nameMapStruct.set(alias.name, []);
      }
      nameMapStruct.get(alias.name)?.push(info);
    } else {
      missingLibraries.push(info);
    }
  }

  // Sort function
  const sortLibs = (
    a: { priority: number; label: string },
    b: { priority: number; label: string }
  ) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.label.localeCompare(b.label);
  };

  // Sort names alphabetically
  const sortedNames = Array.from(nameMapStruct.keys()).sort();

  // Build the display parts
  const parts: React.ReactNode[] = [];

  // Add grouped names
  for (const name of sortedNames) {
    const libs = nameMapStruct.get(name);
    if (!libs) continue;

    libs.sort(sortLibs);

    parts.push(
      <React.Fragment key={name}>
        <code>{name}</code> ({libs.map((l) => l.label).join(", ")})
      </React.Fragment>
    );
  }

  // Add missing libraries at the end
  if (missingLibraries.length > 0) {
    missingLibraries.sort(sortLibs);
    parts.push(
      <React.Fragment key="missing">
        ❌ ({missingLibraries.map((l) => l.label).join(", ")})
      </React.Fragment>
    );
  }

  return (
    <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
      <p style={{ margin: 0 }}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && " · "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
