Creates a new object with only the specified keys.
```mermaid
flowchart LR
    A["{ a: 1, b: 2, c: 3 }"] --> B["pick(_, ['a', 'c'])"]
    B --> C["{ a: 1, c: 3 }"]
```

### Selection Process

```mermaid
flowchart LR
    subgraph "Original"
        A["a: 1 ✅"]
        B["b: 2 ❌"]
        C["c: 3 ✅"]
    end
    subgraph "Result"
        D["a: 1"]
        E["c: 3"]
    end
    A --> D
    C --> E
```

### pick vs omit

| | pick | omit |
|--|------|------|
| **Keeps** | specified keys | all except specified |
| **Use case** | whitelist | blacklist |
