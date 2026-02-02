Removes elements matching predicate and returns them (mutates).

```mermaid
flowchart LR
    A["remove(array, predicate)"] --> B["Iterate array"]
    B --> C{"predicate(value)?"}
    C -->|"✅"| D["Add to removed"]
    C -->|"❌"| E["Keep in array"]
    D --> F["Return removed"]
    E --> F
```

### Processing Flow

```mermaid
flowchart TD
    A["[1, 2, 3, 4]"] --> B["remove(arr, n => n % 2 === 0)"]
    B --> C["Test each element"]
    C --> D["2, 4 match predicate"]
    D --> E["Array: [1, 3]"]
    E --> F["Return: [2, 4]"]
```

### Common Inputs

| Array | Predicate | Removed | Remaining |
|-------|-----------|---------|-----------|
| `[1, 2, 3, 4]` | `n => n % 2 === 0` | `[2, 4]` | `[1, 3]` |
| `['a', '', 'b']` | `x => !x` | `['']` | `['a', 'b']` |

> ⚠️ **Deprecated**: Use `.filter()` for immutable operations.
