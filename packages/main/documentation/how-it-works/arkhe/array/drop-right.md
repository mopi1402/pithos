Drops elements from the end instead of the beginning.

```mermaid
flowchart LR
    subgraph Input
        A["[1, 2, 3, 4, 5]"]
    end
    
    subgraph "dropRight(array, 2)"
        B["Skip last 2"]
    end
    
    subgraph Output
        C["[1, 2, 3]"]
    end
    
    A --> B --> C
```
