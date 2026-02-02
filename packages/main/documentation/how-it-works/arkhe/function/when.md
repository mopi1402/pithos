Applies a transformation only when the predicate returns `true`.
If predicate is `false`, returns the original value unchanged.
```mermaid
flowchart LR
    subgraph "Predicate True"
        A1["4"] --> B1{"isEven?"}
        B1 -->|"✅ true"| C1["× 2"]
        C1 --> D1["8"]
    end
```

```mermaid
flowchart LR
    subgraph "Predicate False"
        A2["3"] --> B2{"isEven?"}
        B2 -->|"❌ false"| C2["3"]
    end
```

### when vs unless

| | when | unless |
|--|------|--------|
| **Transforms if** | predicate = true | predicate = false |
| **Skips if** | predicate = false | predicate = true |
