import React from "react";
import { translate } from "@docusaurus/Translate";
import { ModuleConfig, BenchmarkReport } from "@site/src/components/comparisons/BenchmarkTable";
import functionWeights from "@site/src/data/comparisons/function-weights.json";

let benchmarkData: BenchmarkReport | null = null;
try { benchmarkData = require("@site/src/data/benchmarks/arkhe-benchmark.json"); } catch { benchmarkData = null; }

export type ArkheCategory = "array" | "function" | "is" | "number" | "object" | "string" | "util";

export const arkheConfig: ModuleConfig<ArkheCategory> = {
  name: "arkhe",
  primaryLibrary: "arkhe",
  benchmarkData,
  weights: functionWeights.modules.arkhe as any,
  categoryLabels: {
    array: translate({ id: 'comparison.arkhe.category.array', message: 'Array' }),
    function: translate({ id: 'comparison.arkhe.category.function', message: 'Function' }),
    is: translate({ id: 'comparison.arkhe.category.is', message: 'Is' }),
    number: translate({ id: 'comparison.arkhe.category.number', message: 'Number' }),
    object: translate({ id: 'comparison.arkhe.category.object', message: 'Object' }),
    string: translate({ id: 'comparison.arkhe.category.string', message: 'String' }),
    util: translate({ id: 'comparison.arkhe.category.util', message: 'Util' }),
  },
  functionToCategory: {
    chunk: "array", countBy: "array", difference: "array", differenceBy: "array", differenceWith: "array", drop: "array", dropRight: "array", dropRightWhile: "array", dropWhile: "array", fill: "array", findBest: "array", findLast: "array", findLastIndex: "array", groupBy: "array", groupWith: "array", intersection: "array", intersectionBy: "array", intersectionWith: "array", keyBy: "array", maxBy: "array", minBy: "array", orderBy: "array", partition: "array", reverse: "array", sample: "array", sampleSize: "array", shuffle: "array", take: "array", takeRight: "array", takeRightWhile: "array", takeWhile: "array", toArray: "array", toggle: "array", union: "array", unionBy: "array", unionWith: "array", uniq: "array", uniqBy: "array", uniqWith: "array", unzip: "array", window: "array", xor: "array", zip: "array", zipWith: "array",
    after: "function", before: "function", curry: "function", debounce: "function", flip: "function", flowRight: "function", memoize: "function", negate: "function", noop: "function", once: "function", pipe: "function", throttle: "function", unless: "function", when: "function",
    isArray: "is", isArrayBuffer: "is", isBoolean: "is", isDate: "is", isEqual: "is", isError: "is", isFunction: "is", isMap: "is", isNil: "is", isNull: "is", isNumber: "is", isObject: "is", isPlainObject: "is", isRegExp: "is", isSet: "is", isString: "is", isSymbol: "is", isUndefined: "is",
    clamp: "number", inRange: "number", random: "number", toNumber: "number",
    deepClone: "object", deepCloneFull: "object", defaults: "object", defaultsDeep: "object", evolve: "object", findKey: "object", get: "object", has: "object", invert: "object", mapKeys: "object", mapValues: "object", mergeDeep: "object", mergeWith: "object", omit: "object", omitBy: "object", pick: "object", pickBy: "object", set: "object",
    camelCase: "string", capitalize: "string", constantCase: "string", deburr: "string", escape: "string", escapeRegExp: "string", kebabCase: "string", lowerFirst: "string", pascalCase: "string", sentenceCase: "string", snakeCase: "string", template: "string", titleCase: "string", truncate: "string", unescape: "string", words: "string",
    defaultTo: "util", range: "util", sleep: "util", times: "util", uniqueId: "util",
  },
  categoryOrder: ["array", "function", "is", "number", "object", "string", "util"],
  libraryDescriptions: {
    arkhe: translate({ id: 'comparison.arkhe.lib.arkhe', message: 'This module' }),
    "es-toolkit": translate({ id: 'comparison.arkhe.lib.esToolkit', message: 'Modern utility library' }),
    "es-toolkit/compat": translate({ id: 'comparison.arkhe.lib.esToolkitCompat', message: 'es-toolkit with lodash compat' }),
    "lodash-es": translate({ id: 'comparison.arkhe.lib.lodashEs', message: 'ES modules lodash' }),
  },
  excludedLibraries: ["lodash"],
  tldrContent: (data: BenchmarkReport) => {
    const winRate = Math.round((data.summary.libraryRankings.find(r => r.library === "arkhe")?.wins || 0) / data.summary.totalScenarios * 100);
    const text = translate(
      { id: 'comparison.arkhe.tldr', message: 'Arkhe wins ~{winRate}% of benchmarks. Fastest for typical use cases (small to medium arrays). Lodash can be faster on very large arrays (10K+ items) thanks to internal hash-based caching.' },
      { winRate: String(winRate) }
    );
    const firstDot = text.indexOf('.');
    return <><strong>{text.slice(0, firstDot + 1)}</strong> {text.slice(firstDot + 2)}</>;
  },
  generateCommand: "pnpm doc:generate:arkhe:benchmarks-results",
};
