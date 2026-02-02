## `flip`

### **Create natural** APIs 📍

@keywords: natural, APIs, parameters, reverse, readability, intuitive

Reverse function parameters to create more intuitive and readable function interfaces.
Essential for API design and improving code readability.

```typescript
const greet = (name, greeting) => `${greeting}, ${name}!`;
const greetReverse = flip(greet);

greetReverse("Hello", "World"); // "Hello, World!" (flipped)
```

### **Enable currying** patterns

@keywords: currying, patterns, functional, partial, composition, reusable

Reverse parameters to enable currying and partial application for functional programming.
Critical for functional programming and creating reusable function components.

```typescript
const map = (fn, array) => array.map(fn);
const mapFlipped = flip(map);

// Now data comes last, easier to curry or pipe
const doubleAll = (arr) => mapFlipped(arr, n => n * 2);
```
