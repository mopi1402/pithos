Performs deep comparison between two values to determine equivalence.
```mermaid
flowchart LR
    A["isEqual(a, b)"] --> B{"Object.is(a, b)?"}
    B -->|"✅"| C["true"]
    B -->|"❌"| D{"both objects?"}
    D -->|"❌"| E["false"]
    D -->|"✅"| F["deep compare"]
```

### Deep Comparison

```mermaid
flowchart LR
    A["{ a: { b: 2 } }"] --> C["isEqual"]
    B["{ a: { b: 2 } }"] --> C
    C --> D["true ✅"]
```

### Supported Types

| Type | Comparison |
|------|------------|
| Primitives | `Object.is` (NaN === NaN) |
| Arrays | Element-by-element |
| Objects | Property-by-property |
| Date | Timestamp comparison |
| RegExp | Source + flags |
| Map | Key-value pairs |
| Set | All elements |

### NaN Handling

```mermaid
flowchart LR
    A["isEqual(NaN, NaN)"] --> B["true ✅"]
    C["NaN === NaN"] --> D["false ❌"]
```

### Circular References

```mermaid
flowchart LR
    A["{ self: ↻ }"] --> C["isEqual"]
    B["{ self: ↻ }"] --> C
    C --> D["true ✅"]
```
