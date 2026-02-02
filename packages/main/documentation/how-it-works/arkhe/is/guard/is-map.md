Type guard that checks if a value is a Map.

```mermaid
flowchart LR
    A["isMap(value)"] --> B{"value instanceof Map?"}
    B -->|"✅"| C["value is Map"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isMap(value))"
        B["value: Map<unknown, unknown>"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `new Map()` | ✅ true |
| `new Map([['a', 1]])` | ✅ true |
| `new WeakMap()` | ❌ false |
| `{}` | ❌ false |
| `Object.fromEntries([])` | ❌ false |
