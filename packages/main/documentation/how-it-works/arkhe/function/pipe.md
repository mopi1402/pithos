Composes functions left-to-right, passing each result to the next function.
```mermaid
flowchart LR
    A["5"] --> B["× 2"] --> C["10"] --> D["+ 1"] --> E["11"]
```

### Step-by-Step

```mermaid
flowchart LR
    subgraph "pipe(5, double, addOne)"
        I["5"]
        F1["double"]
        R1["10"]
        F2["addOne"]
        R2["11"]
        
        I --> F1 --> R1 --> F2 --> R2
    end
```

### String Transformation Example

```mermaid
flowchart LR
    A["'hello'"] --> B["toUpperCase"] --> C["'HELLO'"]
    C --> D["split('')"] --> E["['H','E','L','L','O']"]
    E --> F["reverse"] --> G["['O','L','L','E','H']"]
    G --> H["join('')"] --> I["'OLLEH'"]
```

### pipe vs flowRight

| | pipe | flowRight |
|--|------|-----------|
| **Direction** | Left → Right | Right → Left |
| **First arg** | Initial value | Last function |
| **Mental model** | Data flows through | Math composition |
