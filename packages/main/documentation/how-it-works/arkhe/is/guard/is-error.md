Type guard that checks if a value is an Error instance.

```mermaid
flowchart LR
    A["isError(value)"] --> B{"value instanceof Error?"}
    B -->|"✅"| C["value is Error"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isError(value))"
        B["value: Error"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `new Error('msg')` | ✅ true |
| `new TypeError('msg')` | ✅ true |
| `new RangeError('msg')` | ✅ true |
| `new SyntaxError('msg')` | ✅ true |
| `{ message: 'error' }` | ❌ false |
| `'Error'` | ❌ false |
