Applies transformations to an object in a declarative way.
Properties without transformations are preserved unchanged.
```mermaid
flowchart LR
    subgraph "Object"
        A["count: 1"]
        B["name: 'tom'"]
        C["active: true"]
    end
    subgraph "Transformations"
        D["count: x => x + 1"]
        E["name: s => s.toUpperCase()"]
    end
    subgraph "Result"
        F["count: 2"]
        G["name: 'TOM'"]
        H["active: true (preserved)"]
    end
    A --> D --> F
    B --> E --> G
    C --> H
```

### Nested Transformations

```mermaid
flowchart LR
    A["{ profile: { firstName: 'john', age: 25 } }"]
    A --> B["evolve(_, { profile: { firstName: toUpper, age: inc } })"]
    B --> C["{ profile: { firstName: 'JOHN', age: 26 } }"]
```

### evolve vs mapValues

| | evolve | mapValues |
|--|--------|-----------|
| **Applies to** | Specific keys | All keys |
| **Preserves** | Untransformed keys | N/A |
| **Nested** | Supported | Manual |
