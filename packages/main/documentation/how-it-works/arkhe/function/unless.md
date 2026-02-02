Applies a transformation only when the predicate returns `false`.
If predicate is `true`, returns the original value unchanged. Logical opposite of `when`.

### Predicate False (transforms)

```mermaid
flowchart LR
    A1["4"] --> B1{"isOdd?"}
    B1 -->|"❌ false"| C1["× 2"]
    C1 --> D1["8"]
```

### Predicate True (skips)

```mermaid
flowchart LR
    A2["3"] --> B2{"isOdd?"}
    B2 -->|"✅ true"| C2["3"]
```

### unless vs when

| Input | `when(x, isOdd, double)` | `unless(x, isOdd, double)` |
|-------|--------------------------|----------------------------|
| 3 (odd) | ✅ transforms → 6 | ❌ skips → 3 |
| 4 (even) | ❌ skips → 4 | ✅ transforms → 8 |
