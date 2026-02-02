// scripts/merge-docs/processor.ts
// Main file processing logic

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { API_DOCS, DOC_EXTENSION } from "../common/constants.js";
import {
    cleanMarkdown,
    extractThrowsSection,
    extractSeeSection,
    extractDeprecatedSection,
    extractInternalSection,
    extractDefaultSection,
    extractInfoSection,
    extractNoteSection,
    extractAlertSection,
    extractTipSection,
    removeThrowsAndSeeSections,
    reformatParameters,
    escapeGenericTypesForMDX,
    getInlineBadgeHtml,
} from "../doc-formatters/index.js";
import type { FunctionUseCases, CollectedDocItem } from "./types.js";
import { loadOverride, loadHowItWorks, loadUseCasesContent, parseUseCasesFromMarkdown } from "./loaders.js";
import { extractErrorTypesFromSource } from "./error-types.js";
import {
    generateAlsoKnownAsSection,
    enrichThrowsSectionWithTypes,
    generateHiddenGemSection,
    generateUseCasesSection,
    transformMermaidToResponsive,
} from "./section-generators.js";
import { extractName, extractType } from "./extractors.js";
import { collectModule } from "./collectors.js";
import { rewriteInternalLinks, createUnresolvedLinksTracker, markLinkResolved, logUnresolvedLinks } from "./link-rewriter.js";

// Load doc modules configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docModulesConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/doc-modules.json"), "utf-8")
) as { modules: Array<{ name: string; enabled: boolean; description: string }> };

/**
 * Get the list of enabled documentation modules.
 */
function getEnabledModules(): string[] {
    return docModulesConfig.modules
        .filter(m => m.enabled)
        .map(m => m.name);
}

/**
 * Process the API docs and create clean structure.
 */
export function processApiDocs(
    aliasesMap: Map<string, any>,
    collectedUseCases: FunctionUseCases[] = []
) {
    const modules = getEnabledModules();

    // First pass: collect all doc items
    // Map key is "outputDir/fnName" to detect duplicates
    const collectedItems = new Map<string, CollectedDocItem>();

    for (const moduleName of modules) {
        const modulePath = path.join(API_DOCS, moduleName);
        if (!fs.existsSync(modulePath)) continue;

        collectModule(modulePath, moduleName, collectedItems);
    }

    // Log duplicates that were filtered
    const duplicatesFiltered = new Set<string>();

    // Pass: Merge Options interfaces into their functions
    mergeOptions(collectedItems);

    // Second pass: process only the collected (deduplicated) items
    for (const [key, item] of collectedItems) {
        processFile(
            item.filePath,
            item.outputDir,
            item.moduleKey,
            aliasesMap,
            collectedUseCases,
            collectedItems,
            item.providedType,
            item.mergedContent,
            item.mergedTypes
        );
    }

    if (duplicatesFiltered.size > 0) {
        console.log(`  Filtered ${duplicatesFiltered.size} duplicate re-exports`);
    }
}

/**
 * Normalize a name to lowercase without hyphens for comparison.
 * Handles both kebab-case (order-by) and camelCase (orderBy).
 */
function normalizeName(name: string): string {
    return name.toLowerCase().replace(/-/g, "");
}

/**
 * Merge Options interfaces into their parent functions
 */
function mergeOptions(collectedItems: Map<string, CollectedDocItem>) {
    // Group items by directory path (module)
    const itemsByDir = new Map<string, CollectedDocItem[]>();

    for (const [key, item] of collectedItems) {
        // Skip items that don't look like they are in a structured module folder
        // We expect .../Parent/Type/File.md
        const parentDir = path.dirname(item.filePath);
        const grandParentDir = path.dirname(parentDir);

        if (!itemsByDir.has(grandParentDir)) {
            itemsByDir.set(grandParentDir, []);
        }
        itemsByDir.get(grandParentDir)!.push(item);
    }

    // Identify and merge items
    for (const [dirPath, items] of itemsByDir) {
        // The module name is the name of the directory (e.g. "retry", "order-by")
        const moduleName = path.basename(dirPath);

        // Find the main function
        // It should match the module name and be in a "functions" folder
        // Use normalizeName to handle kebab-case vs camelCase (e.g., "order-by" vs "orderBy")
        const mainFn = items.find(
            (i) =>
                normalizeName(path.basename(i.filePath, ".md")) === normalizeName(moduleName) &&
                i.filePath.includes("/functions/")
        );

        if (mainFn) {
            // Find auxiliary types (interfaces and type aliases)
            // heuristic: in "interfaces" or "type-aliases" folder
            const auxTypes = items.filter(
                (i) =>
                    i !== mainFn &&
                    (i.filePath.includes("/interfaces/") ||
                        i.filePath.includes("/type-aliases/") ||
                        i.filePath.includes("interfaces/") ||
                        i.filePath.includes("type-aliases/"))
            );

            for (const aux of auxTypes) {
                // Read content
                const auxContent = fs.readFileSync(aux.filePath, "utf-8");
                let cleanAux = cleanMarkdown(removeThrowsAndSeeSections(auxContent));
                
                // Reformat parameters BEFORE merging
                cleanAux = reformatParameters(cleanAux);
                
                const auxName = path.basename(aux.filePath, ".md");

                // Determine badge label
                const isInterface =
                    aux.filePath.includes("/interfaces/") ||
                    aux.filePath.includes("interfaces/");
                const badgeLabel = isInterface ? "Interface" : "Type";

                // Replace the title with markdown ## header + inline badge
                // Use markdown header so it appears in table of contents
                // Add explicit anchor ID using just the type name (without generics) for easier linking
                cleanAux = cleanAux.replace(/^#\s+(.+)$/m, (match, title) => {
                    return `## ${title} {#${auxName.toLowerCase()}}\n\n${getInlineBadgeHtml(badgeLabel)}`;
                });

                // Store merged content in the main function item
                // Store merged content in the main function item
                if (!mainFn.mergedContent) {
                    mainFn.mergedContent = "";
                }
                if (!mainFn.mergedTypes) {
                    mainFn.mergedTypes = [];
                }

                // Add separator and content
                // We rely on the header's auto-generated ID for linking
                mainFn.mergedContent += `\n\n***\n\n${cleanAux}`;
                mainFn.mergedTypes.push(auxName);

                // Remove the auxiliary item from collectedItems so it's not written separately
                for (const [k, v] of collectedItems) {
                    if (v === aux) {
                        collectedItems.delete(k);
                        console.log(`  📎 Merged ${auxName} (${badgeLabel}) → ${path.basename(mainFn.filePath, ".md")}`);
                        break;
                    }
                }
            }
        }
    }
}

/**
 * Process a single documentation file.
 */
export function processFile(
    filePath: string,
    outputDir: string,
    moduleKey: string,
    aliasesMap: Map<string, any>,
    collectedUseCases: FunctionUseCases[] = [],
    collectedItems: Map<string, CollectedDocItem>,
    providedType?: string,
    mergedContent?: string,
    mergedTypes?: string[]
) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Extract function name before cleaning
    const fnName = extractName(content) || path.basename(filePath, ".md");
    // Use provided type if available, otherwise try to extract from content
    const itemType = providedType || extractType(content);

    // Create tracker for unresolved links (warnings deferred until end)
    const unresolvedLinks = createUnresolvedLinksTracker();

    // Extract all special sections before cleaning (they will be reinserted later)
    let throwsSection = extractThrowsSection(content);
    let alertSection = extractAlertSection(content);
    let deprecatedSection = extractDeprecatedSection(content);
    let infoSection = extractInfoSection(content);
    let noteSection = extractNoteSection(content);
    let tipSection = extractTipSection(content);
    let seeSection = extractSeeSection(content);
    let internalSection = extractInternalSection(content);
    const defaultSection = extractDefaultSection(content);

    // Enrich throws section with error types from source file
    if (throwsSection) {
        const errorTypes = extractErrorTypesFromSource(filePath, fnName);
        if (errorTypes.length > 0) {
            // Parse the existing throws section to add types
            throwsSection = enrichThrowsSectionWithTypes(throwsSection, errorTypes);
        }
    }

    // Remove all special sections from content (they will be reinserted in the right place)
    content = removeThrowsAndSeeSections(content);

    // Clean the content
    content = cleanMarkdown(content);

    // Reformat parameters to have type on same line
    content = reformatParameters(content);

    // escape generic types that could be interpreted as JSX tags in MDX
    content = escapeGenericTypesForMDX(content);

    // Rewrite internal links to match the flattened output structure
    content = rewriteInternalLinks(content, outputDir, moduleKey, collectedItems, unresolvedLinks);

    // Also rewrite links in extracted sections
    if (throwsSection) {
        throwsSection = rewriteInternalLinks(throwsSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (alertSection) {
        alertSection = rewriteInternalLinks(alertSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (deprecatedSection) {
        deprecatedSection = rewriteInternalLinks(deprecatedSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (infoSection) {
        infoSection = rewriteInternalLinks(infoSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (noteSection) {
        noteSection = rewriteInternalLinks(noteSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (tipSection) {
        tipSection = rewriteInternalLinks(tipSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (seeSection) {
        seeSection = rewriteInternalLinks(seeSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }
    if (internalSection) {
        internalSection = rewriteInternalLinks(internalSection, outputDir, moduleKey, collectedItems, unresolvedLinks);
    }

    // Rewrite links for merged types (and mark them as resolved in tracker)
    if (mergedTypes && mergedTypes.length > 0) {
        for (const typeName of mergedTypes) {
            // Replace [TypeName](.../TypeName.md) or [`TypeName`](.../TypeName.md) with [TypeName](#typename)
            // Case insensitive for filename matching but use typeName for label
            // The backticks are optional around the link text
            const regex = new RegExp(`\\[\`?${typeName}\`?\\]\\([^)]*${typeName}\\.md\\)`, "gi");
            content = content.replace(regex, `[${typeName}](#${typeName.toLowerCase()})`);
            // Mark this type as resolved in the tracker
            markLinkResolved(unresolvedLinks, typeName);
        }
    }

    // Load use cases from markdown file (new approach - directly from documentation folder)
    const useCasesContent = loadUseCasesContent(moduleKey, fnName);
    const useCases = useCasesContent ? parseUseCasesFromMarkdown(useCasesContent, moduleKey, fnName) : null;

    if (useCases) {
        collectedUseCases.push(useCases);
    }
    // Insert Hidden Gem section after description, before Type Parameters/Parameters
    if (useCases?.hiddenGemDescription) {
        content = insertHiddenGemSection(content, useCases);
    }

    // Insert admonitions after description in order: alert → deprecated → info → note → tip
    if (alertSection) {
        content = insertAdmonitionAfterDescription(content, alertSection);
    }
    if (deprecatedSection) {
        content = insertAdmonitionAfterDescription(content, deprecatedSection);
    }
    if (infoSection) {
        content = insertAdmonitionAfterDescription(content, infoSection);
    }
    if (noteSection) {
        content = insertAdmonitionAfterDescription(content, noteSection);
    }
    if (tipSection) {
        content = insertAdmonitionAfterDescription(content, tipSection);
    }

    // Reinsert all special sections after Returns (except admonitions which are already inserted)
    content = insertSpecialSections(content, {
        throwsSection,
        seeSection,
        internalSection,
        aliasesMap,
        moduleKey,
        fnName,
    });

    // Add "How it works?" section if exists (before use cases)
    const howItWorks = loadHowItWorks(moduleKey, fnName);
    if (howItWorks) {
        const responsiveHowItWorks = transformMermaidToResponsive(howItWorks);
        content += "\n\n## How it works?\n\n" + responsiveHowItWorks;
    }

    // Add use cases if available
    if (useCases) {
        content += generateUseCasesSection(useCases);
    }

    // Add merged content (e.g. Options interfaces)
    if (mergedContent) {
        // Rewrite links in merged content too
        let rewrittenMergedContent = rewriteInternalLinks(mergedContent, outputDir, moduleKey, collectedItems, unresolvedLinks);
        
        // Also rewrite links to merged types as internal anchors
        if (mergedTypes && mergedTypes.length > 0) {
            for (const typeName of mergedTypes) {
                // Replace [TypeName](.../TypeName.md) or [`TypeName`](.../TypeName.md) with [TypeName](#typename)
                // Case insensitive for filename matching but use typeName for label
                // The backticks are optional around the link text
                const regex = new RegExp(`\\[\`?${typeName}\`?\\]\\([^)]*${typeName}\\.md\\)`, "gi");
                rewrittenMergedContent = rewrittenMergedContent.replace(regex, `[${typeName}](#${typeName.toLowerCase()})`);
                // Mark this type as resolved in the tracker
                markLinkResolved(unresolvedLinks, typeName);
            }
        }
        
        content += rewrittenMergedContent;
    }

    // Add override if exists
    const override = loadOverride(moduleKey, fnName);
    if (override) {
        content += "\n\n---\n\n" + override;
    }

    // Add frontmatter for Docusaurus
    const isImportant = useCases?.isImportant ?? false;
    const isHiddenGem = useCases?.isHiddenGem ?? false;
    const frontmatter = `---
title: "${fnName}"
sidebar_label: "${fnName}"
type: ${itemType || "unknown"}
important: ${isImportant}
hiddenGem: ${isHiddenGem}
sidebar_custom_props:
  important: ${isImportant}
  hiddenGem: ${isHiddenGem}
---

`;

    content = frontmatter + content;

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Write file
    const outputPath = path.join(outputDir, `${fnName}.${DOC_EXTENSION}`);
    fs.writeFileSync(outputPath, content);

    // Log any unresolved links that weren't fixed by merged types handling
    logUnresolvedLinks(unresolvedLinks);
}

/**
 * Insert Hidden Gem section after description.
 */
function insertHiddenGemSection(content: string, useCases: FunctionUseCases): string {
    // Find the first technical section (Type Parameters, Parameters, or Returns)
    // This marks the end of the main description
    const firstSectionMatch = content.match(
        /\n(##+\s+(?:Type Parameters|Parameters|Returns):?[^\n]*\n)/
    );
    if (firstSectionMatch) {
        const insertPosition = firstSectionMatch.index!;
        const hiddenGemSection = generateHiddenGemSection(useCases);
        return (
            content.slice(0, insertPosition) +
            hiddenGemSection +
            content.slice(insertPosition)
        );
    } else {
        // If no technical sections found, insert before Use Cases or at the end
        const useCasesMatch = content.match(/\n## Use Cases/);
        if (useCasesMatch) {
            const insertPosition = useCasesMatch.index!;
            const hiddenGemSection = generateHiddenGemSection(useCases);
            return (
                content.slice(0, insertPosition) +
                hiddenGemSection +
                content.slice(insertPosition)
            );
        } else {
            // Insert at the end if no sections found
            return content + generateHiddenGemSection(useCases);
        }
    }
}

interface SpecialSectionsOptions {
    throwsSection: string | null;
    seeSection: string | null;
    internalSection: string | null;
    aliasesMap: Map<string, any>;
    moduleKey: string;
    fnName: string;
}

/**
 * Insert Deprecated section after the description, before Type Parameters/Parameters.
 */
/**
 * Insert an admonition (deprecated, info, note, etc.) after description, before Type Parameters/Parameters.
 */
function insertAdmonitionAfterDescription(content: string, admonitionSection: string): string {
    // Find the first technical section (Type Parameters, Parameters, or Returns)
    // This marks the end of the main description
    const firstSectionMatch = content.match(
        /\n(##+\s+(?:Type Parameters|Parameters|Returns):?[^\n]*\n)/
    );
    if (firstSectionMatch) {
        const insertPosition = firstSectionMatch.index!;
        return (
            content.slice(0, insertPosition) +
            admonitionSection +
            content.slice(insertPosition)
        );
    }
    // Fallback: append at the end if no technical sections found
    return content + admonitionSection;
}

/**
 * Insert special sections (Throws, See, Internal, Also Known As) in the right place.
 */
function insertSpecialSections(content: string, options: SpecialSectionsOptions): string {
    const { throwsSection, seeSection, internalSection, aliasesMap, moduleKey, fnName } = options;

    // Reinsert all special sections after Returns, in the correct order according to TSDoc rules:
    // 1. @returns
    // 2. @throws
    // 3. @see
    // Note: @deprecated is inserted after description, @defaultValue should be in Parameters section
    // Find the position after Returns section (after the type and any description)
    const returnsMatch = content.match(
        /(##+\s+Returns:?[^\n]*\n\n[^\n]*(?:\n[^\n]+)*?\n\n)/
    );
    if (returnsMatch) {
        const insertPosition = returnsMatch.index! + returnsMatch[0].length;
        let sectionsToInsert = "";

        // Add Throws section if it exists (comes first after Returns)
        if (throwsSection) {
            sectionsToInsert += throwsSection;
        }

        // Add See section if it exists (comes after Throws)
        if (seeSection) {
            sectionsToInsert += seeSection;
        }

        // Add Internal section if it exists (rare, but included for completeness)
        if (internalSection) {
            sectionsToInsert += internalSection;
        }

        if (sectionsToInsert) {
            content =
                content.slice(0, insertPosition) +
                sectionsToInsert +
                content.slice(insertPosition);
        }

        // Insert "Also known as" section after See, before Example
        content = insertAlsoKnownAsSection(content, aliasesMap, moduleKey, fnName, insertPosition + sectionsToInsert.length);
    } else {
        // If no Returns section, try to find where Parameters section ends
        const paramsMatch = content.match(
            /(##+\s+Parameters[^\n]*\n\n[\s\S]*?\n\n)(?=\n##|\n###|$)/
        );
        if (paramsMatch) {
            const insertPosition = paramsMatch.index! + paramsMatch[0].length;
            let sectionsToInsert = "";

            if (throwsSection) {
                sectionsToInsert += throwsSection;
            }

            if (seeSection) {
                sectionsToInsert += seeSection;
            }

            if (internalSection) {
                sectionsToInsert += internalSection;
            }

            if (sectionsToInsert) {
                content =
                    content.slice(0, insertPosition) +
                    sectionsToInsert +
                    content.slice(insertPosition);
            }

            // Insert "Also known as" section
            content = insertAlsoKnownAsSection(content, aliasesMap, moduleKey, fnName, insertPosition + sectionsToInsert.length);
        } else {
            // If no Returns or Parameters section, append before Use Cases
            let sectionsToInsert = "";

            if (throwsSection) {
                sectionsToInsert += throwsSection;
            }

            if (seeSection) {
                sectionsToInsert += seeSection;
            }

            if (internalSection) {
                sectionsToInsert += internalSection;
            }

            if (sectionsToInsert) {
                // Insert before Use Cases section if it exists
                const useCasesMatch = content.match(/\n## Use Cases/);
                if (useCasesMatch) {
                    content =
                        content.slice(0, useCasesMatch.index) +
                        sectionsToInsert +
                        content.slice(useCasesMatch.index);
                } else {
                    content += sectionsToInsert;
                }
            }

            // Insert "Also known as" section
            content = insertAlsoKnownAsSectionFallback(content, aliasesMap, moduleKey, fnName);
        }
    }

    return content;
}

/**
 * Insert "Also known as" section after special sections, before Example.
 */
function insertAlsoKnownAsSection(
    content: string,
    aliasesMap: Map<string, any>,
    moduleKey: string,
    fnName: string,
    fallbackPosition: number
): string {
    const moduleName = moduleKey.split("/").pop();
    const aliasKey = `${moduleName}/${fnName.toLowerCase()}`;
    const altAliasKey = `${moduleName}/${fnName}`;
    const aliasData = aliasesMap.get(aliasKey) || aliasesMap.get(altAliasKey);

    if (!aliasData) return content;

    const alsoKnownAsSection = generateAlsoKnownAsSection(aliasData);

    // Find Example section and insert before it
    const exampleMatch = content.match(/\n##+\s+Example/);
    if (exampleMatch) {
        const examplePosition = exampleMatch.index!;
        return (
            content.slice(0, examplePosition) +
            alsoKnownAsSection +
            content.slice(examplePosition)
        );
    } else {
        // If no Example section, insert after See section (or at the end of special sections)
        const seeMatch = content.match(/\n##+\s+See/);
        if (seeMatch) {
            // Find the end of See section
            const afterSeeMatch = content.match(
                /(\n##+\s+See[^\n]*\n\n[\s\S]*?\n\n)/
            );
            if (afterSeeMatch) {
                const afterSeePosition =
                    afterSeeMatch.index! + afterSeeMatch[0].length;
                return (
                    content.slice(0, afterSeePosition) +
                    alsoKnownAsSection +
                    content.slice(afterSeePosition)
                );
            }
        } else {
            // Insert at fallback position
            return (
                content.slice(0, fallbackPosition) +
                alsoKnownAsSection +
                content.slice(fallbackPosition)
            );
        }
    }

    return content;
}

/**
 * Insert "Also known as" section at the end (fallback).
 */
function insertAlsoKnownAsSectionFallback(
    content: string,
    aliasesMap: Map<string, any>,
    moduleKey: string,
    fnName: string
): string {
    const moduleName = moduleKey.split("/").pop();
    const aliasKey = `${moduleName}/${fnName.toLowerCase()}`;
    const altAliasKey = `${moduleName}/${fnName}`;
    const aliasData = aliasesMap.get(aliasKey) || aliasesMap.get(altAliasKey);

    if (!aliasData) return content;

    const alsoKnownAsSection = generateAlsoKnownAsSection(aliasData);

    const exampleMatch = content.match(/\n##+\s+Example/);
    if (exampleMatch) {
        const examplePosition = exampleMatch.index!;
        return (
            content.slice(0, examplePosition) +
            alsoKnownAsSection +
            content.slice(examplePosition)
        );
    } else {
        // Insert after See section if it exists
        const seeMatch = content.match(/\n##+\s+See/);
        if (seeMatch) {
            const afterSeeMatch = content.match(
                /(\n##+\s+See[^\n]*\n\n[\s\S]*?\n\n)/
            );
            if (afterSeeMatch) {
                const afterSeePosition =
                    afterSeeMatch.index! + afterSeeMatch[0].length;
                return (
                    content.slice(0, afterSeePosition) +
                    alsoKnownAsSection +
                    content.slice(afterSeePosition)
                );
            }
        } else {
            // Insert at the end of special sections
            const lastSectionMatch = content.match(/(\n##+\s+(?:Throws|Deprecated|See|Internal)[^\n]*\n\n[\s\S]*?\n\n)/);
            if (lastSectionMatch) {
                const lastSectionPosition =
                    lastSectionMatch.index! + lastSectionMatch[0].length;
                return (
                    content.slice(0, lastSectionPosition) +
                    alsoKnownAsSection +
                    content.slice(lastSectionPosition)
                );
            } else {
                return content + alsoKnownAsSection;
            }
        }
    }

    return content;
}
