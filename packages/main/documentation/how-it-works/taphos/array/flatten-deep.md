Recursively flattens an array to a single level.
**Deprecated**: Use `array.flat(Infinity)` directly.
```mermaid
flowchart LR
    A["[1, [2, [3, [4, [5]]]]]"] --> B["flattenDeep(_)"]
    B --> C["[1, 2, 3, 4, 5]"]
```

### Deep Recursion

```mermaid
flowchart LR
    A["[1, [2, [3]]]"] --> B["flattenDeep"]
    B --> C["[1, 2, 3]"]
```

### Native Equivalent

```typescript
// ❌ flattenDeep(arr)
// ✅ arr.flat(Infinity)
```
