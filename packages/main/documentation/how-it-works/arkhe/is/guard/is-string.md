Type guard that checks if a value is a string.

```mermaid
flowchart LR
    A["isString(value)"] --> B{"typeof value === 'string'?"}
    B -->|"✅"| C["value is string"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isString(value))"
        B["value: string"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `'hello'` | ✅ true |
| `''` | ✅ true |
| `` `template` `` | ✅ true |
| `String(123)` | ✅ true |
| `new String('hello')` | ❌ false (boxed) |
| `123` | ❌ false |
| `['h', 'i']` | ❌ false |
