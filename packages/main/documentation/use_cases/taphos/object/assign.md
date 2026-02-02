## `assign` / `extend`

### **Merge** objects 📍

@keywords: assign, merge, extend, combine

Combine objects into one.

```typescript
Object.assign({}, defaults, options);
// or
{ ...defaults, ...options };
```

### **Shallow** copy

@keywords: shallow, copy, clone

Create shallow object copy.

```typescript
const copy = { ...original };
// or
const copy = Object.assign({}, original);
```

### **Apply** defaults

@keywords: defaults, options, config

Merge defaults with provided options.

```typescript
const config = { ...defaultConfig, ...userConfig };
```
