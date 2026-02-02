Type guard that checks if a value is a bigint.

```mermaid
flowchart LR
    A["isBigInt(value)"] --> B{"typeof value === 'bigint'?"}
    B -->|"✅"| C["value is bigint"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isBigInt(value))"
        B["value: bigint"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `123n` | ✅ true |
| `BigInt(123)` | ✅ true |
| `123` | ❌ false |
| `'123'` | ❌ false |
| `new Object(123n)` | ❌ false |
