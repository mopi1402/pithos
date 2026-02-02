Creates a comparator function for `Array.sort()` from a property key or mapper function.

```mermaid
flowchart LR
    A["castComparator('age')"] --> B["(a, b) => compare(a.age, b.age)"]
```

### Property Key vs Mapper Function

```mermaid
flowchart LR
    A1["castComparator('age')"] --> B1["users.sort(...)"]
    B1 --> C1["sorted by age"]
```

```mermaid
flowchart LR
    A2["castComparator(u => u.name.length)"] --> B2["users.sort(...)"]
    B2 --> C2["sorted by name length"]
```

### Options

```mermaid
flowchart LR
    A["[30, 25, 35]"] --> B["sort(castComparator('age'))"]
    B --> C["[25, 30, 35] (ascending)"]
```

```mermaid
flowchart LR
    A["[30, 25, 35]"] --> B["sort(castComparator('age', {reverse: true}))"]
    B --> C["[35, 30, 25] (descending)"]
```

### Default Comparison

| Type | Comparison |
|------|------------|
| `number` | Numeric subtraction |
| `string` | `localeCompare` |
| `Date` | Timestamp comparison |
| `null`/`undefined` | Sorted last |
