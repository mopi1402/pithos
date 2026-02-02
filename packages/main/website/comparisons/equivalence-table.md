---
sidebar_label: "Equivalence Table"
sidebar_position: 5
title: Equivalence Table
description: Complete equivalence table between Pithos and popular utility, validation, and error handling libraries
---

# Library Equivalence Tables

This document provides comparison tables between Pithos modules and their equivalents in popular libraries. The comparisons are organized into three categories:

1. **Utilities** — General-purpose utility functions (Lodash, Es-toolkit, Remeda, Radashi, Ramda)
2. **Validation** — Schema validation libraries (Zod, Valibot, ArkType, Yup)
3. **Error Handling** — Functional error handling patterns (neverthrow, fp-ts, Effect, ts-results)

:::warning Disclaimer
The equivalences listed here are **indicative only** and do not guarantee compatibility or interchangeability between libraries. Each library has its own design philosophy, function signatures, and edge-case behaviors.

**Always refer to the documentation of each function before migrating code.**
:::

:::info Pithos Coverage
Pithos does not aim to cover 100% of utilities from each library. Some functions will never be added, including:
- Functions with a **recent native equivalent** in JavaScript/TypeScript
- **Mutable** functions (Pithos favors immutability)
- Functions considered too specific or rarely used
- **Advanced FP patterns** from Ramda (lenses, transducers, applicatives, etc.) — for these, use Ramda or fp-ts directly
:::

### Legend

- ✅ = Available in Pithos
- ❌ = Not available in Pithos
- `-` = Not available in this library
- `≈` = Approximate equivalent (similar but not identical API/behavior)

---

## Part 1: Utilities

Comparison between **Pithos (Arkhe)** and utility libraries: Lodash, Es-toolkit, Remeda, Radashi, and Ramda.

<FilterableTable>

### Array

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | ES-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| ~native`at` | ✅ | `_.at` | `at` | - | - | - |
| `chunk` | ✅ | `_.chunk` | `chunk` | `chunk` | `cluster` | `splitEvery` |
| ~native`compact` | ✅ | `_.compact` | `compact` | - | `sift` | - |
| ~native`concat` | ✅ | `_.concat` | `concat` | `concat` | `concat` | `concat` |
| `countBy` | ✅ | `_.countBy` | `countBy` | `countBy` | `counting` | `countBy` |
| `difference` | ✅ | `_.difference` | `difference` | `difference` | `diff` | `difference` |
| ~niche`differenceBy` | ✅ | `_.differenceBy` | `differenceBy` | `differenceWith` | - | - |
| ~niche`differenceWith` | ✅ | `_.differenceWith` | `differenceWith` | `differenceWith` | - | `differenceWith` |
| `drop` | ✅ | `_.drop` | `drop` | `drop` | - | `drop` |
| `dropRight` | ✅ | `_.dropRight` | `dropRight` | `dropLast` | - | `dropLast` |
| `dropRightWhile` | ✅ | `_.dropRightWhile` | `dropRightWhile` | `dropLastWhile` | - | `dropLastWhile` |
| `dropWhile` | ✅ | `_.dropWhile` | `dropWhile` | `dropWhile` | - | `dropWhile` |
| `each` | ✅ | `_.forEach` | `forEach` | `forEach` | - | `forEach` |
| `fill` | ✅ | `_.fill` | `fill` | - | - | - |
| `filter` | ✅ | `_.filter` | `filter` | `filter` | - | `filter` |
| ~native`find` | ✅ | `_.find` | `find` | `find` | - | `find` |
| `findBest` | ✅ | - | - | ≈`firstBy` | `boil` | - |
| ~native`findIndex` | ✅ | `_.findIndex` | `findIndex` | `findIndex` | - | `findIndex` |
| `findLast` | ✅ | `_.findLast` | `findLast` | `findLast` | - | `findLast` |
| `findLastIndex` | ✅ | `_.findLastIndex` | `findLastIndex` | `findLastIndex` | - | `findLastIndex` |
| ~native`first` / `head` | ✅ | `_.first` / `_.head` | `head` | `first` | `first` | `head` |
| `flatMap` | ✅ | `_.flatMap` | `flatMap` | `flatMap` | - | `chain` |
| `flatMapDeep` | ✅ | `_.flatMapDeep` | `flatMapDeep` | - | - | - |
| ~niche`flatMapDepth` | ✅ | `_.flatMapDepth` | `flatMapDepth` | - | - | - |
| ~native`flatten` | ✅ | `_.flatten` | `flatten` | `flat` | `flat` | `flatten` |
| ~native`flattenDeep` | ✅ | `_.flattenDeep` | `flattenDeep` | - | `flat` | `flatten` |
| ~native`flattenDepth` | ✅ | `_.flattenDepth` | `flattenDepth` | - | - | - |
| ~native`fromPairs` | ✅ | `_.fromPairs` | `fromPairs` | `fromEntries` | - | `fromPairs` |
| `groupBy` | ✅ | `_.groupBy` | `groupBy` | `groupBy` | `group` | `groupBy` |
| `includes` | ✅ | `_.includes` | `includes` | - | - | `includes` |
| ~native`indexOf` | ✅ | `_.indexOf` | `indexOf` | - | - | `indexOf` |
| ~native`initial` | ✅ | `_.initial` | `initial` | `dropLast` | - | `init` |
| `intersection` | ✅ | `_.intersection` | `intersection` | `intersection` | `intersects` | `intersection` |
| ~niche`intersectionBy` | ✅ | `_.intersectionBy` | `intersectionBy` | `intersectionWith` | - | - |
| ~niche`intersectionWith` | ✅ | `_.intersectionWith` | `intersectionWith` | `intersectionWith` | - | - |
| ~native`join` | ✅ | `_.join` | `join` | `join` | - | `join` |
| `keyBy` | ✅ | `_.keyBy` | `keyBy` | `indexBy` | `objectify` | `indexBy` |
| ~native`last` | ✅ | `_.last` | `last` | `last` | `last` | `last` |
| ~native`lastIndexOf` | ✅ | `_.lastIndexOf` | `lastIndexOf` | - | - | `lastIndexOf` |
| ~native`map` | ✅ | `_.map` | `map` | `map` | - | `map` |
| `maxBy` | ✅ | `_.maxBy` | `maxBy` | - | `max` | `maxBy` |
| `minBy` | ✅ | `_.minBy` | `minBy` | - | `min` | `minBy` |
| ~native`nth` | ✅ | `_.nth` | `nth` | - | - | `nth` |
| `orderBy` | ✅ | `_.orderBy` | `orderBy` | `sortBy` | `sort` | `sortWith` |
| `partition` | ✅ | `_.partition` | `partition` | `partition` | `fork` | `partition` |
| ~native`pull` | ✅ | `_.pull` | `pull` | - | - | `without` |
| ~native`pullAll` | ✅ | `_.pullAll` | `pullAll` | - | - | `without` |
| `reduce` | ✅ | `_.reduce` | `reduce` | `reduce` | - | `reduce` |
| `reduceRight` | ✅ | `_.reduceRight` | `reduceRight` | - | - | `reduceRight` |
| `reject` | ✅ | `_.reject` | `reject` | - | - | `reject` |
| `reverse` | ✅ | `_.reverse` | `reverse` | `reverse` | - | `reverse` |
| `sample` | ✅ | `_.sample` | `sample` | `sample` | `draw` | - |
| `sampleSize` | ✅ | `_.sampleSize` | `sampleSize` | `sample` | - | - |
| `shuffle` | ✅ | `_.shuffle` | `shuffle` | `shuffle` | `shuffle` | - |
| `size` | ✅ | `_.size` | `size` | `length` | - | `length` |
| ~native`slice` | ✅ | `_.slice` | `slice` | - | - | `slice` |
| `sortBy` | ✅ | `_.sortBy` | `sortBy` | `sortBy` | `sort` | `sortBy` |
| ~native`tail` | ✅ | `_.tail` | `tail` | - | - | `tail` |
| `take` | ✅ | `_.take` | `take` | `take` | - | `take` |
| `takeRight` | ✅ | `_.takeRight` | `takeRight` | `takeLast` | - | `takeLast` |
| `takeRightWhile` | ✅ | `_.takeRightWhile` | `takeRightWhile` | `takeLastWhile` | - | `takeLastWhile` |
| `takeWhile` | ✅ | `_.takeWhile` | `takeWhile` | `takeWhile` | - | `takeWhile` |
| `union` | ✅ | `_.union` | `union` | - | `unique` | `union` |
| ~niche`unionBy` | ✅ | `_.unionBy` | `unionBy` | - | `unique` | `unionWith` |
| ~niche`unionWith` | ✅ | `_.unionWith` | `unionWith` | - | - | `unionWith` |
| `uniq` | ✅ | `_.uniq` | `uniq` | `unique` | `unique` | `uniq` |
| `uniqBy` | ✅ | `_.uniqBy` | `uniqBy` | `uniqueBy` | `unique` | `uniqBy` |
| ~niche`uniqWith` | ✅ | `_.uniqWith` | `uniqWith` | `uniqueWith` | `unique` | `uniqWith` |
| `unzip` | ✅ | `_.unzip` | `unzip` | - | `unzip` | `transpose` |
| `window` | ✅ | - | `windowed` | - | - | `aperture` |
| ~native`without` | ✅ | `_.without` | `without` | - | - | `without` |
| `xor` / `toggle` | ✅ | `_.xor` | `xor` | - | `toggle` | `symmetricDifference` |
| `zip` | ✅ | `_.zip` | `zip` | `zip` | `zip` | `zip` |
| `zipWith` | ✅ | `_.zipWith` | `zipWith` | `zipWith` | `zip` | `zipWith` |
| - | ❌ | - | - | `dropFirstBy` | - | - |
| - | ❌ | - | - | `hasAtLeast` | - | - |
| ~niche- | ❌ | - | - | `nthBy` | - | - |
| ~niche- | ❌ | - | - | `only` | - | - |
| ~niche- | ❌ | - | - | `rankBy` | - | - |
| ~native- | ❌ | - | - | `sort` | - | `sort` |
| ~mutable- | ❌ | - | - | `splice` | - | - |
| - | ❌ | - | - | `splitAt` | - | `splitAt` |
| - | ❌ | - | - | `splitWhen` | - | `splitWhen` |
| ~niche- | ❌ | - | - | `swapIndices` | - | `swap` |
| - | ❌ | - | - | `takeFirstBy` | - | - |
| ~niche- | ❌ | - | - | - | - | `adjust` |
| ~native- | ❌ | - | - | - | - | `append` |
| - | ❌ | - | - | - | - | `dropRepeats` |
| - | ❌ | - | - | - | - | `dropRepeatsWith` |
| ~native- | ❌ | - | - | - | - | `insert` |
| ~native- | ❌ | - | - | - | - | `insertAll` |
| ~niche- | ❌ | - | - | - | - | `intersperse` |
| ~niche- | ❌ | - | - | - | - | `move` |
| ~native- | ❌ | - | - | - | - | `none` |
| ~native- | ❌ | - | - | - | - | `pluck` |
| ~native- | ❌ | - | - | - | - | `prepend` |
| ~niche- | ❌ | - | - | - | - | `scan` |
| ~niche- | ❌ | - | - | - | - | `unfold` |
| ~native- | ❌ | - | - | - | - | `unnest` |
| ~niche- | ❌ | - | - | - | - | `update` |
| ~niche- | ❌ | - | - | - | - | `xprod` |
| ~niche- | ❌ | - | - | - | - | `collectBy` |
| ~native- | ❌ | - | - | - | - | `count` |
| ~niche- | ❌ | - | - | - | - | `dropRepeatsBy` |
| ~niche- | ❌ | - | - | - | - | `groupWith` |
| ~niche- | ❌ | - | - | - | - | `innerJoin` |
| ~native- | ❌ | - | - | - | - | `of` |
| ~native- | ❌ | - | - | - | - | `pair` |
| - | ❌ | - | - | - | - | `splitEvery` |
| ~niche- | ❌ | - | - | - | - | `splitWhenever` |
| ~niche- | ❌ | - | - | - | - | `unwind` |
| ~native- | ❌ | `_.every` | `every` | - | - | `all` |
| ~niche- | ❌ | `_.forEachRight` | `forEachRight` | - | - | - |
| ~mutable- | ❌ | `_.pullAt` | `pullAt` | - | - | `remove` |
| ~mutable- | ❌ | `_.remove` | `remove` | - | `remove` | `remove` |
| ~native- | ❌ | `_.some` | `some` | - | - | `any` |
| - | ❌ | `_.xorBy` | `xorBy` | - | - | - |
| - | ❌ | `_.xorWith` | `xorWith` | - | - | `symmetricDifferenceWith` |
| ~native- | ❌ | `_.zipObject` | `zipObject` | - | `zipToObject` | `zipObj` |
| ~niche- | ❌ | `_.unzipWith` | `unzipWith` | - | - | - |
| ~niche- | ❌ | - | `toFilled` | - | - | - |

</TableConfig>


### Function

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| `after` | ✅ | `_.after` | `after` | - | - | - |
| `before` | ✅ | `_.before` | `before` | - | - | - |
| ~native`bind` | ✅ | `_.bind` | `bind` | - | - | `bind` |
| `castComparator` | ✅ | - | - | - | `castComparator` | `comparator` |
| `castMapping` | ✅ | `_.iteratee` | - | - | `castMapping` | - |
| `constant` | ✅ | `_.constant` | `constant` | `constant` | - | `always` |
| `curry` | ✅ | `_.curry` | `curry` | - | - | `curry` |
| `debounce` | ✅ | `_.debounce` | `debounce` | `debounce` | `debounce` | - |
| ~native`defer` | ✅ | `_.defer` | `defer` | - | `defer` | - |
| `flip` | ✅ | `_.flip` | `flip` | - | `flip` | `flip` |
| `flow` / `pipe` | ✅ | `_.flow` | `flow` | `pipe` | `chain` | `pipe` |
| `flowRight` | ✅ | `_.flowRight` | `flowRight` | - | `compose` | `compose` |
| `identity` | ✅ | `_.identity` | `identity` | `identity` | `identity` | `identity` |
| `memoize` | ✅ | `_.memoize` | `memoize` | - | `memo` | `memoizeWith` |
| `negate` | ✅ | `_.negate` | `negate` | - | - | `complement` |
| `noop` | ✅ | `_.noop` | `noop` | `doNothing` | `noop` | - |
| `once` | ✅ | `_.once` | `once` | `once` | `once` | `once` |
| ~native`partial` | ✅ | `_.partial` | `partial` | - | `partial` | `partial` |
| `tap` | ✅ | `_.tap` | - | `tap` | - | `tap` |
| `throttle` | ✅ | `_.throttle` | `throttle` | - | `throttle` | - |
| `times` | ✅ | `_.times` | `times` | `times` | `iterate` | `times` |
| ~niche`when` | ✅ | - | - | `when` | - | `when` |
| ~niche`unless` | ✅ | - | - | - | - | `unless` |
| ~niche- | ❌ | - | - | `allPass` | - | - |
| ~niche- | ❌ | - | - | `anyPass` | - | - |
| ~niche- | ❌ | - | - | `conditional` | - | - |
| ~niche- | ❌ | - | - | `funnel` | - | - |
| ~niche- | ❌ | - | - | `partialBind` | - | - |
| ~niche- | ❌ | - | - | `partialLastBind` | - | - |
| ~niche- | ❌ | - | - | `piped` | - | - |
| ~niche- | ❌ | - | - | `purry` | - | - |
| - | ❌ | - | - | - | - | `ascend` |
| - | ❌ | - | - | - | - | `descend` |
| ~niche- | ❌ | `_.ary` | `ary` | - | - | `nAry` |
| ~niche- | ❌ | `_.curryRight` | `curryRight` | - | - | `curryN` |
| ~niche- | ❌ | `_.partialRight` | `partialRight` | - | - | `partialRight` |
| ~native- | ❌ | `_.rest` | `rest` | - | - | - |
| ~native- | ❌ | `_.spread` | `spread` | - | - | `apply` |
| ~native- | ❌ | `_.unary` | `unary` | - | - | `unary` |

</TableConfig>

### Lang (Type Checks)

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| `castArray` / `toArray` | ✅ | `_.castArray` | `castArray` | - | `castArray` | - |
| `cloneDeep` / `deepClone` | ✅ | `_.cloneDeep` | `cloneDeep` | `clone` | `cloneDeep` | `clone` |
| `isArray` | ✅ | `_.isArray` | `isArray` | `isArray` | `isArray` | `is(Array)` |
| ~niche`isArrayBuffer` | ✅ | `_.isArrayBuffer` | `isArrayBuffer` | - | - | - |
| `isBigint` | ✅ | - | - | `isBigInt` | `isBigInt` | - |
| `isBoolean` | ✅ | `_.isBoolean` | `isBoolean` | `isBoolean` | `isBoolean` | `is(Boolean)` |
| `isDate` | ✅ | `_.isDate` | `isDate` | `isDate` | `isDate` | `is(Date)` |
| `isDefined` | ✅ | - | - | `isDefined` | - | - |
| `isEmpty` | ✅ | `_.isEmpty` | `isEmpty` | `isEmpty` | `isEmpty` | `isEmpty` |
| `isEqual` | ✅ | `_.isEqual` | `isEqual` | `isDeepEqual` | `isEqual` | `equals` |
| `isError` | ✅ | `_.isError` | `isError` | `isError` | `isError` | - |
| ~native`isFinite` | ✅ | `_.isFinite` | `isFinite` | - | - | - |
| `isFloat` | ✅ | - | - | - | `isFloat` | - |
| `isFunction` | ✅ | `_.isFunction` | `isFunction` | `isFunction` | `isFunction` | `is(Function)` |
| ~native`isInteger` | ✅ | `_.isInteger` | `isInteger` | - | `isInt` | - |
| `isMap` | ✅ | `_.isMap` | `isMap` | - | `isMap` | `is(Map)` |
| ~native`isNaN` | ✅ | `_.isNaN` | `isNaN` | - | - | - |
| `isNil` | ✅ | `_.isNil` | `isNil` | `isNullish` | `isNullish` | `isNil` |
| `isNonNull` | ✅ | - | - | `isNonNull` | - | `isNotNil` |
| `isNonNullable` | ✅ | - | - | `isNonNullish` | - | `isNotNil` |
| `isNonUndefined` | ✅ | - | - | `isDefined` | - | - |
| `isNull` | ✅ | `_.isNull` | `isNull` | - | - | - |
| `isNumber` | ✅ | `_.isNumber` | `isNumber` | `isNumber` | `isNumber` | `is(Number)` |
| `isObject` | ✅ | `_.isObject` | `isObject` | `isObjectType` | `isObject` | `is(Object)` |
| `isOneOf` | ✅ | - | - | `isIncludedIn` | - | - |
| `isPlainObject` | ✅ | `_.isPlainObject` | `isPlainObject` | `isPlainObject` | `isPlainObject` | - |
| `isPrimitive` | ✅ | - | `isPrimitive` | - | `isPrimitive` | - |
| `isPromise` | ✅ | - | `isPromise` | `isPromise` | `isPromise` | - |
| `isRegExp` | ✅ | `_.isRegExp` | `isRegExp` | - | `isRegExp` | `is(RegExp)` |
| `isSet` | ✅ | `_.isSet` | `isSet` | - | `isSet` | `is(Set)` |
| `isString` | ✅ | `_.isString` | `isString` | `isString` | `isString` | `is(String)` |
| ~niche`isSymbol` | ✅ | `_.isSymbol` | `isSymbol` | `isSymbol` | `isSymbol` | - |
| `isUndefined` | ✅ | `_.isUndefined` | `isUndefined` | - | `isUndefined` | - |
| ~native`toNumber` | ✅ | `_.toNumber` | `toNumber` | - | `toFloat` | - |
| - | ❌ | - | - | `isEmptyish` | - | - |
| - | ❌ | - | - | `isNot` | - | - |
| - | ❌ | - | - | `isShallowEqual` | - | - |
| - | ❌ | - | - | `isStrictEqual` | - | - |
| - | ❌ | - | - | `isTruthy` | - | - |
| - | ❌ | - | - | - | - | `identical` |
| - | ❌ | - | - | - | - | `type` |
| - | ❌ | `_.clone` | `clone` | - | `clone` | `clone` |
| - | ❌ | `_.cloneDeepWith` | `cloneDeepWith` | - | - | - |
| - | ❌ | `_.isEqualWith` | `isEqualWith` | - | - | - |
| - | ❌ | `_.isLength` | `isLength` | - | - | - |
| ~native- | ❌ | `_.isTypedArray` | `isTypedArray` | - | - | - |
| ~native- | ❌ | `_.isWeakMap` | `isWeakMap` | - | `isWeakMap` | - |
| ~native- | ❌ | `_.isWeakSet` | `isWeakSet` | - | `isWeakSet` | - |
| - | ❌ | - | - | - | - | `isNotEmpty` |

</TableConfig>

### Math / Number

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| ~native`add` | ✅ | `_.add` | `add` | `add` | - | `add` |
| `average` | ✅ | `_.mean` | `mean` | `mean` | - | `mean` |
| ~native`ceil` | ✅ | `_.ceil` | `ceil` | `ceil` | - | - |
| `clamp` | ✅ | `_.clamp` | `clamp` | `clamp` | `clamp` | `clamp` |
| ~native`divide` | ✅ | `_.divide` | `divide` | `divide` | - | `divide` |
| ~native`floor` | ✅ | `_.floor` | `floor` | `floor` | - | - |
| `inRange` | ✅ | `_.inRange` | `inRange` | - | `inRange` | - |
| `maxBy` | ✅ | `_.maxBy` | `maxBy` | - | `max` | `maxBy` |
| `median` | ✅ | - | `median` | `median` | - | `median` |
| `minBy` | ✅ | `_.minBy` | `minBy` | - | `min` | `minBy` |
| ~native`multiply` | ✅ | `_.multiply` | `multiply` | `multiply` | - | `multiply` |
| `random` | ✅ | `_.random` | `random` | `randomInteger` | `random` | - |
| `range` | ✅ | `_.range` | `range` | `range` | `range` | `range` |
| ~native`round` | ✅ | `_.round` | `round` | `round` | `round` | - |
| ~native`subtract` | ✅ | `_.subtract` | `subtract` | `subtract` | - | `subtract` |
| `sum` | ✅ | `_.sum` | `sum` | `sum` | `sum` | `sum` |
| - | ❌ | - | - | `product` | - | `product` |
| ~niche- | ❌ | - | - | `randomBigInt` | - | - |
| ~native- | ❌ | - | - | - | - | `dec` |
| ~native- | ❌ | - | - | - | - | `inc` |
| ~niche- | ❌ | - | - | - | - | `mathMod` |
| ~native- | ❌ | - | - | - | - | `max` |
| ~native- | ❌ | - | - | - | - | `min` |
| ~native- | ❌ | - | - | - | - | `modulo` |
| ~native- | ❌ | - | - | - | - | `negate` |
| ~native- | ❌ | - | - | - | - | `gt` |
| ~native- | ❌ | - | - | - | - | `gte` |
| ~native- | ❌ | - | - | - | - | `lt` |
| ~native- | ❌ | - | - | - | - | `lte` |
| - | ❌ | `_.sumBy` | `sumBy` | `sumBy` | - | - |
| - | ❌ | `_.meanBy` | `meanBy` | `meanBy` | - | - |
| - | ❌ | - | `medianBy` | - | - | - |
| - | ❌ | `_.rangeRight` | `rangeRight` | - | - | - |

</TableConfig>

### Object

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| ~native`assign` | ✅ | `_.assign` | `merge` | `merge` | `assign` | `mergeRight` |
| `defaults` | ✅ | `_.defaults` | `defaults` | - | - | `mergeLeft` |
| `defaultsDeep` | ✅ | `_.defaultsDeep` | `defaultsDeep` | - | - | `mergeDeepLeft` |
| `deepClone` | ✅ | `_.cloneDeep` | `cloneDeep` | `clone` | `cloneDeep` | `clone` |
| `evolve` | ✅ | - | - | `evolve` | - | `evolve` |
| `findKey` | ✅ | `_.findKey` | `findKey` | - | - | - |
| ~native`forIn` | ✅ | `_.forIn` | `forIn` | `forEachObj` | - | `forEachObjIndexed` |
| ~native`forOwn` | ✅ | `_.forOwn` | `forOwn` | `forEachObj` | - | `forEachObjIndexed` |
| `get` | ✅ | `_.get` | `get` | `pathOr` / `prop` | `get` | `path` |
| `has` | ✅ | `_.has` | `has` | - | - | `has` |
| `invert` | ✅ | `_.invert` | `invert` | `invert` | `invert` | `invert` |
| ~native`invoke` | ✅ | `_.invoke` | `invoke` | - | - | `invoker` |
| ~native`keys` | ✅ | `_.keys` | `keys` | `keys` | `keys` | `keys` |
| `mapKeys` | ✅ | `_.mapKeys` | `mapKeys` | `mapKeys` | `mapKeys` | `mapKeys` |
| `mapValues` | ✅ | `_.mapValues` | `mapValues` | `mapValues` | `mapValues` | `mapObjIndexed` |
| `mergeDeep` | ✅ | `_.merge` | `merge` | `mergeDeep` | - | `mergeDeepRight` |
| ~niche`mergeWith` | ✅ | `_.mergeWith` | `mergeWith` | - | - | `mergeWith` |
| `omit` | ✅ | `_.omit` | `omit` | `omit` | `omit` | `omit` |
| `omitBy` | ✅ | `_.omitBy` | `omitBy` | `omitBy` | `filterKey` | - |
| `pick` | ✅ | `_.pick` | `pick` | `pick` | `pick` | `pick` |
| `pickBy` | ✅ | `_.pickBy` | `pickBy` | `pickBy` | `filterKey` | `pickBy` |
| `set` | ✅ | `_.set` | `set` | `set` / `setPath` | `set` | `assocPath` |
| ~native`toPairs` | ✅ | `_.toPairs` | `toPairs` | `entries` | - | `toPairs` |
| ~native`values` | ✅ | `_.values` | `values` | `values` | - | `values` |
| ~niche- | ❌ | - | - | `addProp` | - | `assoc` |
| ~niche- | ❌ | - | - | `fromKeys` | - | - |
| ~niche- | ❌ | - | - | `groupByProp` | - | - |
| ~niche- | ❌ | - | - | `hasSubObject` | - | - |
| ~niche- | ❌ | - | - | `mapToObj` | - | - |
| ~niche- | ❌ | - | - | `mapWithFeedback` | - | - |
| - | ❌ | - | - | `mergeAll` | - | `mergeAll` |
| ~niche- | ❌ | - | - | `objOf` | - | `objOf` |
| ~niche- | ❌ | - | - | `pullObject` | - | - |
| ~niche- | ❌ | - | - | `stringToPath` | - | - |
| ~niche- | ❌ | - | - | `swapProps` | - | - |
| - | ❌ | - | - | - | - | `dissoc` |
| - | ❌ | - | - | - | - | `dissocPath` |
| ~niche- | ❌ | - | - | - | - | `eqProps` |
| ~niche- | ❌ | - | - | - | - | `pathEq` |
| - | ❌ | - | - | - | - | `pathOr` |
| ~niche- | ❌ | - | - | - | - | `paths` |
| ~niche- | ❌ | - | - | - | - | `pickAll` |
| ~niche- | ❌ | - | - | - | - | `project` |
| ~niche- | ❌ | - | - | - | - | `propEq` |
| - | ❌ | - | - | - | - | `propOr` |
| ~niche- | ❌ | - | - | - | - | `props` |
| ~niche- | ❌ | - | - | - | - | `where` |
| ~niche- | ❌ | - | - | - | - | `whereEq` |
| ~niche- | ❌ | - | - | - | - | `hasIn` |
| - | ❌ | - | - | - | - | `hasPath` |
| ~niche- | ❌ | - | - | - | - | `invertObj` |
| ~niche- | ❌ | - | - | - | - | `keysIn` |
| ~niche- | ❌ | - | - | - | - | `mergeDeepWith` |
| ~niche- | ❌ | - | - | - | - | `mergeDeepWithKey` |
| ~niche- | ❌ | - | - | - | - | `mergeWithKey` |
| ~niche- | ❌ | - | - | - | - | `pathSatisfies` |
| ~niche- | ❌ | - | - | - | - | `propIs` |
| ~niche- | ❌ | - | - | - | - | `propSatisfies` |
| - | ❌ | - | - | - | - | `renameKeys` |
| ~niche- | ❌ | - | - | - | - | `toPairsIn` |
| ~niche- | ❌ | - | - | - | - | `valuesIn` |
| ~niche- | ❌ | - | - | - | - | `whereAny` |
| - | ❌ | `_.clone` | `clone` | - | `clone` | `clone` |
| ~niche- | ❌ | `_.cloneDeepWith` | `cloneDeepWith` | - | - | - |
| ~niche- | ❌ | - | `flattenObject` | - | `crush` | - |
| ~niche- | ❌ | - | `toCamelCaseKeys` | - | `lowerize` | - |
| ~niche- | ❌ | - | `toMerged` | - | `merge` | - |

</TableConfig>

### String

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| `camelCase` | ✅ | `_.camelCase` | `camelCase` | `toCamelCase` | `camel` | - |
| `capitalize` | ✅ | `_.capitalize` | `capitalize` | `capitalize` | `capitalize` | - |
| `constantCase` | ✅ | - | `constantCase` | - | - | - |
| `deburr` | ✅ | `_.deburr` | `deburr` | - | - | - |
| ~native`endsWith` | ✅ | `_.endsWith` | `endsWith` | `endsWith` | - | `endsWith` |
| `escape` | ✅ | `_.escape` | `escape` | - | `escapeHTML` | - |
| `escapeRegExp` | ✅ | `_.escapeRegExp` | `escapeRegExp` | - | - | - |
| `kebabCase` | ✅ | `_.kebabCase` | `kebabCase` | `toKebabCase` | `dash` | - |
| `lowerFirst` | ✅ | `_.lowerFirst` | `lowerFirst` | `uncapitalize` | - | - |
| ~native`padEnd` | ✅ | `_.padEnd` | `padEnd` | - | - | - |
| ~native`padStart` | ✅ | `_.padStart` | `padStart` | - | - | - |
| `pascalCase` | ✅ | - | `pascalCase` | - | `pascal` | - |
| ~native`repeat` | ✅ | `_.repeat` | `repeat` | - | - | `repeat` |
| `sentenceCase` | ✅ | - | - | - | - | - |
| `snakeCase` | ✅ | `_.snakeCase` | `snakeCase` | `toSnakeCase` | `snake` | - |
| ~native`split` | ✅ | `_.split` | `split` | `split` | - | `split` |
| ~native`startsWith` | ✅ | `_.startsWith` | `startsWith` | `startsWith` | - | `startsWith` |
| `template` | ✅ | `_.template` | `template` | - | `template` | - |
| `titleCase` | ✅ | - | - | `toTitleCase` | `title` | - |
| ~native`toLower` | ✅ | `_.toLower` | `toLower` | `toLowerCase` | - | `toLower` |
| ~native`toUpper` | ✅ | `_.toUpper` | `toUpper` | `toUpperCase` | - | `toUpper` |
| ~native`trim` | ✅ | `_.trim` | `trim` | - | `trim` | `trim` |
| ~native`trimEnd` | ✅ | `_.trimEnd` | `trimEnd` | - | - | - |
| ~native`trimStart` | ✅ | `_.trimStart` | `trimStart` | - | - | - |
| `truncate` | ✅ | `_.truncate` | `truncate` | `truncate` | - | - |
| `unescape` | ✅ | `_.unescape` | `unescape` | - | - | - |
| ~native`upperFirst` | ✅ | `_.upperFirst` | `upperFirst` | - | - | - |
| `words` | ✅ | `_.words` | `words` | - | - | - |
| - | ❌ | - | - | `randomString` | - | - |
| ~niche- | ❌ | - | - | `sliceString` | - | - |
| ~native- | ❌ | - | - | - | - | `match` |
| ~native- | ❌ | - | - | - | - | `replace` |
| ~native- | ❌ | - | - | - | - | `test` |
| ~native- | ❌ | `_.lowerCase` | `lowerCase` | - | - | - |
| ~native- | ❌ | `_.pad` | `pad` | - | - | - |
| - | ❌ | `_.startCase` | `startCase` | - | - | - |
| ~native- | ❌ | `_.upperCase` | `upperCase` | - | - | - |

</TableConfig>

### Async / Promise

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| `all` | ✅ | - | - | - | `all` | - |
| ~native`defer` | ✅ | `_.defer` | `defer` | - | `defer` | - |
| `dedupeByKey` | ✅ | - | - | - | - | - |
| `guard` | ✅ | - | - | - | `guard` | - |
| `parallel` | ✅ | - | - | - | `parallel` | - |
| `queueByKey` | ✅ | - | - | - | `queueByKey` | - |
| `retry` | ✅ | - | `retry` | - | `retry` | - |
| `sleep` | ✅ | `_.delay` | `delay` | - | `sleep` | - |
| `timeout` | ✅ | - | `timeout` | - | `timeout` | - |
| `tryCatch` | ✅ | `_.attempt` | `attempt` | - | `tryit` | `tryCatch` |
| - | ❌ | - | `withTimeout` | - | - | - |

</TableConfig>

### Util

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos | !Status | Lodash | Es-toolkit | Remeda | Radashi | Ramda |
|---------|---------|--------|------------|--------|---------|-------|
| `assert` | ✅ | - | `assert` | - | `assert` | - |
| `castMapping` | ✅ | `_.iteratee` | - | - | `castMapping` | - |
| `defaultTo` | ✅ | `_.defaultTo` | `defaultTo` | `defaultTo` | - | `defaultTo` |
| `noop` | ✅ | `_.noop` | `noop` | `doNothing` | `noop` | - |
| `range` | ✅ | `_.range` | `range` | `range` | `range` | `range` |
| `times` | ✅ | `_.times` | `times` | `times` | `iterate` | `times` |
| `uniqueId` | ✅ | `_.uniqueId` | `uniqueId` | - | `uid` | - |
| - | ❌ | - | - | `sortedIndex` | - | - |
| - | ❌ | - | - | `sortedIndexBy` | - | - |
| - | ❌ | - | - | `sortedIndexWith` | - | - |
| - | ❌ | - | - | `sortedLastIndex` | - | - |
| - | ❌ | - | - | `sortedLastIndexBy` | - | - |
| - | ❌ | `_.attempt` | `attempt` | - | `tryit` | - |
| - | ❌ | - | `invariant` | - | - | - |

</TableConfig>

</FilterableTable>

---

## Part 2: Validation

Comparison between **Pithos (Kanon)** and schema validation libraries: Zod, Valibot, ArkType, and Yup.

:::note
Kanon is Pithos's validation module, designed for maximum tree-shaking and minimal bundle size. Unlike class-based validators, Kanon uses pure functions that can be individually imported.
:::

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos (Kanon) | !Status | Zod | Valibot | ArkType | Yup |
|-----------------|---------|-----|---------|---------|-----|
| `string` | ✅ | `z.string()` | `v.string()` | `type("string")` | `yup.string()` |
| `number` | ✅ | `z.number()` | `v.number()` | `type("number")` | `yup.number()` |
| `boolean` | ✅ | `z.boolean()` | `v.boolean()` | `type("boolean")` | `yup.boolean()` |
| `bigint` | ✅ | `z.bigint()` | `v.bigint()` | `type("bigint")` | - |
| `date` | ✅ | `z.date()` | `v.date()` | `type("Date")` | `yup.date()` |
| `symbol` | ✅ | `z.symbol()` | `v.symbol()` | `type("symbol")` | - |
| `undefined` | ✅ | `z.undefined()` | `v.undefined()` | `type("undefined")` | - |
| `null` | ✅ | `z.null()` | `v.null()` | `type("null")` | - |
| `void` | ✅ | `z.void()` | `v.void()` | `type("void")` | - |
| `any` | ✅ | `z.any()` | `v.any()` | `type("unknown")` | `yup.mixed()` |
| `unknown` | ✅ | `z.unknown()` | `v.unknown()` | `type("unknown")` | `yup.mixed()` |
| `never` | ✅ | `z.never()` | `v.never()` | `type("never")` | - |
| `literal` | ✅ | `z.literal()` | `v.literal()` | `type("'value'")` | - |
| `object` | ✅ | `z.object()` | `v.object()` | `type({})` | `yup.object()` |
| `array` | ✅ | `z.array()` | `v.array()` | `type("T[]")` | `yup.array()` |
| `tuple` | ✅ | `z.tuple()` | `v.tuple()` | `type(["T", "U"])` | `yup.tuple()` |
| `union` | ✅ | `z.union()` | `v.union()` | `type("T\|U")` | - |
| `discriminatedUnion` | ✅ | `z.discriminatedUnion()` | `v.variant()` | - | - |
| `intersection` | ✅ | `z.intersection()` | `v.intersect()` | `type("T&U")` | - |
| `record` | ✅ | `z.record()` | `v.record()` | `type("Record<K,V>")` | - |
| `map` | ✅ | `z.map()` | `v.map()` | - | - |
| `set` | ✅ | `z.set()` | `v.set()` | - | - |
| `enum` | ✅ | `z.enum()` | `v.enum()` | `type("'a'\|'b'")` | - |
| `nativeEnum` | ✅ | `z.nativeEnum()` | `v.enum()` | - | - |
| `optional` | ✅ | `.optional()` | `v.optional()` | `type("T?")` | `.optional()` |
| `nullable` | ✅ | `.nullable()` | `v.nullable()` | `type("T\|null")` | `.nullable()` |
| `nullish` | ✅ | `.nullish()` | `v.nullish()` | - | - |
| `default` | ✅ | `.default()` | `v.optional(_, default)` | - | `.default()` |
| `catch` | ✅ | `.catch()` | `v.fallback()` | - | - |
| `transform` | ✅ | `.transform()` | `v.transform()` | `.pipe()` | `.transform()` |
| `refine` | ✅ | `.refine()` | `v.check()` | `.narrow()` | `.test()` |
| `superRefine` | ✅ | `.superRefine()` | `v.rawCheck()` | - | - |
| `pipe` | ✅ | `.pipe()` | `v.pipe()` | `.pipe()` | - |
| `coerce` | ✅ | `z.coerce.*` | `v.pipe(v.unknown(), v.transform())` | - | - |
| `parse` | ✅ | `.parse()` | `v.parse()` | `type()` | `.validateSync()` |
| `safeParse` | ✅ | `.safeParse()` | `v.safeParse()` | - | - |
| `parseAsync` | ✅ | `.parseAsync()` | `v.parseAsync()` | - | `.validate()` |
| `safeParseAsync` | ✅ | `.safeParseAsync()` | `v.safeParseAsync()` | - | - |
| `brand` | ✅ | `.brand()` | `v.brand()` | - | - |
| `readonly` | ✅ | `.readonly()` | `v.readonly()` | - | - |
| `lazy` | ✅ | `z.lazy()` | `v.lazy()` | - | `yup.lazy()` |
| `promise` | ✅ | `z.promise()` | - | - | - |
| `function` | ✅ | `z.function()` | `v.function()` | - | - |
| `instanceof` | ✅ | `z.instanceof()` | `v.instance()` | `type("instanceof X")` | - |
| `preprocess` | ✅ | `z.preprocess()` | `v.pipe()` | - | - |
| `custom` | ✅ | `z.custom()` | `v.custom()` | - | - |

</TableConfig>

---

## Part 3: Error Handling

Comparison between **Pithos (Zygos)** and functional error handling libraries: neverthrow, fp-ts, Effect, and ts-results.

:::note About Effect
Effect is a comprehensive functional programming ecosystem, not just an error handling library. It includes its own runtime, dependency injection, concurrency primitives, and much more. We compare only the error handling primitives here (`Option`, `Either`, `Effect`).
:::

### Option / Maybe

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos (Zygos) | !Status | fp-ts | Effect | neverthrow | ts-results |
|-----------------|---------|-------|--------|------------|------------|
| `Option<A>` | ✅ | `Option<A>` | `Option<A>` | - | `Option<T>` |
| `Some<A>` | ✅ | `Some<A>` | `Some<A>` | - | `Some<T>` |
| `None` | ✅ | `None` | `None` | - | `None` |
| `some(a)` | ✅ | `O.some(a)` | `Option.some(a)` | - | `Some(a)` |
| `none` | ✅ | `O.none` | `Option.none()` | - | `None` |
| `isSome` | ✅ | `O.isSome` | `Option.isSome` | - | `.some` |
| `isNone` | ✅ | `O.isNone` | `Option.isNone` | - | `.none` |
| `fromNullable` | ✅ | `O.fromNullable` | `Option.fromNullable` | - | - |
| `fromPredicate` | ✅ | `O.fromPredicate` | `Option.filter` | - | - |
| `map` | ✅ | `O.map` | `Option.map` | - | `.map()` |
| `flatMap` / `chain` | ✅ | `O.flatMap` / `O.chain` | `Option.flatMap` | - | `.andThen()` |
| `match` / `fold` | ✅ | `O.match` / `O.fold` | `Option.match` | - | `.match()` |
| `getOrElse` | ✅ | `O.getOrElse` | `Option.getOrElse` | - | `.unwrapOr()` |
| `orElse` / `alt` | ✅ | `O.orElse` / `O.alt` | `Option.orElse` | - | `.or()` |
| `filter` | ✅ | `O.filter` | `Option.filter` | - | - |
| `toNullable` | ✅ | `O.toNullable` | `Option.getOrNull` | - | - |
| `toUndefined` | ✅ | `O.toUndefined` | `Option.getOrUndefined` | - | - |
| `flatten` | ✅ | `O.flatten` | `Option.flatten` | - | - |
| `tryCatch` | ✅ | `O.tryCatch` | `Option.liftThrowable` | - | - |

</TableConfig>

### Either / Result

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos (Zygos) | !Status | fp-ts | Effect | neverthrow | ts-results |
|-----------------|---------|-------|--------|------------|------------|
| `Either<E, A>` | ✅ | `Either<E, A>` | `Either<L, R>` | - | - |
| `Result<T, E>` | ✅ | - | `Exit<A, E>` | `Result<T, E>` | `Result<T, E>` |
| `Left<E>` / `Err` | ✅ | `Left<E>` | `Either.left` | `Err<E>` | `Err<E>` |
| `Right<A>` / `Ok` | ✅ | `Right<A>` | `Either.right` | `Ok<T>` | `Ok<T>` |
| `left(e)` / `err(e)` | ✅ | `E.left(e)` | `Either.left(e)` | `err(e)` | `Err(e)` |
| `right(a)` / `ok(a)` | ✅ | `E.right(a)` | `Either.right(a)` | `ok(a)` | `Ok(a)` |
| `isLeft` / `isErr` | ✅ | `E.isLeft` | `Either.isLeft` | `.isErr()` | `.err` |
| `isRight` / `isOk` | ✅ | `E.isRight` | `Either.isRight` | `.isOk()` | `.ok` |
| `map` | ✅ | `E.map` | `Either.map` | `.map()` | `.map()` |
| `mapLeft` / `mapErr` | ✅ | `E.mapLeft` | `Either.mapLeft` | `.mapErr()` | `.mapErr()` |
| `flatMap` / `andThen` | ✅ | `E.flatMap` / `E.chain` | `Either.flatMap` | `.andThen()` | `.andThen()` |
| `match` / `fold` | ✅ | `E.match` / `E.fold` | `Either.match` | `.match()` | `.match()` |
| `getOrElse` | ✅ | `E.getOrElse` | `Either.getOrElse` | `.unwrapOr()` | `.unwrapOr()` |
| `orElse` | ✅ | `E.orElse` | `Either.orElse` | `.orElse()` | `.or()` |
| `fromNullable` | ✅ | `E.fromNullable` | - | - | - |
| `fromPredicate` | ✅ | `E.fromPredicate` | - | - | - |
| `tryCatch` | ✅ | `E.tryCatch` | `Effect.try` | `Result.fromThrowable` | - |
| `fromOption` | ✅ | `E.fromOption` | - | - | - |
| `toUnion` | ✅ | `E.toUnion` | `Either.merge` | - | - |
| `swap` | ✅ | `E.swap` | `Either.flip` | - | - |
| `filterOrElse` | ✅ | `E.filterOrElse` | - | - | - |
| `Do` notation | ✅ | `E.Do` | `Effect.gen` | - | - |
| `bind` | ✅ | `E.bind` | - | - | - |
| `apS` | ✅ | `E.apS` | - | - | - |

</TableConfig>

### Task / Async

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

| !Pithos (Zygos) | !Status | fp-ts | Effect | neverthrow | ts-results |
|-----------------|---------|-------|--------|------------|------------|
| `Task<A>` | ✅ | `Task<A>` | `Effect<A>` | - | - |
| `TaskEither<E, A>` | ✅ | `TaskEither<E, A>` | `Effect<A, E>` | - | - |
| `ResultAsync<T, E>` | ✅ | - | `Effect<A, E>` | `ResultAsync<T, E>` | `ResultAsync<T, E>` |
| `okAsync(a)` | ✅ | `TE.right(a)` | `Effect.succeed(a)` | `okAsync(a)` | - |
| `errAsync(e)` | ✅ | `TE.left(e)` | `Effect.fail(e)` | `errAsync(e)` | - |
| `fromPromise` | ✅ | `TE.tryCatch` | `Effect.tryPromise` | `ResultAsync.fromPromise` | - |
| `fromSafePromise` | ✅ | `T.fromIO` | `Effect.promise` | `ResultAsync.fromSafePromise` | - |
| `map` (async) | ✅ | `TE.map` | `Effect.map` | `.map()` | - |
| `mapErr` (async) | ✅ | `TE.mapLeft` | `Effect.mapError` | `.mapErr()` | - |
| `andThen` (async) | ✅ | `TE.flatMap` / `TE.chain` | `Effect.flatMap` | `.andThen()` | - |
| `match` (async) | ✅ | `TE.match` / `TE.fold` | `Effect.match` | `.match()` | - |
| `unwrapOr` (async) | ✅ | `TE.getOrElse` | `Effect.orElseSucceed` | `.unwrapOr()` | - |
| `combine` | ✅ | `A.sequence(TE.ApplicativePar)` | `Effect.all` | `Result.combine` | - |
| `safeTry` | ✅ | - | `Effect.gen` | `safeTry` | - |

</TableConfig>

### Concurrency Primitives

<TableConfig stickyHeader stickyHeaderOffset={120} columns={{ "Status": { width: "40px", hideHeader: true } }}>

|--------------------|---------|-------|--------|------------|---------|
| `withMutex` | ✅ | - | `Mutex` | - | - |
| `Semaphore` | ✅ | - | `Semaphore` | - | `Semaphore` |
| - | ❌ | - | `Queue` | - | - |
| - | ❌ | - | `Deferred` | - | - |
| - | ❌ | - | `PubSub` | - | - |

</TableConfig>
