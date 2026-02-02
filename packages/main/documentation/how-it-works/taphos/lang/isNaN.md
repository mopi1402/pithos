Checks if value is NaN.

```mermaid
flowchart LR
    A["isNaN(value)"] --> B["Number.isNaN(value)"]
    B --> C["boolean"]
```

### Difference from Global isNaN

```mermaid
flowchart TD
    A["Number.isNaN"] --> B["Only true for NaN"]
    C["global isNaN"] --> D["Coerces then checks"]
    D --> E["'hello' → NaN → true"]
    B --> F["'hello' → false"]
```

### Common Checks

| Value | Result |
|-------|--------|
| `NaN` | ✅ true |
| `undefined` | ❌ false |
| `'NaN'` | ❌ false |
| `null` | ❌ false |
| `42` | ❌ false |

> ⚠️ **Deprecated**: Use `Number.isNaN()` directly.
