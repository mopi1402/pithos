Type guard that checks if a value is an ArrayBuffer.

```mermaid
flowchart LR
    A["isArrayBuffer(value)"] --> B{"value instanceof ArrayBuffer?"}
    B -->|"✅"| C["value is ArrayBuffer"]
    B -->|"❌"| D["false"]
```

### Type Narrowing

```mermaid
flowchart LR
    subgraph "Before"
        A["value: unknown"]
    end
    subgraph "if (isArrayBuffer(value))"
        B["value: ArrayBuffer"]
    end
```

### Common Checks

| Value | Result |
|-------|--------|
| `new ArrayBuffer(8)` | ✅ true |
| `new Uint8Array(8).buffer` | ✅ true |
| `new Uint8Array(8)` | ❌ false |
| `Buffer.alloc(8)` | ❌ false |
| `[]` | ❌ false |
