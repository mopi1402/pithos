## `extend`

### **Merge** objects 📍

@keywords: merge, assign, combine, objects

Merge multiple objects into target.

```typescript
const result = { ...base, ...overrides };
// Or mutating:
Object.assign(target, source1, source2);
```

### **Apply** defaults

@keywords: defaults, options, config, merge

Merge user options with defaults.

```typescript
const options = { ...defaults, ...userOptions };
```
