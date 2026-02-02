# Performance Benchmarks

This package contains compiled performance benchmarks for Kanon optimization decisions.

## Overview

These benchmarks use **compiled TypeScript** to provide accurate performance measurements with proper optimizations, unlike the previous `tsx`-based tests that didn't benefit from compilation optimizations.

## Structure

```
src/
├── benchmarks.ts                    # Main benchmark runner
├── type-guards-vs-typeof.ts        # Type Guards vs typeof test
├── messages-arrow-functions-vs-strings.ts # Messages Arrow Functions vs Strings test
└── as-any-vs-proper-types.ts       # as any vs Proper Types test
```

## Usage

### Install dependencies

```bash
npm install
```

### Build benchmarks

```bash
npm run build
```

### Run all benchmarks

```bash
npm run benchmark
```

### Run individual benchmarks

```bash
npm run benchmark:type-guards
npm run benchmark:messages
npm run benchmark:as-any
```

## Key Differences from Previous Tests

### ✅ **Compiled TypeScript**

- Uses `tsc` compilation with optimizations
- Generates optimized JavaScript output
- Accurate performance measurements

### ✅ **Proper Project Structure**

- Real npm package with dependencies
- TypeScript configuration with optimizations
- Build pipeline for consistent results

### ✅ **Node.js Execution**

- Runs compiled JavaScript with `node`
- Benefits from V8 optimizations
- More realistic performance environment

## Results Summary

| Optimization                      | Performance Gain | Justification                           |
| --------------------------------- | ---------------- | --------------------------------------- |
| Direct `typeof` vs Type Guards    | Variable         | Function call overhead eliminated       |
| Direct strings vs Arrow functions | Significant      | No function call overhead               |
| Proper types vs `as any`          | Minimal impact   | Better type safety with negligible cost |

## Technical Details

- **Target**: ES2022 with ESNext modules
- **Compiler**: TypeScript 5+ with strict mode
- **Runtime**: Node.js 18+ with V8 optimizations
- **Iterations**: Optimized for accurate measurements

## Justification

These benchmarks serve as evidence for optimization decisions and can be referenced when:

- Justifying performance choices in code reviews
- Documenting optimization rationale
- Comparing different approaches
- Validating performance improvements

## Notes

- Tests use realistic scenarios similar to actual Kanon usage
- Results may vary based on JavaScript engine and hardware
- Tests focus on hot paths where performance matters most
- All optimizations maintain the same functionality while improving performance
- **Compiled benchmarks provide accurate measurements unlike interpreted TypeScript**




