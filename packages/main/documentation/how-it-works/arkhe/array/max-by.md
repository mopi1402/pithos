Finds the element with the maximum value computed by iteratee.

```mermaid
flowchart LR
    subgraph Input
        A["[{age:25}, 
        {age:20}, 
        {age:30}]"]
    end
    
    subgraph "maxBy(_, u => u.age)"
        B["Extract ages"]
        C["25, 20, 30"]
        D["Find max: 30"]
    end
    
    subgraph Output
        E["{age: 30}"]
    end
    
    A --> B --> C --> D --> E
```
