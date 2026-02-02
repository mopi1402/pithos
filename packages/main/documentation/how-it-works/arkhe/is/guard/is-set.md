Type guard that checks if a value is a Set.

```mermaid
flowchart LR
    A["isSet(value)"] --> B{"value instanceof Set?"}
    B -->|"✅"| C["value is Set"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isSet(value))"
        B["value: Set<unknown>"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `new Set()` | ✅ true |
| `new Set([1, 2, 3])` | ✅ true |
| `new WeakSet()` | ❌ false |
| `[]` | ❌ false |
| `{ add: () => {} }` | ❌ false |
