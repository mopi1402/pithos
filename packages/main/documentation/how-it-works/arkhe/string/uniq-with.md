Creates a duplicate-free version of a string using a custom comparator.

```mermaid
flowchart TD
    A["uniqWith(str, comparator)"] --> B["result = []"]
    B --> C["for char of str"]
    C --> D{"result.every(existing =><br/>!comparator(existing, char))"}
    D -->|"✅ unique"| E["result.push(char)"]
    D -->|"❌ duplicate"| F["skip"]
    E --> C
    F --> C
    C -->|"done"| G["result.join('')"]
```

### Example: Case-insensitive

```mermaid
flowchart LR
    subgraph "Input"
        A["'Hello'"]
    end
    
    subgraph "Process"
        B["H"] --> C["result: ['H']"]
        D["e"] --> E["result: ['H','e']"]
        F["l"] --> G["result: ['H','e','l']"]
        H["l"] --> I["skip (matches 'l')"]
        J["o"] --> K["result: ['H','e','l','o']"]
    end
    
    subgraph "Output"
        L["'Helo'"]
    end
```

### Comparator Examples

| Comparator | Input | Output |
|------------|-------|--------|
| `(a, b) => a === b` | `'hello'` | `'helo'` |
| `(a, b) => a.toLowerCase() === b.toLowerCase()` | `'Hello'` | `'Helo'` |
| `(a, b) => /\s/.test(a) && /\s/.test(b)` | `'a  b  c'` | `'a b c'` |

### Performance

O(n²) time complexity due to `every()` check for each character.
