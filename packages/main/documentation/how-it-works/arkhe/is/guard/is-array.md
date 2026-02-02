Type guard that checks if a value is an array.
```mermaid
flowchart LR
    A["isArray(value)"] --> B{"Array.isArray?"}
    B -->|"✅"| C["value is T[]"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isArray(value))"
        B["value: unknown[]"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `[1, 2, 3]` | ✅ true |
| `[]` | ✅ true |
| `'hello'` | ❌ false |
| `{ length: 3 }` | ❌ false |
| `new Set([1, 2])` | ❌ false |
