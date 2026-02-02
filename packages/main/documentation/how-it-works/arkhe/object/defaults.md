Fills in undefined properties with values from source objects.
Only `undefined` values are replaced — `null` is preserved.
```mermaid
flowchart LR
    subgraph "Target"
        A["a: 1"]
        B["b: undefined"]
        C["c: 3"]
    end
    subgraph "Source"
        D["b: 2"]
        E["c: 4"]
        F["d: 5"]
    end
    subgraph "Result"
        G["a: 1 (kept)"]
        H["b: 2 (filled)"]
        I["c: 3 (kept)"]
        J["d: 5 (added)"]
    end
```

### null vs undefined

```mermaid
flowchart LR
    A["{ city: null }"] --> B["defaults(_, { city: 'Paris' })"]
    B --> C["{ city: null }"]
```

`null` is preserved because it's a deliberate value, not absence.

### Multiple Sources

```mermaid
flowchart LR
    A["{ a: 1 }"] --> D["defaults"]
    B["{ b: 2 }"] --> D
    C["{ b: 3, c: 4 }"] --> D
    D --> E["{ a: 1, b: 2, c: 4 }"]
```

First source wins for each key.
