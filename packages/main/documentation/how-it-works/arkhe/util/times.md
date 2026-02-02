Invokes a function n times, returning an array of results.
```mermaid
flowchart LR
    A["times(3, index => index * 2)"] --> B["[0, 2, 4]"]
```

### Usage Patterns

| Call | Result |
|------|--------|
| `times(3)` | `[0, 1, 2]` |
| `times(3, index => index * 2)` | `[0, 2, 4]` |
| `times(3, index => 'item-' + index)` | `['item-0', 'item-1', 'item-2']` |
| `times(3, () => 'x')` | `['x', 'x', 'x']` |

### Process

```mermaid
flowchart LR
    A["times(3, fn)"] --> B["index = 0: fn(0)"]
    B --> C["index = 1: fn(1)"]
    C --> D["index = 2: fn(2)"]
    D --> E["[result0, result1, result2]"]
```

### Without Iteratee

```mermaid
flowchart LR
    A["times(5)"] --> B["[0, 1, 2, 3, 4]"]
```

Returns indices when no iteratee is provided.
