Creates a deep clone of any JavaScript value, handling ALL types including TypedArrays, Buffers, Blobs, and boxed primitives.

```mermaid
flowchart TD
    A["deepCloneFull(value)"] --> B{"primitive?"}
    B -->|"✅"| C["return value"]
    B -->|"❌"| D["cloneFullRecursive"]
    
    D --> E{"cached in refs?"}
    E -->|"✅"| F["return cached"]
    E -->|"❌"| G{"type check"}
    
    G --> H["Array"]
    G --> I["Plain Object"]
    G --> J["ArrayBuffer"]
    G --> K["TypedArray"]
    G --> L["DataView"]
    G --> M["Buffer"]
    G --> N["Blob/File"]
    G --> O["Boxed Primitive"]
    G --> P["Date/RegExp"]
    G --> Q["Map/Set"]
    G --> R["Error"]
    G --> S["Custom class"]
```

### Supported Types (vs deepClone)

```mermaid
flowchart LR
    subgraph "deepClone"
        A1["Array"]
        A2["Object"]
        A3["Date"]
        A4["RegExp"]
        A5["Map/Set"]
        A6["Error"]
    end
    
    subgraph "deepCloneFull (additional)"
        B1["TypedArrays"]
        B2["ArrayBuffer"]
        B3["SharedArrayBuffer"]
        B4["DataView"]
        B5["Buffer (Node)"]
        B6["Blob/File"]
        B7["Boxed primitives"]
        B8["Symbol keys"]
    end
```

### Circular Reference Handling

```mermaid
flowchart LR
    A["obj.self = obj"] --> B["WeakMap refs"]
    B --> C{"seen before?"}
    C -->|"✅"| D["return cached ref"]
    C -->|"❌"| E["clone & cache"]
```

### Performance

| Type | Complexity |
|------|------------|
| Primitives | O(1) |
| Arrays/Objects | O(n) |
| Circular refs | O(1) lookup |
