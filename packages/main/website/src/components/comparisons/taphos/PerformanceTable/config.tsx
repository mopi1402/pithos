import React from "react";
import { translate } from "@docusaurus/Translate";
import { ModuleConfig, BenchmarkReport } from "@site/src/components/comparisons/BenchmarkTable";
import functionWeights from "@site/src/data/comparisons/function-weights.json";

let benchmarkData: BenchmarkReport | null = null;
try { benchmarkData = require("@site/src/data/benchmarks/taphos-benchmark.json"); } catch { benchmarkData = null; }

export type TaphosCategory = "array" | "collection" | "function" | "lang" | "math" | "object" | "string" | "util";

const nanWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.nanWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.nanWarning.cannotFind', message: 'NaN values cannot be found with native.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.nanWarning.sameValueZero', message: 'taphos/lodash use SameValueZero → can find NaN' })}</li>
      <li>{translate({ id: 'comparison.taphos.nanWarning.nativeStrict', message: 'native uses === → NaN !== NaN returns -1' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.nanWarning.safeToMigrate', message: 'Safe to migrate if you don\'t search for NaN values.' })}</strong></p>
  </>
);

const eqWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.eqWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.eqWarning.negativeZero', message: 'Different handling of -0.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.eqWarning.sameValueZero', message: 'taphos/lodash use SameValueZero → eq(0, -0) returns true' })}</li>
      <li>{translate({ id: 'comparison.taphos.eqWarning.objectIs', message: 'native uses Object.is → Object.is(0, -0) returns false' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.eqWarning.safeToMigrate', message: 'Safe to migrate if you don\'t compare -0 values.' })}</strong></p>
  </>
);

const cloneDeepWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.cloneDeepWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.cloneDeepWarning.limitations', message: 'structuredClone has limitations.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.cloneDeepWarning.noFunctions', message: 'structuredClone cannot clone functions or DOM elements' })}</li>
      <li>{translate({ id: 'comparison.taphos.cloneDeepWarning.noPrototype', message: 'structuredClone does not preserve prototype chains or symbol keys' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.cloneDeepWarning.safeToMigrate', message: 'Safe to migrate for plain data objects (no functions, no symbols).' })}</strong></p>
  </>
);

const isNaNWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.isNaNWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.isNaNWarning.numberObjects', message: 'Different handling of Number objects.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.isNaNWarning.lodash', message: 'taphos/lodash → isNaN(new Number(NaN)) returns true' })}</li>
      <li>{translate({ id: 'comparison.taphos.isNaNWarning.native', message: 'native → Number.isNaN(new Number(NaN)) returns false' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.isNaNWarning.safeToMigrate', message: 'Safe to migrate if you don\'t use Number object wrappers.' })}</strong></p>
  </>
);

const pullWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.pullWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.pullWarning.mutation', message: 'Different mutation behavior.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.pullWarning.mutates', message: 'taphos/lodash mutate the original array in place' })}</li>
      <li>{translate({ id: 'comparison.taphos.pullWarning.immutable', message: 'native uses filter() → returns a new array' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.pullWarning.safeToMigrate', message: 'Safe to migrate if your code doesn\'t rely on mutation.' })}</strong></p>
  </>
);

const forInWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.forInWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.forInWarning.earlyReturn', message: 'Different early exit behavior.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.forInWarning.lodash', message: 'taphos/lodash → returning false stops iteration' })}</li>
      <li>{translate({ id: 'comparison.taphos.forInWarning.native', message: 'native for...in → cannot be stopped from a callback' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.forInWarning.safeToMigrate', message: 'Safe to migrate if you don\'t use early return.' })}</strong></p>
  </>
);

const isTypedArrayWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.isTypedArrayWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.isTypedArrayWarning.dataView', message: 'ArrayBuffer.isView also matches DataView.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.isTypedArrayWarning.lodash', message: 'taphos/lodash → isTypedArray(new DataView(...)) returns false' })}</li>
      <li>{translate({ id: 'comparison.taphos.isTypedArrayWarning.native', message: 'native → ArrayBuffer.isView(new DataView(...)) returns true' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.isTypedArrayWarning.safeToMigrate', message: 'Safe to migrate if you don\'t use DataView.' })}</strong></p>
  </>
);

const isElementWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.isElementWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.isElementWarning.detection', message: 'Different detection method.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.isElementWarning.lodash', message: 'taphos/lodash use duck typing (nodeType === 1)' })}</li>
      <li>{translate({ id: 'comparison.taphos.isElementWarning.native', message: 'native uses instanceof Element' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.isElementWarning.safeToMigrate', message: 'Safe to migrate in same-realm browser contexts.' })}</strong></p>
  </>
);

const toIntegerWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.toIntegerWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.toIntegerWarning.infinity', message: 'Different handling of Infinity.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.toIntegerWarning.lodash', message: 'taphos/lodash → toInteger(Infinity) returns MAX_VALUE' })}</li>
      <li>{translate({ id: 'comparison.taphos.toIntegerWarning.native', message: 'native → Math.trunc(Infinity) returns Infinity' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.toIntegerWarning.safeToMigrate', message: 'Safe to migrate if you don\'t pass Infinity.' })}</strong></p>
  </>
);

const precisionWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.precisionWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.precisionWarning.floatingPoint', message: 'Floating point precision issues with native.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.precisionWarning.taphos', message: 'taphos uses exponential notation → round(1.005, 2) returns 1.01' })}</li>
      <li>{translate({ id: 'comparison.taphos.precisionWarning.native', message: 'native Math.round(1.005 * 100) / 100 returns 1 (float error)' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.precisionWarning.safeToMigrate', message: 'Safe to migrate if you don\'t use precision parameter.' })}</strong></p>
  </>
);

const toSafeIntegerWarning = (
  <>
    <p><strong>{translate({ id: 'comparison.taphos.toSafeIntegerWarning.difference', message: 'Difference:' })}</strong> {translate({ id: 'comparison.taphos.toSafeIntegerWarning.nan', message: 'Different handling of NaN.' })}</p>
    <ul>
      <li>{translate({ id: 'comparison.taphos.toSafeIntegerWarning.lodash', message: 'taphos/lodash → toSafeInteger(NaN) returns 0' })}</li>
      <li>{translate({ id: 'comparison.taphos.toSafeIntegerWarning.native', message: 'native → clamped Math.trunc(NaN) returns NaN' })}</li>
    </ul>
    <p><strong>{translate({ id: 'comparison.taphos.toSafeIntegerWarning.safeToMigrate', message: 'Safe to migrate if input is always a valid number.' })}</strong></p>
  </>
);

export const taphosConfig: ModuleConfig<TaphosCategory> = {
  name: "taphos",
  primaryLibrary: "taphos",
  benchmarkData,
  weights: functionWeights.modules.taphos as any,
  categoryLabels: {
    array: translate({ id: 'comparison.taphos.category.array', message: 'Array' }),
    collection: translate({ id: 'comparison.taphos.category.collection', message: 'Collection' }),
    function: translate({ id: 'comparison.taphos.category.function', message: 'Function' }),
    lang: translate({ id: 'comparison.taphos.category.lang', message: 'Lang' }),
    math: translate({ id: 'comparison.taphos.category.math', message: 'Math' }),
    object: translate({ id: 'comparison.taphos.category.object', message: 'Object' }),
    string: translate({ id: 'comparison.taphos.category.string', message: 'String' }),
    util: translate({ id: 'comparison.taphos.category.util', message: 'Util' }),
  },
  functionToCategory: {
    at: "array", compact: "array", concat: "array", find: "array", findIndex: "array", first: "array", flatten: "array", flattenDeep: "array", flattenDepth: "array", fromPairs: "array", head: "array", indexOf: "array", initial: "array", join: "array", last: "array", lastIndexOf: "array", nth: "array", pull: "array", pullAll: "array", pullAllBy: "array", pullAllWith: "array", pullAt: "array", remove: "array", slice: "array", tail: "array", without: "array", zipObject: "array",
    each: "collection", eachRight: "collection", every: "collection", filter: "collection", flatMap: "collection", flatMapDeep: "collection", flatMapDepth: "collection", includes: "collection", map: "collection", pluck: "collection", reduce: "collection", reduceRight: "collection", reject: "collection", size: "collection", some: "collection", sortBy: "collection", uniq: "collection",
    bind: "function", defer: "function", delay: "function", partial: "function", rest: "function", spread: "function", unary: "function", wrap: "function",
    eq: "lang", gt: "lang", gte: "lang", lt: "lang", lte: "lang", isBuffer: "lang", isElement: "lang", isFinite: "lang", isInteger: "lang", isNaN: "lang", isSafeInteger: "lang", isTypedArray: "lang", isWeakMap: "lang", isWeakSet: "lang", toFinite: "lang", toInteger: "lang", toNumber: "lang", toSafeInteger: "lang", "toString": "lang",
    add: "math", ceil: "math", divide: "math", floor: "math", max: "math", min: "math", multiply: "math", round: "math", subtract: "math",
    assign: "object", create: "object", extend: "object", forIn: "object", forOwn: "object", hasIn: "object", invoke: "object", keys: "object", toPairs: "object", transform: "object", unset: "object", update: "object", values: "object",
    endsWith: "string", lowerCase: "string", pad: "string", padEnd: "string", padStart: "string", parseInteger: "string", repeat: "string", replace: "string", split: "string", startsWith: "string", toLower: "string", toUpper: "string", trim: "string", trimEnd: "string", trimStart: "string", upperCase: "string", upperFirst: "string",
    attempt: "util", castArray: "util", cloneDeep: "util", constant: "util", identity: "util", nthArg: "util", overEvery: "util", overSome: "util", property: "util", propertyOf: "util", rangeRight: "util", stubArray: "util", stubFalse: "util", stubObject: "util", stubString: "util", stubTrue: "util", toPath: "util",
  } as Record<string, TaphosCategory>,
  categoryOrder: ["array", "collection", "function", "lang", "math", "object", "string", "util"],
  libraryDescriptions: {
    taphos: translate({ id: 'comparison.taphos.lib.taphos', message: 'Pithos utility module (modern ES2020+)' }),
    native: translate({ id: 'comparison.taphos.lib.native', message: 'Native JavaScript equivalent' }),
    "es-toolkit": translate({ id: 'comparison.taphos.lib.esToolkit', message: 'Modern utility library' }),
    "es-toolkit/compat": translate({ id: 'comparison.taphos.lib.esToolkitCompat', message: 'es-toolkit with lodash compat' }),
    "lodash-es": translate({ id: 'comparison.taphos.lib.lodashEs', message: 'ES modules lodash' }),
  },
  excludedLibraries: ["lodash"],
  nonEquivalentFunctions: ["lowerCase", "upperCase", "hasIn", "toString"],
  quasiEquivalentFunctions: {
    indexOf: nanWarning,
    lastIndexOf: nanWarning,
    eq: eqWarning,
    cloneDeep: cloneDeepWarning,
    isNaN: isNaNWarning,
    pull: pullWarning,
    pullAt: pullWarning,
    pullAllBy: pullWarning,
    pullAllWith: pullWarning,
    forIn: forInWarning,
    forOwn: forInWarning,
    transform: forInWarning,
    isTypedArray: isTypedArrayWarning,
    isElement: isElementWarning,
    toInteger: toIntegerWarning,
    toSafeInteger: toSafeIntegerWarning,
    round: precisionWarning,
    ceil: precisionWarning,
    floor: precisionWarning,
  },
  tldrContent: (data: BenchmarkReport) => {
    let nativeWins = 0, taphosWins = 0, total = 0;
    for (const s of data.scenarios) { const w = s.results.find(r => r.isFastest); if (!w) continue; total++; if (w.library === "native") nativeWins++; if (w.library === "taphos") taphosWins++; }
    const nativeWinRate = Math.round((nativeWins / total) * 100);
    const text = translate(
      { id: 'comparison.taphos.tldr', message: 'Native JavaScript wins {nativeWinRate}% of benchmarks. That\'s the point — Taphos helps you migrate from Lodash, but the real goal is native JS. Among libraries, Taphos is competitive with {taphosWins} wins.' },
      { nativeWinRate: String(nativeWinRate), taphosWins: String(taphosWins) }
    );
    const firstDot = text.indexOf('.');
    return <><strong>{text.slice(0, firstDot + 1)}</strong> {text.slice(firstDot + 2)}</>;
  },
  generateCommand: "pnpm doc:generate:taphos:benchmarks-results",
};
