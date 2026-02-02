Creates an object where each element is stored under a computed key.
Last value wins for duplicate keys.

```mermaid
flowchart LR
    subgraph Input
        A["[{id:1, name:'John'}, {id:2, name:'Jane'}]"]
    end
    
    subgraph "keyBy(array, u => u.id)"
        B["Extract id as key"]
    end
    
    subgraph Output
        C["{ 1: {id:1,...}, 2: {id:2,...} }"]
    end
    
    A --> B --> C
```

```mermaid
flowchart LR
    subgraph "Transformation"
        I1["{id:1, name:'John'}"] -->|"key: 1"| O1["1 → {id:1, name:'John'}"]
        I2["{id:2, name:'Jane'}"] -->|"key: 2"| O2["2 → {id:2, name:'Jane'}"]
    end
```

### keyBy vs groupBy

| Function | Duplicate keys | Returns |
|----------|----------------|---------|
| `keyBy` | Last wins | `{ key: T }` |
| `groupBy` | All kept | `{ key: T[] }` |
