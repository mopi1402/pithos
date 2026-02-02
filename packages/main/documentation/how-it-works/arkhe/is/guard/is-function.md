Type guard that checks if a value is a function.

```mermaid
flowchart LR
    A["isFunction(value)"] --> B{"typeof value === 'function'?"}
    B -->|"✅"| C["value is Function"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isFunction(value))"
        B["value: Function"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `() => {}` | ✅ true |
| `function() {}` | ✅ true |
| `async () => {}` | ✅ true |
| `class Foo {}` | ✅ true |
| `Array.isArray` | ✅ true |
| `{ call: () => {} }` | ❌ false |
