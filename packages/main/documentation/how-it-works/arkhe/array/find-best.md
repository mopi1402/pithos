Generic extremum finder — finds the element that produces the best value according to a custom comparator.

```mermaid
flowchart LR
    A["[{age:25},
    {age:20},
    {age:30}]"] --> B["u => u.age"]
    B --> C["(a,b) => a < b"]
    C --> D["25 vs 20
    ↓
    20"]
    D --> E["20 vs 30
    ↓
    20"]
    E --> F["{age: 20}"]
```

### How comparator works

| Comparator | Finds | Example |
|------------|-------|---------|
| `(a, b) => a < b` | Minimum | Youngest user |
| `(a, b) => a > b` | Maximum | Oldest user |
