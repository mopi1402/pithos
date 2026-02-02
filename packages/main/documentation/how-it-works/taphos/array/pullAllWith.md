Removes values from array using a comparator function (mutates).

```mermaid
flowchart LR
    A["pullAllWith(array, values, comparator)"] --> B["differenceWith()"]
    B --> C["array.length = 0"]
    C --> D["array.push(...kept)"]
    D --> E["mutated array"]
```

### Mutation Flow

```mermaid
flowchart TD
    A["[{x:1,y:2}, {x:3,y:4}]"] --> B["pullAllWith(arr, [{x:1,y:2}], cmp)"]
    B --> C["differenceWith finds matches"]
    C --> D["Clear array, push kept"]
    D --> E["[{x:3,y:4}]"]
```

### Common Inputs

| Array | Values | Comparator | Result |
|-------|--------|------------|--------|
| `[{x:1}, {x:2}]` | `[{x:1}]` | `(a,b) => a.x === b.x` | `[{x:2}]` |

> ⚠️ **Deprecated**: Use `differenceWith()` from Arkhe for immutable operations.
