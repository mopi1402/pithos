Type guard that checks if a value is not undefined.

```mermaid
flowchart LR
    A["isNonUndefined(value)"] --> B{"value !== undefined?"}
    B -->|"✅"| C["value is T (excludes undefined)"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: T | undefined"]
    end
    subgraph "if (isNonUndefined(value))"
        B["value: T"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `null` | ✅ true |
| `0` | ✅ true |
| `''` | ✅ true |
| `false` | ✅ true |
| `undefined` | ❌ false |

### vs isNonNullable

```mermaid
flowchart LR
    A["isNonUndefined"] --> B["excludes undefined only"]
    C["isNonNullable"] --> D["excludes null AND undefined"]
```
