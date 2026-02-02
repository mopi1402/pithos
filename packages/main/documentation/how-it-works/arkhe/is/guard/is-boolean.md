Type guard that checks if a value is a boolean.

```mermaid
flowchart LR
    A["isBoolean(value)"] --> B{"typeof value === 'boolean'?"}
    B -->|"✅"| C["value is boolean"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isBoolean(value))"
        B["value: boolean"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `true` | ✅ true |
| `false` | ✅ true |
| `Boolean(1)` | ✅ true |
| `new Boolean(true)` | ❌ false (boxed) |
| `1` | ❌ false |
| `'true'` | ❌ false |
