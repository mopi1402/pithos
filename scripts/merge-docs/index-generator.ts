// scripts/merge-docs/index-generator.ts
// Index file generation

import * as fs from "node:fs";
import * as path from "node:path";
import { OUTPUT, DOC_EXTENSION, WEBSITE_I18N } from "../common/constants.js";

/** Short descriptions for API categories (used in module index accordions). */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    // Eidos - Creational Patterns
    "abstract-factory": "Create families of related objects without specifying concrete classes",
    builder: "Step-by-step construction of complex objects",
    "factory-method": "Delegate object creation to subclasses or functions",
    prototype: "Clone existing objects instead of creating new ones",
    singleton: "Ensure a single instance with global access",
    // Eidos - Structural Patterns
    adapter: "Adapt function signatures with input/output mappers",
    bridge: "Decouple abstraction from implementation",
    composite: "Tree structures with uniform leaf/branch handling",
    decorator: "Before/after/around hooks for functions",
    facade: "Simplified interface to a complex subsystem",
    flyweight: "Share common state between multiple objects",
    proxy: "Lazy init, caching, rate-limiting, access control",
    // Eidos - Behavioral Patterns
    chain: "Pipeline of handlers that can pass or handle requests",
    command: "Encapsulate actions with undo/redo support",
    interpreter: "Evaluate expressions or DSLs",
    iterator: "Traverse collections without exposing internals",
    mediator: "Centralize communication between components",
    memento: "Capture and restore object state (snapshots)",
    observer: "Pub/sub event emitter with safe notification",
    state: "Object behavior changes based on internal state",
    strategy: "Swap algorithms at runtime",
    template: "Define skeleton algorithm, let subclasses fill steps",
    visitor: "Add operations to objects without modifying them",
    // Arkhe categories
    array: "Manipulate, filter, sort, and transform arrays",
    async: "Concurrency, retries, queues, and async control flow",
    function: "Composition, memoization, debounce, throttle, and more",
    is: "Type guards and runtime type checks",
    number: "Clamp, parse, and convert numeric values",
    object: "Deep clone, merge, pick, omit, and path access",
    string: "Case conversion, escaping, templating, and text utilities",
    test: "Test helpers, mocks, and assertion utilities",
    types: "TypeScript type aliases and utility types",
    util: "General-purpose helpers (range, sleep, uniqueId…)",
    // Kanon/Zygos categories
    schemas: "Schema definitions for validation",
    result: "Result and Ok/Err types for error handling",
    either: "Either type for dual-path computation",
    option: "Option type for nullable value handling",
    task: "Lazy async computation with error handling",
    errors: "Typed error factories and error codes",
    // Taphos categories
    collection: "Legacy collection utilities (Lodash compat)",
    lang: "Legacy language utilities (Lodash compat)",
};

// ── i18n ─────────────────────────────────────────────────────────────

/** Supported locales for index generation. */
const I18N_LOCALES = ["fr"] as const;

/** Locale-specific strings for generated index pages. */
const I18N_STRINGS: Record<string, {
    categoryDescriptions: Record<string, string>;
    eidosCategoryHeadings: Record<string, string>;
    actionLabels: { explanations: string; liveDemo: string };
    moduleDescriptions: Record<string, string>;
}> = {
    fr: {
        categoryDescriptions: {
            // Eidos - Creational
            "abstract-factory": "Créer des familles d'objets liés sans spécifier les classes concrètes",
            builder: "Construction étape par étape d'objets complexes",
            "factory-method": "Déléguer la création d'objets à des sous-classes ou fonctions",
            prototype: "Cloner des objets existants au lieu d'en créer de nouveaux",
            singleton: "Garantir une instance unique avec accès global",
            // Eidos - Structural
            adapter: "Adapter les signatures de fonctions avec des mappers d'entrée/sortie",
            bridge: "Découpler l'abstraction de l'implémentation",
            composite: "Structures arborescentes avec traitement uniforme feuille/branche",
            decorator: "Hooks before/after/around pour les fonctions",
            facade: "Interface simplifiée vers un sous-système complexe",
            flyweight: "Partager l'état commun entre plusieurs objets",
            proxy: "Init lazy, cache, rate-limiting, contrôle d'accès",
            // Eidos - Behavioral
            chain: "Pipeline de handlers qui peuvent passer ou traiter les requêtes",
            command: "Encapsuler des actions avec support undo/redo",
            interpreter: "Évaluer des expressions ou des DSL",
            iterator: "Parcourir des collections sans exposer les détails internes",
            mediator: "Centraliser la communication entre composants",
            memento: "Capturer et restaurer l'état d'un objet (snapshots)",
            observer: "Émetteur d'événements pub/sub avec notification sûre",
            state: "Le comportement de l'objet change selon son état interne",
            strategy: "Interchanger des algorithmes à l'exécution",
            template: "Définir le squelette d'un algorithme, laisser les sous-classes remplir les étapes",
            visitor: "Ajouter des opérations aux objets sans les modifier",
            // Arkhe
            array: "Manipuler, filtrer, trier et transformer des tableaux",
            async: "Concurrence, retries, files d'attente et contrôle de flux asynchrone",
            function: "Composition, memoization, debounce, throttle et plus",
            is: "Type guards et vérifications de types à l'exécution",
            number: "Clamp, parse et conversion de valeurs numériques",
            object: "Deep clone, merge, pick, omit et accès par chemin",
            string: "Conversion de casse, échappement, templating et utilitaires texte",
            test: "Helpers de test, mocks et utilitaires d'assertion",
            types: "Alias de types TypeScript et types utilitaires",
            util: "Helpers généraux (range, sleep, uniqueId…)",
            // Kanon/Zygos
            schemas: "Définitions de schémas pour la validation",
            result: "Types Result et Ok/Err pour la gestion d'erreurs",
            either: "Type Either pour le calcul à double chemin",
            option: "Type Option pour la gestion des valeurs nullables",
            task: "Calcul asynchrone lazy avec gestion d'erreurs",
            errors: "Factories d'erreurs typées et codes d'erreur",
            // Taphos
            collection: "Utilitaires de collection legacy (compat Lodash)",
            lang: "Utilitaires de langage legacy (compat Lodash)",
        },
        eidosCategoryHeadings: {
            "Creational Patterns": "Patterns de Création",
            "Structural Patterns": "Patterns Structurels",
            "Behavioral Patterns": "Patterns Comportementaux",
        },
        actionLabels: {
            explanations: "Explications",
            liveDemo: "Démo interactive",
        },
        moduleDescriptions: {
            arkhe: "Référence API d'Arkhe, le module utilitaire principal de Pithos. Tableaux, objets, chaînes, fonctions et plus.",
            eidos: "Référence API d'Eidos, le module de design patterns fonctionnels de Pithos (adapter, chain, command, decorator, observer, proxy, strategy).",
            kanon: "Référence API de Kanon, le module de validation de schémas de Pithos avec compilation JIT.",
            sphalma: "Référence API de Sphalma, le module de factories d'erreurs typées de Pithos.",
            taphos: "Référence API de Taphos, le module de compatibilité legacy de Pithos pour la migration Lodash et Ramda.",
            zygos: "Référence API de Zygos, le module de types Result/Either/Option de Pithos pour la gestion d'erreurs typée.",
            bridges: "Référence API des fonctions bridge connectant les modules Pithos (ensure, ensureAsync).",
        },
    },
};

/** Default badge label format. */
function getBadgeLabel(moduleName: string, categoryName: string, count: number): string {
    // Just show the count, no label
    return `${count}`;
}

/**
 * Generate the root API index file.
 */
export function generateRootIndex() {
    const modules = [
        { name: "Arkhe", logo: "/img/emoji/letter-a.webp", desc: "Core utilities (arrays, objects, strings, functions)", link: "/api/arkhe/" },
        { name: "Eidos", logo: "/img/emoji/letter-e.webp", desc: "Functional design patterns (adapter, proxy, observer, strategy, ...)", link: "/api/eidos/" },
        { name: "Kanon", logo: "/img/emoji/letter-k.webp", desc: "Schema validation with JIT compilation", link: "/api/kanon/" },
        { name: "Sphalma", logo: "/img/emoji/letter-s.webp", desc: "Typed error factories with error codes", link: "/api/sphalma/" },
        { name: "Taphos", logo: "/img/emoji/letter-t.webp", desc: "Legacy utilities (Lodash/Ramda compatibility)", link: "/api/taphos/" },
        { name: "Zygos", logo: "/img/emoji/letter-z.webp", desc: "Result/Either types for error handling", link: "/api/zygos/" },
        { name: "Bridges", logo: "/img/emoji/node.webp", desc: "Bridge functions between modules (ensure, ensureAsync)", link: "/api/bridges/" },
    ];

    const cards = modules.map(m => `  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <a className="card padding--md basics-card" href="${m.link}">
      <img src="${m.logo}" alt="${m.name}" width="64" height="64" style={{flexShrink: 0}} />
      <div className="basics-card__text">
        <strong>${m.name}</strong>
        <span>${m.desc}</span>
      </div>
    </a>
  </div>`).join("\n");

    const rootIndex = `---
title: API Reference
sidebar_label: Overview
sidebar_position: 0
slug: /
---

# 📔 API Reference

Explore the API documentation for each Pithos module.

<div className="row" style={{marginTop: '1.5rem'}}>
${cards}
</div>
`;

    fs.writeFileSync(path.join(OUTPUT, `index.${DOC_EXTENSION}`), rootIndex);
}

/** Sidebar positions for API modules. Bridges goes last. */
const MODULE_POSITIONS: Record<string, number> = {
    arkhe: 1,
    eidos: 2,
    kanon: 3,
    sphalma: 4,
    taphos: 5,
    zygos: 6,
    bridges: 99,
};

/**
 * Label mapping for eidos patterns.
 * Maps folder names to properly formatted GoF pattern names for sidebar display.
 */
const EIDOS_LABEL_MAP: Record<string, string> = {
    "abstract-factory": "Abstract Factory",
    "adapter": "Adapter",
    "bridge": "Bridge",
    "builder": "Builder",
    "chain": "Chain of Responsibility",
    "command": "Command",
    "composite": "Composite",
    "decorator": "Decorator",
    "facade": "Facade",
    "factory-method": "Factory Method",
    "flyweight": "Flyweight",
    "interpreter": "Interpreter",
    "iterator": "Iterator",
    "mediator": "Mediator",
    "memento": "Memento",
    "observer": "Observer",
    "prototype": "Prototype",
    "proxy": "Proxy",
    "singleton": "Singleton",
    "state": "State",
    "strategy": "Strategy",
    "template": "Template Method",
    "visitor": "Visitor",
};

/**
 * GoF pattern categories for Eidos module.
 */
const EIDOS_CATEGORIES: Record<string, string[]> = {
    "Creational Patterns": [
        "abstract-factory",
        "builder",
        "factory-method",
        "prototype",
        "singleton",
    ],
    "Structural Patterns": [
        "adapter",
        "bridge",
        "composite",
        "decorator",
        "facade",
        "flyweight",
        "proxy",
    ],
    "Behavioral Patterns": [
        "chain",
        "command",
        "interpreter",
        "iterator",
        "mediator",
        "memento",
        "observer",
        "state",
        "strategy",
        "template",
        "visitor",
    ],
};

/**
 * Top picks - most commonly used patterns in real-world applications.
 */
const EIDOS_TOP_PICKS = new Set([
    "strategy",
    "observer", 
    "builder",
    "decorator",
    "chain",
    "state",
    "command",
]);

/**
 * Hidden gems - underrated patterns worth discovering.
 */
const EIDOS_HIDDEN_GEMS = new Set([
    "composite",
    "memento",
    "mediator",
    "iterator",
    "abstract-factory",
    "template",
    "adapter",
]);

/**
 * Recursively generate _category_.json files with unique translation keys
 * for all subdirectories under a given directory.
 * The key is built from the relative path segments joined by dashes
 * (e.g. "kanon-jit-builders-composites") to guarantee uniqueness.
 */
function generateCategoryFiles(dirPath: string, keyPrefix: string) {
    const subDirs = fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    for (const subDir of subDirs) {
        const subDirPath = path.join(dirPath, subDir);
        const key = `${keyPrefix}-${subDir}`;

        // Use mapped label for eidos patterns, otherwise use folder name
        const isEidosPattern = keyPrefix === "eidos";
        const label = isEidosPattern && EIDOS_LABEL_MAP[subDir] 
            ? EIDOS_LABEL_MAP[subDir] 
            : subDir;

        // Add customProps for top picks and hidden gems (sidebar filter)
        const isTopPick = isEidosPattern && EIDOS_TOP_PICKS.has(subDir);
        const isHiddenGem = isEidosPattern && EIDOS_HIDDEN_GEMS.has(subDir);
        const categoryMeta: Record<string, unknown> = {
            label,
            key,
        };
        if (isTopPick || isHiddenGem) {
            categoryMeta.customProps = {
                ...(isTopPick && { important: true }),
                ...(isHiddenGem && { hiddenGem: true }),
            };
        }
        
        fs.writeFileSync(
            path.join(subDirPath, "_category_.json"),
            JSON.stringify(categoryMeta, null, 2) + "\n"
        );

        // Recurse into deeper directories
        generateCategoryFiles(subDirPath, key);
    }
}


// ── Shared helpers ───────────────────────────────────────────────────

/** Patterns that have a live demo. */
const PATTERNS_WITH_DEMO = new Set([
    "abstract-factory", "adapter", "bridge", "builder", "chain",
    "command", "composite", "decorator", "facade", "factory-method",
    "flyweight", "interpreter", "iterator", "mediator", "memento",
    "observer", "prototype", "proxy", "singleton", "state",
    "strategy", "template", "visitor",
]);

const MODULE_DESCRIPTIONS_EN: Record<string, string> = {
    arkhe: "API reference for Arkhe, the core utility module of Pithos. Arrays, objects, strings, functions, and more.",
    eidos: "API reference for Eidos, the functional design patterns module of Pithos (adapter, chain, command, decorator, observer, proxy, strategy).",
    kanon: "API reference for Kanon, the schema validation module of Pithos with JIT compilation.",
    sphalma: "API reference for Sphalma, the typed error factory module of Pithos.",
    taphos: "API reference for Taphos, the legacy compatibility module of Pithos for Lodash and Ramda migration.",
    zygos: "API reference for Zygos, the Result/Either/Option types module of Pithos for typed error handling.",
    bridges: "API reference for bridge functions connecting Pithos modules (ensure, ensureAsync).",
};

const MODULE_LOGOS: Record<string, string> = {
    arkhe: "/img/emoji/letter-a.webp",
    kanon: "/img/emoji/letter-k.webp",
    zygos: "/img/emoji/letter-z.webp",
    sphalma: "/img/emoji/letter-s.webp",
    taphos: "/img/emoji/letter-t.webp",
    bridges: "/img/emoji/node.webp",
    eidos: "/img/emoji/letter-e.webp",
};

// ── File counting / link collection ──────────────────────────────────

function countMdFiles(dir: string): number {
    let count = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            count += countMdFiles(path.join(dir, entry.name));
        } else if (entry.name.endsWith(`.${DOC_EXTENSION}`)) {
            count++;
        }
    }
    return count;
}

function collectMdLinks(dir: string, modulePath: string, moduleName: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            results.push(...collectMdLinks(path.join(dir, entry.name), modulePath, moduleName));
        } else if (entry.name.endsWith(`.${DOC_EXTENSION}`)) {
            const name = path.basename(entry.name, `.${DOC_EXTENSION}`);
            const relDir = path.relative(modulePath, dir);
            const link = name.toLowerCase() === path.basename(dir).toLowerCase()
                ? `/api/${moduleName}/${relDir}`
                : `/api/${moduleName}/${relDir}/${name}`;
            results.push(`- [${name}](${link})`);
        }
    }
    return results;
}

// ── Accordion generation ─────────────────────────────────────────────

interface LocaleStrings {
    descriptions: Record<string, string>;
    eidosHeadings: Record<string, string>;
    actions: { explanations: string; liveDemo: string };
    moduleDescriptions: Record<string, string>;
}

const EN_STRINGS: LocaleStrings = {
    descriptions: CATEGORY_DESCRIPTIONS,
    eidosHeadings: {
        "Creational Patterns": "Creational Patterns",
        "Structural Patterns": "Structural Patterns",
        "Behavioral Patterns": "Behavioral Patterns",
    },
    actions: { explanations: "Explanations", liveDemo: "Live Demo" },
    moduleDescriptions: MODULE_DESCRIPTIONS_EN,
};

function getLocaleStrings(locale?: string): LocaleStrings {
    if (!locale) return EN_STRINGS;
    const l = I18N_STRINGS[locale];
    if (!l) return EN_STRINGS;
    return {
        descriptions: l.categoryDescriptions,
        eidosHeadings: l.eidosCategoryHeadings,
        actions: l.actionLabels,
        moduleDescriptions: l.moduleDescriptions,
    };
}

function generateEidosAccordions(
    modulePath: string,
    logo: string,
    subModules: string[],
    moduleName: string,
    strings: LocaleStrings,
): string {
    const sections: string[] = [];

    for (const [categoryName, patterns] of Object.entries(EIDOS_CATEGORIES)) {
        const heading = strings.eidosHeadings[categoryName] ?? categoryName;
        const categoryAccordions = patterns
            .filter(pattern => subModules.includes(pattern))
            .map((pattern) => {
                const patternPath = path.join(modulePath, pattern);
                if (!fs.existsSync(patternPath)) return "";

                const fileCount = countMdFiles(patternPath);
                if (fileCount === 0) return "";

                const links = collectMdLinks(patternPath, modulePath, moduleName);
                const desc = strings.descriptions[pattern] ?? CATEGORY_DESCRIPTIONS[pattern] ?? "";
                const descProp = desc ? ` description="${desc}"` : "";
                const badgeLabel = getBadgeLabel("eidos", pattern, fileCount);
                const displayTitle = EIDOS_LABEL_MAP[pattern] ?? pattern;
                const isTopPick = EIDOS_TOP_PICKS.has(pattern);
                const isHiddenGem = EIDOS_HIDDEN_GEMS.has(pattern);
                const suffix = isTopPick ? "👑" : isHiddenGem ? "💎" : "";
                const suffixProp = suffix ? ` titleSuffix="${suffix}"` : "";

                const patternUrl = `/api/eidos/${pattern}/`;
                const actions = [
                    { label: strings.actions.explanations, href: patternUrl },
                ];
                if (PATTERNS_WITH_DEMO.has(pattern)) {
                    actions.push({ label: strings.actions.liveDemo, href: `${patternUrl}#live-demo` });
                }
                const actionsProp = ` actions={${JSON.stringify(actions)}}`;

                return `<Accordion title="${displayTitle}" icon="${logo}" badge="${badgeLabel}"${descProp}${suffixProp}${actionsProp} variant="card">

${links.join("\n")}

</Accordion>`;
            })
            .filter(Boolean)
            .join("\n\n");

        if (categoryAccordions) {
            sections.push(`## ${heading}\n\n${categoryAccordions}`);
        }
    }

    return sections.join("\n\n");
}

function generateModuleAccordions(
    modulePath: string,
    moduleName: string,
    logo: string,
    subModules: string[],
    strings: LocaleStrings,
): string {
    return subModules
        .map((subModule) => {
            const subModulePath = path.join(modulePath, subModule);
            const fileCount = countMdFiles(subModulePath);
            if (fileCount === 0) return "";

            const links = collectMdLinks(subModulePath, modulePath, moduleName);
            const desc = strings.descriptions[subModule] ?? CATEGORY_DESCRIPTIONS[subModule] ?? "";
            const descProp = desc ? ` description="${desc}"` : "";
            const badgeLabel = getBadgeLabel(moduleName, subModule, fileCount);

            return `<Accordion title="${subModule}" icon="${logo}" badge="${badgeLabel}"${descProp} variant="card">

${links.join("\n")}

</Accordion>`;
        })
        .filter(Boolean)
        .join("\n\n");
}

// ── Module index content generation ──────────────────────────────────

function generateModuleIndexContent(
    modulePath: string,
    moduleName: string,
    strings: LocaleStrings,
): string {
    const logo = MODULE_LOGOS[moduleName] ?? MODULE_LOGOS.arkhe;
    const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

    const subModules = fs
        .readdirSync(modulePath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    const accordions = moduleName === "eidos"
        ? generateEidosAccordions(modulePath, logo, subModules, moduleName, strings)
        : generateModuleAccordions(modulePath, moduleName, logo, subModules, strings);

    const desc = strings.moduleDescriptions[moduleName]
        ?? MODULE_DESCRIPTIONS_EN[moduleName]
        ?? `API reference for ${displayName} in Pithos.`;

    return `---
title: ${displayName}
description: "${desc}"
---

import { Accordion } from "@site/src/components/shared/Accordion";

# ${displayName}

${accordions}
`;
}

// ── Main entry point ─────────────────────────────────────────────────

/**
 * Generate index files for each module.
 * Also generates _category_.json files with unique translation keys
 * to avoid Docusaurus i18n sidebar key collisions when multiple modules
 * share the same category names (e.g. arkhe/array and taphos/array).
 *
 * Generates both English (in OUTPUT) and localized versions (in WEBSITE_I18N).
 */
export function generateIndexFiles() {
    generateRootIndex();

    const modules = fs
        .readdirSync(OUTPUT, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    // ── English (default) ────────────────────────────────────────────
    for (const moduleName of modules) {
        const modulePath = path.join(OUTPUT, moduleName);
        const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        // Write module-level _category_.json
        const moduleCategoryMeta: Record<string, unknown> = {
            label: displayName,
            position: MODULE_POSITIONS[moduleName] ?? 50,
        };
        if (moduleName === "bridges") {
            moduleCategoryMeta.className = "sidebar-bridges";
        }
        fs.writeFileSync(
            path.join(modulePath, "_category_.json"),
            JSON.stringify(moduleCategoryMeta, null, 2) + "\n"
        );

        generateCategoryFiles(modulePath, moduleName);

        const content = generateModuleIndexContent(modulePath, moduleName, EN_STRINGS);

        // Remove old index.md if it exists (replaced by index.mdx)
        const oldIndexPath = path.join(modulePath, `index.${DOC_EXTENSION}`);
        if (fs.existsSync(oldIndexPath)) {
            fs.unlinkSync(oldIndexPath);
        }

        fs.writeFileSync(path.join(modulePath, "index.mdx"), content);
    }

    // ── Localized versions ───────────────────────────────────────────
    for (const locale of I18N_LOCALES) {
        const strings = getLocaleStrings(locale);
        const localeBase = path.join(
            WEBSITE_I18N, locale,
            "docusaurus-plugin-content-docs-api", "current",
        );

        for (const moduleName of modules) {
            const modulePath = path.join(OUTPUT, moduleName);
            const localeModulePath = path.join(localeBase, moduleName);

            // Only generate if the locale directory already exists
            // (pattern pages or other i18n content was copied there)
            if (!fs.existsSync(localeModulePath)) {
                // For eidos, always generate (it has pattern pages)
                if (moduleName !== "eidos") continue;
                fs.mkdirSync(localeModulePath, { recursive: true });
            }

            const content = generateModuleIndexContent(modulePath, moduleName, strings);
            fs.writeFileSync(path.join(localeModulePath, "index.mdx"), content);
            console.log(`    [${locale}] ${moduleName}/index.mdx`);
        }
    }
}
