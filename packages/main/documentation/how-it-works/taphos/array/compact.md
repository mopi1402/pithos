Removes all falsy values from an array.
**Deprecated**: Use `array.filter(Boolean)` directly.
```mermaid
flowchart LR
    A["[0, 1, false, 2, '', 3, null]"] --> B["compact(_)"]
    B --> C["[1, 2, 3]"]
```

### Falsy Values Removed

| Value | Kept? |
|-------|-------|
| `0` | ❌ |
| `false` | ❌ |
| `''` | ❌ |
| `null` | ❌ |
| `undefined` | ❌ |
| `NaN` | ❌ |
| `1, 2, 3` | ✅ |

### Native Equivalent

```typescript
// ❌ compact(arr)
// ✅ arr.filter(Boolean)
```
