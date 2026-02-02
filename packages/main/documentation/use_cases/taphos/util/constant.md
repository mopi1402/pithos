## `constant` / `identity`

### **Return** fixed value 📍

@keywords: constant, fixed, always, return

Function that always returns same value.

```typescript
const always = (v) => () => v;
const alwaysTrue = always(true);
alwaysTrue(); // => true
```

### **Identity** function

@keywords: identity, pass-through, return

Return input unchanged.

```typescript
const identity = (x) => x;
[1, 2, 3].map(identity); // => [1, 2, 3]
```

### **Placeholder** callback

@keywords: placeholder, callback, noop

Default callback that does nothing special.

```typescript
const defaultTransform = (x) => x;
const transform = options.transform ?? defaultTransform;
```
