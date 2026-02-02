Type guard that checks if a value is null.

```mermaid
flowchart LR
    A["isNull(value)"] --> B{"value === null?"}
    B -->|"✅"| C["value is null"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isNull(value))"
        B["value: null"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `null` | ✅ true |
| `undefined` | ❌ false |
| `0` | ❌ false |
| `''` | ❌ false |
| `false` | ❌ false |

### vs isNil

```mermaid
flowchart LR
    A["isNull"] --> B["only null"]
    C["isNil"] --> D["null OR undefined"]
```
