## `flowRight`

### **Data Transformation** pipelines (right-to-left) 📍

@keywords: compose, pipeline, transformation, functional, right-to-left

Compose functions from right to left (traditional compose).
Essential for mathematical function composition.

```typescript
import { flowRight } from "pithos/arkhe/function/flow-right";

const double = (x: number) => x * 2;
const addOne = (x: number) => x + 1;
const square = (x: number) => x * x;

// Reads right-to-left: square, then addOne, then double
const transform = flowRight(double, addOne, square);

console.log(transform(3)); // double(addOne(square(3))) = double(addOne(9)) = double(10) = 20
```

### **String Processing** chains 📍

@keywords: string, processing, compose, text, transformation

Compose string transformations in logical order.
Critical for text processing pipelines.

```typescript
import { flowRight } from "pithos/arkhe/function/flow-right";

const trim = (s: string) => s.trim();
const toLowerCase = (s: string) => s.toLowerCase();
const removeSpaces = (s: string) => s.replace(/\s+/g, "-");

// Create a slug generator: removeSpaces(toLowerCase(trim(input)))
const slugify = flowRight(removeSpaces, toLowerCase, trim);

console.log(slugify("  Hello World  ")); // "hello-world"
console.log(slugify(" My Blog Post ")); // "my-blog-post"
```

### **Validation Chains** composition

@keywords: validation, chain, compose, middleware, checks

Compose validators that run in sequence.
Important for form and data validation.

```typescript
import { flowRight } from "pithos/arkhe/function/flow-right";

type ValidationResult = { valid: boolean; errors: string[] };

const checkRequired = (field: string) => (result: ValidationResult) => ({
  ...result,
  valid: result.valid && field.length > 0,
  errors: field.length === 0 ? [...result.errors, "Required"] : result.errors,
});

const checkMinLength = (min: number) => (field: string) => (result: ValidationResult) => ({
  ...result,
  valid: result.valid && field.length >= min,
  errors: field.length < min ? [...result.errors, `Min ${min} chars`] : result.errors,
});

// Compose validators (right-to-left execution)
const validateUsername = (username: string) => {
  const validate = flowRight(
    checkMinLength(3)(username),
    checkRequired(username)
  );
  return validate({ valid: true, errors: [] });
};

console.log(validateUsername("ab")); // { valid: false, errors: ["Min 3 chars"] }
```
