Removes all specified values from array in place (mutates).

```mermaid
flowchart LR
    A["pullAll(array, values)"] --> B["pull(array, ...values)"]
    B --> C["mutated array"]
```

### Mutation Flow

```mermaid
flowchart TD
    A["[1, 2, 3, 4, 2]"] --> B["pullAll(arr, [2, 3])"]
    B --> C["Remove 2s and 3s"]
    C --> D["[1, 4]"]
    D --> E["⚠️ Original mutated"]
```

### Common Inputs

| Array | Values | Result |
|-------|--------|--------|
| `[1, 2, 3, 4, 2]` | `[2, 3]` | `[1, 4]` |
| `['a', 'b', 'c']` | `['b']` | `['a', 'c']` |

> ⚠️ **Deprecated**: Use `difference()` from Arkhe for immutable operations.
