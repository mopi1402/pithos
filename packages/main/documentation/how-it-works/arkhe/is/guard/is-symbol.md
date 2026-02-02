Type guard that checks if a value is a symbol.

```mermaid
flowchart LR
    A["isSymbol(value)"] --> B{"typeof value === 'symbol'?"}
    B -->|"✅"| C["value is symbol"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isSymbol(value))"
        B["value: symbol"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `Symbol()` | ✅ true |
| `Symbol('desc')` | ✅ true |
| `Symbol.for('key')` | ✅ true |
| `Symbol.iterator` | ✅ true |
| `'Symbol()'` | ❌ false |
| `{ [Symbol()]: 1 }` | ❌ false (object) |
