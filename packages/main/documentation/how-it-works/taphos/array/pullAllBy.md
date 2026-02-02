Removes values from array using an iteratee for comparison (mutates).

```mermaid
flowchart LR
    A["pullAllBy(array, values, iteratee)"] --> B["differenceBy()"]
    B --> C["array.length = 0"]
    C --> D["array.push(...kept)"]
    D --> E["mutated array"]
```

### Mutation Flow

```mermaid
flowchart TD
    A["[{x:1}, {x:2}, {x:3}]"] --> B["pullAllBy(arr, [{x:1}], 'x')"]
    B --> C["differenceBy finds [{x:2}, {x:3}]"]
    C --> D["Clear array, push kept"]
    D --> E["[{x:2}, {x:3}]"]
```

### Common Inputs

| Array | Values | Iteratee | Result |
|-------|--------|----------|--------|
| `[{x:1}, {x:2}]` | `[{x:1}]` | `'x'` | `[{x:2}]` |
| `[1.2, 2.3, 3.4]` | `[2.1]` | `Math.floor` | `[1.2, 3.4]` |

> ⚠️ **Deprecated**: Use `differenceBy()` from Arkhe for immutable operations.
