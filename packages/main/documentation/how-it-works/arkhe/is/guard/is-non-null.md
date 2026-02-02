Type guard that checks if a value is not null.

```mermaid
flowchart LR
    A["isNonNull(value)"] --> B{"value !== null?"}
    B -->|"✅"| C["value is T (excludes null)"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: T | null"]
    end
    subgraph "if (isNonNull(value))"
        B["value: T"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `undefined` | ✅ true |
| `0` | ✅ true |
| `''` | ✅ true |
| `false` | ✅ true |
| `null` | ❌ false |

### vs isNonNullable

```mermaid
flowchart LR
    A["isNonNull"] --> B["excludes null only"]
    C["isNonNullable"] --> D["excludes null AND undefined"]
```
