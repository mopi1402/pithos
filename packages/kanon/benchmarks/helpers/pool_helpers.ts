import { bench, describe } from "vitest";

// ===== CYCLIC SELECTION FUNCTIONS =====

import { LibName, POOL_SIZE, isAvailable } from "../dataset/config";
import {
  booleanPool,
  bulkObjectPools,
  bulkStringPools,
  complexObjectPool,
  invalidObjectPool,
  invalidStringPool,
  largeStringArrayPool,
  longStringPool,
  numberArrayPool,
  numberPool,
  simpleObjectPool,
  stringArrayPool,
  stringPool,
  nullPool,
  undefinedPool,
  anyPool,
  unknownPool,
  datePool,
  bigintPool,
  userRegistrationPool,
} from "../dataset/pools";

// Cyclic selection to avoid repetitions while remaining deterministic
let stringIndex = 0;
let longStringIndex = 0;
let numberIndex = 0;
let booleanIndex = 0;
let simpleObjectIndex = 0;
let complexObjectIndex = 0;
let stringArrayIndex = 0;
let numberArrayIndex = 0;
let largeArrayIndex = 0;
let invalidStringIndex = 0;
let invalidObjectIndex = 0;
let bulkStringIndex = 0;
let bulkObjectIndex = 0;
let nullIndex = 0;
let undefinedIndex = 0;
let anyIndex = 0;
let unknownIndex = 0;
let dateIndex = 0;
let bigintIndex = 0;
let userRegistrationIndex = 0;

export const getString = () => stringPool[stringIndex++ % stringPool.length];
export const getLongString = () =>
  longStringPool[longStringIndex++ % longStringPool.length];
export const getNumber = () => numberPool[numberIndex++ % numberPool.length];
export const getBoolean = () =>
  booleanPool[booleanIndex++ % booleanPool.length];
export const getSimpleObject = () =>
  simpleObjectPool[simpleObjectIndex++ % simpleObjectPool.length];
export const getComplexObject = () =>
  complexObjectPool[complexObjectIndex++ % complexObjectPool.length];
export const getStringArray = () =>
  stringArrayPool[stringArrayIndex++ % stringArrayPool.length];
export const getNumberArray = () =>
  numberArrayPool[numberArrayIndex++ % numberArrayPool.length];
export const getPooledLargeArray = () =>
  largeStringArrayPool[largeArrayIndex++ % largeStringArrayPool.length];
export const getInvalidString = () =>
  invalidStringPool[invalidStringIndex++ % invalidStringPool.length];
export const getInvalidObject = () =>
  invalidObjectPool[invalidObjectIndex++ % invalidObjectPool.length];
export const getBulkStrings = () =>
  bulkStringPools[bulkStringIndex++ % bulkStringPools.length];
export const getBulkObjects = () =>
  bulkObjectPools[bulkObjectIndex++ % bulkObjectPools.length];

// ===== NOUVELLES FONCTIONS POUR V3 =====

export const getNull = () => nullPool[nullIndex++ % nullPool.length];
export const getUndefined = () =>
  undefinedPool[undefinedIndex++ % undefinedPool.length];
export const getAny = () => anyPool[anyIndex++ % anyPool.length];
export const getUnknown = () =>
  unknownPool[unknownIndex++ % unknownPool.length];
export const getDate = () => datePool[dateIndex++ % datePool.length];
export const getBigInt = () => bigintPool[bigintIndex++ % bigintPool.length];
export const getUserRegistration = () =>
  userRegistrationPool[userRegistrationIndex++ % userRegistrationPool.length];

const memoizedRandomize = {
  stringIndex: 0,
  longStringIndex: 0,
  numberIndex: 0,
  booleanIndex: 0,
  simpleObjectIndex: 0,
  complexObjectIndex: 0,
  stringArrayIndex: 0,
  numberArrayIndex: 0,
  largeArrayIndex: 0,
  invalidStringIndex: 0,
  invalidObjectIndex: 0,
  bulkStringIndex: 0,
  bulkObjectIndex: 0,
};

const randomizeStartIndexPool = () => {
  const randomize = () => Math.floor(Math.random() * POOL_SIZE);
  stringIndex = memoizedRandomize.stringIndex = randomize();
  longStringIndex = memoizedRandomize.longStringIndex = randomize();
  numberIndex = memoizedRandomize.numberIndex = randomize();
  booleanIndex = memoizedRandomize.booleanIndex = randomize();
  simpleObjectIndex = memoizedRandomize.simpleObjectIndex = randomize();
  complexObjectIndex = memoizedRandomize.complexObjectIndex = randomize();
  stringArrayIndex = memoizedRandomize.stringArrayIndex = randomize();
  numberArrayIndex = memoizedRandomize.numberArrayIndex = randomize();
  largeArrayIndex = memoizedRandomize.largeArrayIndex = randomize();
  invalidStringIndex = memoizedRandomize.invalidStringIndex = randomize();
  invalidObjectIndex = memoizedRandomize.invalidObjectIndex = randomize();
  bulkStringIndex = memoizedRandomize.bulkStringIndex = randomize();
  bulkObjectIndex = memoizedRandomize.bulkObjectIndex = randomize();
};

const reapplyStartIndexPool = () => {
  stringIndex = memoizedRandomize.stringIndex;
  longStringIndex = memoizedRandomize.longStringIndex;
  numberIndex = memoizedRandomize.numberIndex;
  booleanIndex = memoizedRandomize.booleanIndex;
  simpleObjectIndex = memoizedRandomize.simpleObjectIndex;
  complexObjectIndex = memoizedRandomize.complexObjectIndex;
  stringArrayIndex = memoizedRandomize.stringArrayIndex;
  numberArrayIndex = memoizedRandomize.numberArrayIndex;
  largeArrayIndex = memoizedRandomize.largeArrayIndex;
  invalidStringIndex = memoizedRandomize.invalidStringIndex;
  invalidObjectIndex = memoizedRandomize.invalidObjectIndex;
  bulkStringIndex = memoizedRandomize.bulkStringIndex;
  bulkObjectIndex = memoizedRandomize.bulkObjectIndex;
};

export const runBenchmarkSuite = (
  suiteName: string,
  tests: Array<{
    name: LibName;
    fn: () => void;
  }>
) => {
  describe(suiteName, () => {
    randomizeStartIndexPool();

    const filteredTests = tests.filter((test) => isAvailable[test.name]);

    if (filteredTests.length === 0) {
      console.warn(`No tests available for suite: ${suiteName}`);
      return;
    }

    const isKanonTest = (name: LibName): boolean => {
      return name.startsWith("@kanon/");
    };

    const reorderedTests = [
      ...filteredTests.filter((test) => !isKanonTest(test.name)),
      ...filteredTests.filter((test) => isKanonTest(test.name)),
    ];

    bench(reorderedTests[0].name, reorderedTests[0].fn);

    for (let i = 1; i < reorderedTests.length; i++) {
      reapplyStartIndexPool();
      bench(reorderedTests[i].name, reorderedTests[i].fn);
    }
  });
};
