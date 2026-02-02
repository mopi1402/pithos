Creates an array of numbers from start up to (but not including) end.
```mermaid
flowchart LR
    A["range(5)"] --> B["[0, 1, 2, 3, 4]"]
```

### Signatures

| Call | Result |
|------|--------|
| `range(5)` | `[0, 1, 2, 3, 4]` |
| `range(0, 10, 2)` | `[0, 2, 4, 6, 8]` |
| `range(5, 0)` | `[5, 4, 3, 2, 1]` |
| `range(5, 0, -2)` | `[5, 3, 1]` |

### Direction Detection

```mermaid
flowchart LR
    A["range(start, end)"] --> B{"start < end?"}
    B -->|"yes"| C["step = 1 (ascending)"]
    B -->|"no"| D["step = -1 (descending)"]
```

### Ascending vs Descending

```mermaid
flowchart LR
    subgraph "Ascending"
        A1["range(0, 5)"] --> B1["[0, 1, 2, 3, 4]"]
    end
    subgraph "Descending"
        A2["range(5, 0)"] --> B2["[5, 4, 3, 2, 1]"]
    end
```
