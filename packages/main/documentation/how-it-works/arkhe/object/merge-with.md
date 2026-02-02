Recursively merges objects using a customizer to resolve conflicts.
```mermaid
flowchart LR
    subgraph "Conflict Resolution"
        A["objValue"] --> C["customizer(objValue, srcValue)"]
        B["srcValue"] --> C
        C --> D{"undefined?"}
        D -->|"yes"| E["default merge"]
        D -->|"no"| F["use custom result"]
    end
```

### Array Concatenation

```mermaid
flowchart LR
    A["{ items: [1, 2] }"] --> M["mergeWith"]
    B["{ items: [3, 4] }"] --> M
    C["customizer: concat arrays"] --> M
    M --> D["{ items: [1, 2, 3, 4] }"]
```

### Sum Values

```mermaid
flowchart LR
    A["{ a: 1, b: 2 }"] --> M["mergeWith"]
    B["{ a: 3, b: 4 }"] --> M
    C["customizer: sum numbers"] --> M
    M --> D["{ a: 4, b: 6 }"]
```

### mergeDeep vs mergeWith

| | mergeDeep | mergeWith |
|--|-----------|-----------|
| **Customization** | None | Full control |
| **Arrays** | Replace | Customizable |
| **Conflicts** | Left/Right wins | Custom logic |
