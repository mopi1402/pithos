Checks if value is an integer.

```mermaid
flowchart LR
    A["isInteger(value)"] --> B["Number.isInteger(value)"]
    B --> C["boolean"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isInteger(value))"
        B["value: number"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `42` | ✅ true |
| `42.0` | ✅ true |
| `42.5` | ❌ false |
| `'42'` | ❌ false |
| `Infinity` | ❌ false |

> ⚠️ **Deprecated**: Use `Number.isInteger()` directly.
