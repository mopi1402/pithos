Parses a path string into an array of keys for object property access.

```mermaid
flowchart LR
    A["parsePath(path)"] --> B["regex.exec() loop"]
    B --> C{"quoted key?"}
    C -->|"✅"| D["remove quotes"]
    C -->|"❌"| E{"numeric?"}
    E -->|"✅"| F["Number()"]
    E -->|"❌"| G["string key"]
    D --> H["result array"]
    F --> H
    G --> H
```

### Processing Flow

```mermaid
flowchart TD
    A["'items[0].name'"] --> B["Match 'items'"]
    B --> C["Match '[0]'"]
    C --> D["Match 'name'"]
    D --> E["['items', 0, 'name']"]
```

### Supported Notations

| Path | Result |
|------|--------|
| `'a.b.c'` | `['a', 'b', 'c']` |
| `'items[0].name'` | `['items', 0, 'name']` |
| `'data[1][2].value'` | `['data', 1, 2, 'value']` |
| `'obj["key"].value'` | `['obj', 'key', 'value']` |
| `"obj['key']"` | `['obj', 'key']` |
