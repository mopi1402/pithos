Creates a mapping function from a property key, function, or nullish value.
```mermaid
flowchart LR
    subgraph "Property Key"
        A1["castMapping('name')"] --> B1["(item) => item.name"]
    end
    subgraph "Function"
        A2["castMapping(fn)"] --> B2["fn (returned as-is)"]
    end
    subgraph "Nullish"
        A3["castMapping()"] --> B3["(item) => item (identity)"]
    end
```

### Usage Example

```mermaid
flowchart LR
    A["users"] --> B["map(castMapping('name'))"]
    B --> C["['Alice', 'Bob']"]
```

### Input Types

| Input | Output Function |
|-------|----------------|
| `'name'` | `(item) => item.name` |
| `(x) => x.id` | `(x) => x.id` |
| `null` / `undefined` | `(item) => item` |
