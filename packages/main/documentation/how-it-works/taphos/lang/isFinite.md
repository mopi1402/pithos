Checks if value is a finite number.

```mermaid
flowchart LR
    A["isFinite(value)"] --> B["Number.isFinite(value)"]
    B --> C["boolean"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isFinite(value))"
        B["value: number"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `42` | ✅ true |
| `3.14` | ✅ true |
| `Infinity` | ❌ false |
| `-Infinity` | ❌ false |
| `NaN` | ❌ false |
| `'42'` | ❌ false |

> ⚠️ **Deprecated**: Use `Number.isFinite()` directly.
