Splits an array into two groups: elements matching the predicate and elements that don't.
Single pass through the array.

```mermaid
flowchart LR
    A["[1, 2, 3, 4, 5]"] --> B["partition
    ( _, n => n % 2 === 0 )"]
    B --> C{{"Even?"}}
    C --> D["[[2, 4], [1, 3, 5]]"]
```

### Element routing

```mermaid
flowchart LR
    E1["1"] -->|"❌ odd"| F["Falsy: [1, 3, 5]"]
    E2["2"] -->|"✅ even"| T["Truthy: [2, 4]"]
    E3["3"] -->|"❌ odd"| F
    E4["4"] -->|"✅ even"| T
    E5["5"] -->|"❌ odd"| F
```

### partition vs filter

| Function | Returns | Use case |
|----------|---------|----------|
| `filter` | Matching only | Don't need rejected |
| `partition` | [matching, rejected] | Need both groups |
