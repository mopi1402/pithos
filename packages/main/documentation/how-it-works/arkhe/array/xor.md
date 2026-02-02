Symmetric difference — returns values that appear in exactly one array.
Values present in multiple arrays are excluded.

```mermaid
flowchart LR
    A["[1, 2]"] --> C["xor([a, b])"]
    B["[2, 3]"] --> C
    C --> D{{"In exactly 1?"}}
    D -->|"1: ✅ only in a"| E["[1, 3]"]
    D -->|"2: ❌ in both"| F["excluded"]
    D -->|"3: ✅ only in b"| E
```

### Count occurrences

```mermaid
flowchart LR
    V1["1 → count: 1 ✅"]
    V2["2 → count: 2 ❌"]
    V3["3 → count: 1 ✅"]
```

### xor vs difference vs intersection

| Function | Returns |
|----------|---------|
| `difference(a, b)` | In A but not B |
| `intersection(a, b)` | In both A and B |
| `xor([a, b])` | In A or B, but not both |
