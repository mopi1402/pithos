Type guard that checks if a value is not null or undefined.

```mermaid
flowchart LR
    A["isNonNullable(value)"] --> B{"value != null?"}
    B -->|"✅"| C["value is NonNullable<T>"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: T | null | undefined"]
    end
    subgraph "if (isNonNullable(value))"
        B["value: T"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `0` | ✅ true |
| `''` | ✅ true |
| `false` | ✅ true |
| `NaN` | ✅ true |
| `null` | ❌ false |
| `undefined` | ❌ false |

### Comparison

| Guard | Excludes |
|-------|----------|
| `isNonNull` | `null` |
| `isNonUndefined` | `undefined` |
| `isNonNullable` | `null` AND `undefined` |
