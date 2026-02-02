Parses a comma-separated string using a custom parser function.

```mermaid
flowchart LR
    A["parseCommaSeparated(value, parser)"] --> B["value.split(',')"]
    B --> C["array.map(parser)"]
    C --> D["T[]"]
```

### Processing Flow

```mermaid
flowchart TD
    A["'1,2,3'"] --> B["split(',')"]
    B --> C["['1', '2', '3']"]
    C --> D["map(Number)"]
    D --> E["[1, 2, 3]"]
```

### Common Inputs

| Value | Parser | Result |
|-------|--------|--------|
| `'1,2,3'` | `Number` | `[1, 2, 3]` |
| `'a,b,c'` | `x => x.toUpperCase()` | `['A', 'B', 'C']` |
| `' a , b '` | `x => x.trim()` | `['a', 'b']` |
| `''` | `x => x` | `['']` |
