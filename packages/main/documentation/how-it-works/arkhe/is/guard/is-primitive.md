Type guard that checks if a value is a primitive type.

```mermaid
flowchart LR
    A["isPrimitive(value)"] --> B{"value === null OR<br/>typeof !== 'object' AND<br/>typeof !== 'function'?"}
    B -->|"✅"| C["value is Primitive"]
    B -->|"❌"| D["false"]
```

### Primitive Types

```mermaid
flowchart LR
    subgraph "Primitives"
        A["string"]
        B["number"]
        C["boolean"]
        D["bigint"]
        E["symbol"]
        F["undefined"]
        G["null"]
    end
    
    subgraph "Not Primitives"
        H["object"]
        I["array"]
        J["function"]
        K["class"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `'hello'` | ✅ true |
| `123` | ✅ true |
| `true` | ✅ true |
| `null` | ✅ true |
| `undefined` | ✅ true |
| `Symbol()` | ✅ true |
| `123n` | ✅ true |
| `{}` | ❌ false |
| `[]` | ❌ false |
| `() => {}` | ❌ false |
