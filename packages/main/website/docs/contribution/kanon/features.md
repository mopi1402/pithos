---
sidebar_position: 4
title: "Features & API"
description: "Complete features and API reference for Kanon V3. Pure functional validation, fast paths, singleton pattern, and early abort optimization."
slug: "features"
---

# Kanon V3 - Complete Features

## Overview

Kanon V3 is a TypeScript validation library with a pure functional architecture, optimized for performance with fast paths, singleton pattern, and early abort.

### Core Principle: Pure Validation, No Transformation

**Kanon V3 validates data but does not transform it.** Upon successful validation, data is returned as-is, without modification. "Transform" functions (`partial`, `pick`, `omit`, `required`, `keyof`) transform the validation schema structure, not the data itself.

- ✅ **Validation**: Verifies that data matches the schema
- ❌ **Transformation**: Does not modify data (no `.transform()`, `.preprocess()`, `.trim()`, `.toLowerCase()`, etc.)
- 📝 **Coercion**: `coerce*` functions convert the type before validation, but don't modify the structure of validated data

:::info Why no transformations?
This is a deliberate architectural choice. Validation and transformation are different concerns that should be handled separately. See [Why No Transformations?](./no-transformations.md) for the full rationale.
:::

## Primitive Types

### Basic Types

- **`string(message?)`** - String validation
- **`number(message?)`** - Number validation
- **`int(message?)`** - Integer validation
- **`boolean(message?)`** - Boolean validation
- **`null_(message?)`** - Null value validation
- **`undefined_(message?)`** - Undefined value validation
- **`bigint(message?)`** - BigInt validation
- **`date(message?)`** - Date validation
- **`symbol(message?)`** - Symbol validation
- **`any(message?)`** - Accepts any type (message ignored but accepted for API consistency)
- **`unknown(message?)`** - Unknown type (safe, message ignored but accepted for API consistency)
- **`never(message?)`** - Type that never accepts a value
- **`void_(message?)`** - Void type

## String Constraints

### Format Validations

- **`.minLength(min, errorMessage?)`** - Minimum length
- **`.maxLength(max, errorMessage?)`** - Maximum length
- **`.length(length, errorMessage?)`** - Exact length
- **`.email(errorMessage?)`** - Email validation (regex)
- **`.url(errorMessage?)`** - URL validation (regex)
- **`.uuid(errorMessage?)`** - UUID validation (regex)
- **`.pattern(regex, errorMessage?)`** - Regular expression validation
- **`.includes(substring, errorMessage?)`** - Contains substring
- **`.startsWith(prefix, errorMessage?)`** - Starts with prefix
- **`.endsWith(suffix, errorMessage?)`** - Ends with suffix

## Number Constraints

- **`.min(minValue, errorMessage?)`** - Minimum value
- **`.max(maxValue, errorMessage?)`** - Maximum value
- **`.int(errorMessage?)`** - Integer number
- **`.positive(errorMessage?)`** - Strictly positive number
- **`.negative(errorMessage?)`** - Strictly negative number
- **`.lt(lessThan, errorMessage?)`** - Less than (strictly)
- **`.lte(lessThanOrEqual, errorMessage?)`** - Less than or equal
- **`.gt(greaterThan, errorMessage?)`** - Greater than (strictly)
- **`.gte(greaterThanOrEqual, errorMessage?)`** - Greater than or equal
- **`.multipleOf(multiple, errorMessage?)`** - Multiple of a number

## Array Constraints

- **`.minLength(min, errorMessage?)`** - Minimum length
- **`.maxLength(max, errorMessage?)`** - Maximum length
- **`.length(length, errorMessage?)`** - Exact length
- **`.unique(errorMessage?)`** - Unique elements (no duplicates)

## Date Constraints

- **`.min(minDate, errorMessage?)`** - Minimum date
- **`.max(maxDate, errorMessage?)`** - Maximum date
- **`.before(beforeDate, errorMessage?)`** - Before a date
- **`.after(afterDate, errorMessage?)`** - After a date

## BigInt Constraints

- **`.min(minValue, errorMessage?)`** - Minimum value
- **`.max(maxValue, errorMessage?)`** - Maximum value
- **`.positive(errorMessage?)`** - Strictly positive BigInt
- **`.negative(errorMessage?)`** - Strictly negative BigInt

## Object Constraints

- **`.minKeys(min, errorMessage?)`** - Minimum number of keys
- **`.maxKeys(max, errorMessage?)`** - Maximum number of keys
- **`.strict(errorMessage?)`** - Validates that the object contains only properties defined in the schema (rejects additional properties)

## Composite Types

### Collections

- **`array(itemSchema, message?)`** - Array of validated elements

  - **`.minLength(min, errorMessage?)`** - Minimum length
  - **`.maxLength(max, errorMessage?)`** - Maximum length
  - **`.length(length, errorMessage?)`** - Exact length
  - **`.unique(errorMessage?)`** - Unique elements

- **`tuple(schemas, message?)`** - Typed tuple with schemas for each position

  - Variants: `tupleOf(schema1, schema2, message?)`, `tupleOf3(schema1, schema2, schema3, message?)`, `tupleOf4(schema1, schema2, schema3, schema4, message?)`
  - **`tupleWithRest(schemas, restSchema, message?)`** - Tuple with rest schema for variadic tuples

- **`record(keySchema, valueSchema, message?)`** - Object with validated keys and values

- **`map(keySchema, valueSchema, message?)`** - Map with validated keys and values
  
  - **`.minSize(min, errorMessage?)`** - Minimum size
  - **`.maxSize(max, errorMessage?)`** - Maximum size

- **`set(itemSchema, message?)`** - Set with validated elements
  
  - **`.minSize(min, errorMessage?)`** - Minimum size
  - **`.maxSize(max, errorMessage?)`** - Maximum size

### Objects

- **`object(shape, message?)`** - Object with defined schema

  - Validates each property according to its schema
  - Support for optional properties via `optional(schema)` on the property schema

- **`strictObject(shape, message?)`** - Strict object (rejects additional properties)
  
  **Note**: `strictObject()` and `object().strict()` produce the same behavior. Use `strictObject()` to directly create a strict object, or `object().strict()` for method chaining.

- **`looseObject(shape, message?)`** - Permissive object (accepts additional properties)

### Object Manipulation (Schema Transformations)

These functions transform the **validation schema structure**, not the data itself. They allow creating new schemas from existing schemas. Validated data is returned as-is, without transformation.

**Important**: These functions transform the schema, not the data. For example, `pick(schema, ['name'])` validates only the `name` property, but returns the complete object with all its properties if validation succeeds.

- **`partial(objectSchema, message?)`** - Makes all properties optional

- **`required(objectSchema, message?)`** - Makes all properties required

- **`pick(objectSchema, keys, message?)`** - Selects certain properties

- **`omit(objectSchema, keys, message?)`** - Excludes certain properties

- **`keyof(objectSchema, message?)`** - Keys of an object schema

  - Automatically extracts keys from the object schema passed as parameter
  - Type-safe: preserves the type of object keys (`keyof T & string`)

### Unions and Intersections

- **`unionOf(schema1, schema2, message?)`** - Union of two schemas (OR)

  - Variants: `unionOf3(schema1, schema2, schema3, message?)`, `unionOf4(schema1, schema2, schema3, schema4, message?)`
  - **Note**: For more than two schemas, use typed variants or create multiple nested unions

- **`intersection(schema1, schema2, message?)`** - Intersection of two schemas (AND)

  - Variant: `intersection3(schema1, schema2, schema3, message?)` for three schemas

### Special Types

- **`literal(value, message?)`** - Exact literal value (string, number, boolean, null)

- **`enum_(values, message?)`** - String enum

  - Variants: `numberEnum(values, message?)`, `booleanEnum(values, message?)`, `mixedEnum(values, message?)`

- **`nativeEnum(enumObj, message?)`** - Native TypeScript enum

### Advantages Over Zod

Kanon offers specialized functions for number, boolean, and mixed enums, which is **more concise and performant** than Zod:

**In Zod** (more verbose):

```typescript
// Number enum
const status = z.union([z.literal(100), z.literal(200), z.literal(300)]);

// Boolean enum
const flag = z.union([z.literal(true), z.literal(false)]);

// Mixed enum
const value = z.union([z.literal("red"), z.literal(42), z.literal(true)]);
```

**In Kanon** (more concise and expressive):

```typescript
// Number enum - More concise!
const status = numberEnum([100, 200, 300] as const);

// Boolean enum - More concise!
const flag = booleanEnum([true, false] as const);

// Mixed enum - More concise!
const value = mixedEnum(["red", 42, true] as const);
```

**Kanon Advantages**:

- ✅ **More concise**: `numberEnum([1, 2, 3])` vs `z.union([z.literal(1), z.literal(2), z.literal(3)])`
- ✅ **Better type inference**: TypeScript directly infers `1 | 2 | 3` without going through `z.infer`
- ✅ **Dedicated API**: Specialized functions instead of generic composition
- ✅ **Optimized performance**: Implementation via shared and optimized `createEnumSchema()`

## Wrappers

### Nullability Modifiers

- **`optional(schema)`** - Makes the schema optional (accepts `undefined`)

- **`nullable(schema, message?)`** - Makes the schema nullable (accepts `null`)

- **`default_(schema, defaultValue, message?)`** - Default value if missing

  - Support for function for dynamic default value
  - Helper: `DefaultValues` for common default values

### Other Wrappers

- **`readonly(schema, message?)`** - Marks as readonly

- **`lazy(factory, message?)`** - Lazy schema (lazy evaluation) for circular references

## Refinements

Refinements are used internally by constraints (`.minLength()`, `.email()`, etc.). Constraints automatically add refinements to the schema via the `refineString()`, `refineNumber()`, `refineArray()`, `refineObject()`, `refineDate()`, `refineBigInt()` functions.

Schemas support a `refinements` property that stores custom validations, but there is no public `.refine()` method for direct chaining.

## Coercion (Automatic Conversion)

Coercion functions convert the input type before validation, but don't modify the structure of validated data. They are useful for accepting flexible formats (e.g., string "123" → number 123).

- **`coerceString(message?)`** - Coerce to string
- **`coerceNumber(message?)`** - Coerce to number
- **`coerceBoolean()`** - Coerce to boolean (no message parameter)
- **`coerceBigInt(message?)`** - Coerce to bigint
- **`coerceDate(message?)`** - Coerce to date

**Note**: Coercion converts the type, but the data returned after validation is the converted data, not transformed (no structure modification, no normalization).

## Parsing

### Synchronous Methods

- **`parse(schema, input)`** - Parse and return `{ success: true, data: T } | { success: false, error: string }`

### Bulk Validation

- **`parseBulk(schema, values, options?)`** - Bulk validation

  - `earlyAbort` option: stops at first error (fast mode)
  - Without `earlyAbort`: collects all errors (complete mode)
  - Returns `{ success: true, data: T[] } | { success: false, errors: string[] | string }`

## Error Handling

### Error Structure

V3 uses a simplified error system:

- Error messages as `string` (no complex objects)
- Constant messages to optimize performance
- Customizable messages via the `errorMessage?` parameter of each constraint

### Advantages

- **Performance**: No allocation of complex error objects
- **Simplicity**: Directly readable error messages
- **Flexibility**: Customizable messages per constraint

## Type Inference

### Utility Types

TypeScript types are automatically inferred from schemas:

- Automatic output type inference
- TypeScript extensions for fluent API
- Specialized types for each constraint (`StringConstraint`, `NumberConstraint`, etc.)

## Chaining API

Schemas with constraints support method chaining for constraints:

```typescript
const schema = string().minLength(5).maxLength(100).email();
```

**Note**: Wrappers (`optional()`, `nullable()`, `default_()`) are separate functions, not chaining methods:

```typescript
const schema = optional(
  default_(string().minLength(5).email(), "default@example.com")
);
```

## Usage Examples

### Simple Schema

```typescript
import { string, number, object, optional } from "@kanon";

const userSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
  email: string().email(),
  phone: optional(string()), // Optional property
});
```

### Strict Schema (Rejects Additional Properties)

```typescript
import { string, number, object, strictObject } from "@kanon";

// Method 1: Use .strict() to make an object strict (chaining)
const strictSchema = object({
  name: string(),
  age: number(),
}).strict();

// Method 2: Use strictObject() directly (equivalent)
const strictSchema2 = strictObject({
  name: string(),
  age: number(),
});

// Both produce the same behavior: reject additional properties
parse(strictSchema, { name: "John", age: 30, extra: "value" }); // ❌ Error
parse(strictSchema2, { name: "John", age: 30, extra: "value" }); // ❌ Error

// Use strictObject() to directly create a strict object,
// or object().strict() if you need to chain other methods before
const strictWithConstraints = object({
  name: string(),
  age: number(),
}).minKeys(1).strict();
```

### Complex Schema

```typescript
import { string, number, object, array, record, unionOf } from "@kanon";

const complexSchema = object({
  id: string().uuid(),
  profile: object({
    firstName: string().minLength(1),
    lastName: string().minLength(1),
  }),
  tags: array(string()).minLength(1),
  metadata: record(string(), unionOf(string(), number())),
});
```

### Union and Intersection

```typescript
import { string, number, unionOf, intersection, object } from "@kanon";

const stringOrNumber = unionOf(string(), number());

const userWithId = intersection(
  object({ id: string() }),
  object({ name: string() })
);
```

### Lazy Evaluation

```typescript
import { string, array, object, lazy } from "@kanon";

type Node = {
  value: string;
  children: Node[];
};

const nodeSchema = lazy(() =>
  object({
    value: string(),
    children: array(nodeSchema),
  })
);
```

### Bulk Validation with Early Abort

```typescript
import { string, parseBulk } from "@kanon";

const schema = string().email();
const emails = ["valid@example.com", "invalid", "another@example.com"];

// Fast mode: stops at first error
const result = parseBulk(schema, emails, { earlyAbort: true });
if (!result.success) {
  console.log(result.errors); // "Index 1: Invalid email format"
}
```

## Architecture

### Pure Functional Pattern

V3 uses pure functions for each schema type:

- No classes, only functions
- Validation via `validator: (value: unknown) => true | string`
- Simple composition via TypeScript extensions

### Performance Optimizations

- **Fast paths**: Explicit optimizations for common cases
- **Singleton pattern**: Reduction of memory allocations
- **Early abort**: Immediate stop on first error in bulk validation
- **Constant messages**: Avoids string interpolation on each validation
- **Inlining**: Functions marked `/*@__INLINE__*/` for compiler optimization

### Schema Structure

Each schema exposes:

- `type: SchemaType` - Validation type (e.g., "string", "array", "object")
- `message?: string` - Optional custom error message
- `refinements?: Array<(value: T) => true | string>` - Custom validations
- `validator: (value: unknown) => true | string` - Validation function
- Composition properties depending on type (`entries`, `item`, `schemas`, `keySchema`, `valueSchema`, `itemSchema`, etc.)

### Fluent Extensions

Constraints are added via TypeScript extensions:

- `StringSchema & StringExtension` → `StringConstraint`
- `NumberSchema & NumberExtension` → `NumberConstraint`
- `ArraySchema & ArrayExtension` → `ArrayConstraint`
- etc.

This enables a fluent API with complete TypeScript autocompletion.

## Known Limitations

### Unsupported Features

- **Async parsing**: No native support for `parseAsync()` or `safeParseAsync()`. Use `parse()` and `parseBulk()` which are synchronous but optimized.
- **Nested error path**: Error messages don't contain structured error path (no `path` array). Errors are simple strings.
- **String transformations**: No `.toLowerCase()`, `.toUpperCase()`, `.trim()` methods like in V1. Use custom refinements if needed.

## Differences with V1

### Architecture

- **V1**: Classes with mutable chaining
- **V3**: Pure functions with TypeScript extensions

### Error Handling

- **V1**: Complex `PithosIssue` objects with codes and paths
- **V3**: Simple error messages (`string`)

### Performance

- **V1**: Baseline
- **V3**: +200% vs V1 thanks to fast paths and singleton pattern

### Parsing

- **V1**: `parse()`, `safeParse()`, `parseAsync()`, `safeParseAsync()`
- **V3**: `parse()` and `parseBulk()` (no native async support, but early abort to optimize)

### Flexibility

- **V1**: Complete fluent API but more rigid architecture
- **V3**: Fluent API with natural composition and extensibility via TypeScript extensions

### Wrappers

- **V1**: Chaining methods (`.optional()`, `.nullable()`, `.default()`)
- **V3**: Separate functions (`optional()`, `nullable()`, `default_()`) that take a schema as parameter

## Next Steps

- [Architecture & Evolution](./architecture.md) - Learn about the V1→V2→V3 evolution
- [Design Innovations](./innovations.md) - Explore theoretical evolutions and why they were abandoned
- [API Reference](/api/kanon) - Detailed API documentation
