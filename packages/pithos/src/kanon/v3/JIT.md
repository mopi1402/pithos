# Kanon V3 JIT Compiler

Just-In-Time compilation system for the Kanon V3 validation library. Generates optimized JavaScript code on-the-fly to significantly improve validation performance.

## Performance

| Scenario | V3 Non-Compiled | JIT Compiled | Fastest-Validator | JIT vs V3 |
|----------|-----------------|--------------|-------------------|-----------|
| Valid objects | 12.6M ops/s | 23.6M ops/s | 19.3M ops/s | **1.88x** |
| Invalid objects | 13.1M ops/s | 23.5M ops/s | 3.1M ops/s | **1.80x** |

*Benchmark on an object schema with 5 properties (string, number, boolean, string, number)*

## Usage

```typescript
import { compile, isJITAvailable, clearCache } from "@kanon/v3";
import { object, string, number } from "@kanon/v3";

// Define a schema
const userSchema = object({
  name: string().minLength(1),
  age: number().min(0),
});

// Compile the schema
const validate = compile(userSchema);

// Validate data
validate({ name: "John", age: 30 }); // true
validate({ name: "", age: 30 });     // "Property 'name': String must be at least 1 character"
validate({ name: "John", age: -5 }); // "Property 'age': Number must be at least 0"
```

### Debug Mode

```typescript
const validate = compile(userSchema, { debug: true });

// Inspect generated code
console.log(validate.source);
// if (typeof value !== "object" || value === null) return "Expected object";
// var v_0 = value["name"];
// if (typeof v_0 !== "string") return "Property 'name': Expected string";
// ...
```

### Check Availability

```typescript
if (isJITAvailable()) {
  const validate = compile(schema);
} else {
  // Fallback to non-compiled validator
  const validate = schema.validator;
}
```

## Architecture

```
jit/
├── compiler.ts          # Entry point, compile() function
├── cache.ts             # WeakMap cache for compiled validators
├── context.ts           # Generation context (variables, path, externals)
├── builders/
│   ├── primitives/      # string, number, boolean, null, undefined, etc.
│   ├── composites/      # object, array
│   ├── operators/       # union
│   ├── refinements.ts   # Custom refinements support
│   └── coerce.ts        # Coercion support
└── utils/
    └── code.ts          # Code generation utilities
```

## Design Principles

1. **Opt-in**: JIT compilation is explicitly enabled via `compile()`, preserving existing `schema.validator()` behavior

2. **Aggressive inlining**: All constraint checks are inlined in generated code, eliminating intermediate function calls

3. **Smart caching**: Compiled validators are cached via WeakMap, allowing garbage collection of unreferenced schemas

4. **Full compatibility**: API and TypeScript inference remain identical

5. **Graceful fallback**: On failure (CSP, etc.), silent fallback to non-compiled V3 validator

## Limitations

### Strict CSP Environments

`new Function()` is blocked in certain environments:
- Sites with restrictive Content Security Policy (without `'unsafe-eval'`)
- Some bundlers with strict configurations
- Some Web Worker contexts

**Impact**: JIT won't work. Fallback to non-compiled V3 is automatic and transparent.

```typescript
const validate = compile(schema);
if (validate.isFallback) {
  console.log("JIT unavailable, using V3 validator");
}
```

### Custom Refinements

User refinements (custom functions) cannot be inlined because their source code is not accessible. They are called as external functions via an externals Map.

**Impact**: Performance gains are reduced proportionally to the number of refinements.

## Supported Types

### Primitives
- `string()` with constraints: minLength, maxLength, email, regex, includes, startsWith, endsWith
- `number()` with constraints: min, max, positive, negative, int, multipleOf
- `boolean()`
- `null()`, `undefined()`, `any()`, `unknown()`, `never()`, `void()`, `symbol()`

### Composites
- `object()` with required and optional properties
- `strictObject()` with extra keys verification
- `array()` with constraints: minLength, maxLength, length

### Operators
- `union()` with typeof optimization for primitives

### Coercion
- `coerce.string()`, `coerce.number()`, `coerce.boolean()`, `coerce.date()`

## API

### `compile<T>(schema, options?)`

Compiles a schema into an optimized validator.

```typescript
interface CompileOptions {
  debug?: boolean;      // Include source code in validator.source
  noCache?: boolean;    // Disable cache for this compilation
  forceFallback?: boolean; // Force V3 fallback (for testing)
}

interface CompiledValidator<T> {
  (value: unknown): true | string | { coerced: T };
  source?: string;      // Source code (if debug: true)
  isFallback?: boolean; // true if V3 fallback
}
```

### `isJITAvailable()`

Checks if `new Function()` is available in the current environment.

### `clearCache()`

Clears the global compiled validators cache.

## Generated Code Example

For the schema:
```typescript
object({
  name: string().minLength(1),
  age: number().min(0).int(),
})
```

Generated code (debug mode):
```javascript
// JIT-compiled validator for schema type: object
// Type check: object
if (typeof value !== "object" || value === null) return "Expected object";
// Property: name
var v_0 = value["name"];
// Type check: string
if (typeof v_0 !== "string") return "Property 'name': Expected string";
// Constraint: minLength(1)
if (v_0.length < 1) return "Property 'name': String must be at least 1 character";
// Property: age
var v_1 = value["age"];
// Type check: number
if (typeof v_1 !== "number" || Number.isNaN(v_1)) return "Property 'age': Expected number";
// Constraint: min(0)
if (v_1 < 0) return "Property 'age': Number must be at least 0";
// Constraint: int
if (!Number.isInteger(v_1)) return "Property 'age': Number must be an integer";
// Validation passed
return true;
```
