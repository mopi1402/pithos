Type guard that checks if a value is undefined.

```mermaid
flowchart LR
    A["isUndefined(value)"] --> B{"value === undefined?"}
    B -->|"✅"| C["value is undefined"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isUndefined(value))"
        B["value: undefined"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `undefined` | ✅ true |
| `void 0` | ✅ true |
| `null` | ❌ false |
| `0` | ❌ false |
| `''` | ❌ false |
| `false` | ❌ false |

### vs isNil

```mermaid
flowchart LR
    A["isUndefined"] --> B["only undefined"]
    C["isNil"] --> D["null OR undefined"]
```
