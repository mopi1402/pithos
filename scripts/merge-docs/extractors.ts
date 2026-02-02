// scripts/merge-docs/extractors.ts
// Content extraction utilities

/**
 * Extract function/class name from content.
 */
export function extractName(content: string): string | null {
    const match = content.match(
        /^# (?:Function|Class|Interface|Type Alias|Variable|Enum): (\w+)/m
    );
    return match ? match[1] : null;
}

/**
 * Extract type (Function, Class, Interface, etc.) from content.
 */
export function extractType(content: string): string | null {
    const match = content.match(
        /^# (Function|Class|Interface|Type Alias|Variable|Enum):/m
    );
    if (!match) return null;

    // Normalize type names
    const typeMap: Record<string, string> = {
        Function: "function",
        Class: "class",
        Interface: "interface",
        "Type Alias": "type",
        Variable: "variable",
        Enum: "enum",
    };

    return typeMap[match[1]] || match[1].toLowerCase();
}
