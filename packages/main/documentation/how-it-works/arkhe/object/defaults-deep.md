Recursively fills in undefined properties at all nesting levels.
```mermaid
flowchart LR
    subgraph "Target"
        A["a: { b: undefined, c: 3 }"]
    end
    subgraph "Source"
        B["a: { b: 2, d: 4 }, e: 5"]
    end
    subgraph "Result"
        C["a: { b: 2, c: 3, d: 4 }, e: 5"]
    end
    A --> M["defaultsDeep"]
    B --> M
    M --> C
```

### Deep Traversal

```mermaid
flowchart LR
    A["{ user: { name: undefined } }"] --> D["defaultsDeep"]
    B["{ user: { name: 'John', email: '...' } }"] --> D
    D --> C["{ user: { name: 'John', email: '...' } }"]
```

### defaults vs defaultsDeep

| | defaults | defaultsDeep |
|--|----------|--------------|
| **Scope** | Top-level only | All nesting levels |
| **Objects** | Replaced | Merged recursively |
