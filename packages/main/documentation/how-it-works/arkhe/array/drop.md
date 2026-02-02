```mermaid
flowchart LR
    subgraph Input
        A["[1, 2, 3, 4, 5]"]
    end
    
    subgraph "drop(array, 2)"
        B["Skip first 2"]
    end
    
    subgraph Output
        C["[3, 4, 5]"]
    end
    
    A --> B --> C
```
