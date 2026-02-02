Window creates overlapping subarrays by sliding one element at a time.
Unlike `chunk` which splits without overlap, `window` preserves continuity between groups.
```mermaid
flowchart LR
    subgraph Input
        A["[1, 2, 3, 4, 5]"]
    end
    
    subgraph "window(array, 3)"
        B["Slide by 1"]
    end
    
    subgraph Output
        C["[1, 2, 3]"]
        D["[2, 3, 4]"]
        E["[3, 4, 5]"]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
```

### Window vs Chunk

| Operation | Overlap | Output for `[1,2,3,4,5]` size 3 |
|-----------|---------|--------------------------------|
| `window(arr, 3)` | Yes | `[[1,2,3], [2,3,4], [3,4,5]]` |
| `chunk(arr, 3)` | No | `[[1,2,3], [4,5]]` |
```mermaid
flowchart LR
    subgraph "window (sliding, overlap)"
        W1["[1, 2, 3]"] 
        W2["[2, 3, 4]"]
        W3["[3, 4, 5]"]
    end
    
    subgraph "chunk (split, no overlap)"
        C1["[1, 2, 3]"]
        C2["[4, 5]"]
    end
```