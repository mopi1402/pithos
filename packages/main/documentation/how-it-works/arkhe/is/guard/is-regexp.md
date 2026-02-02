Type guard that checks if a value is a RegExp.

```mermaid
flowchart LR
    A["isRegExp(value)"] --> B{"value instanceof RegExp?"}
    B -->|"✅"| C["value is RegExp"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isRegExp(value))"
        B["value: RegExp"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `/abc/` | ✅ true |
| `/abc/gi` | ✅ true |
| `new RegExp('abc')` | ✅ true |
| `'/abc/'` | ❌ false (string) |
| `{ test: () => {} }` | ❌ false |
