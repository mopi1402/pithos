Type guard that checks if a value is `null` or `undefined`.
```mermaid
flowchart LR
    A["isNil(value)"] --> B{"value == null?"}
    B -->|"null"| C["true"]
    B -->|"undefined"| C
    B -->|"0, '', false"| D["false"]
```

### Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: T | null | undefined"]
    end
    subgraph "if (isNil(value))"
        B["value: null | undefined"]
    end
    subgraph "else"
        C["value: T"]
    end
    A --> B
    A --> C
```

### Falsy vs Nil

| Value | `isNil` | `!value` |
|-------|---------|----------|
| `null` | ✅ true | ✅ true |
| `undefined` | ✅ true | ✅ true |
| `0` | ❌ false | ✅ true |
| `''` | ❌ false | ✅ true |
| `false` | ❌ false | ✅ true |
