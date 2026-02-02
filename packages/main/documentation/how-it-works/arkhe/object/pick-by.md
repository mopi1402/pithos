Creates a new object with properties that satisfy a predicate.

```mermaid
flowchart LR
    A["{ a: 1, b: 'hello', c: 3, d: null }"] --> B["pickBy(_, v => typeof v === 'number')"]
    B --> C["{ a: 1, c: 3 }"]
```

### Filter by Type

```mermaid
flowchart LR
    A["{ a: 1, b: 'hello', c: 3 }"] --> B["pickBy(_, v => typeof v === 'string')"]
    B --> C["{ b: 'hello' }"]
```

### Filter Non-Null

```mermaid
flowchart LR
    A["{ a: 1, b: null, c: undefined, d: 4 }"] --> B["pickBy(_, v => v != null)"]
    B --> C["{ a: 1, d: 4 }"]
```

### pick vs pickBy

| | pick | pickBy |
|--|------|--------|
| **Selects by** | Key names | Predicate function |
| **Use case** | Known keys | Dynamic filtering |
