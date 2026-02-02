Removes elements at specified indexes and returns them (mutates).

```mermaid
flowchart LR
    A["pullAt(array, indexes)"] --> B["Collect pulled values"]
    B --> C["Compact array in-place"]
    C --> D["Return pulled"]
```

### Processing Flow

```mermaid
flowchart TD
    A["['a','b','c','d']"] --> B["pullAt(arr, [1, 3])"]
    B --> C["Collect: ['b', 'd']"]
    C --> D["Shift remaining left"]
    D --> E["Truncate array.length"]
    E --> F["Array: ['a','c']"]
    F --> G["Return: ['b','d']"]
```

### Common Inputs

| Array | Indexes | Pulled | Remaining |
|-------|---------|--------|-----------|
| `['a','b','c','d']` | `[1, 3]` | `['b','d']` | `['a','c']` |
| `[1, 2, 3]` | `[0]` | `[1]` | `[2, 3]` |

> ⚠️ **Deprecated**: Use `.filter()` with index check for immutable operations.
