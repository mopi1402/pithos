Parses a string containing key-value pairs into an object.

```mermaid
flowchart LR
    A["parseKeyValuePairs(input, pairSep, kvSep)"] --> B["split(pairSep)"]
    B --> C["split(kvSep) + trim"]
    C --> D["filter valid pairs"]
    D --> E["Object.fromEntries()"]
```

### Processing Flow

```mermaid
flowchart TD
    A["'name=John,age=30'"] --> B["split(',')"]
    B --> C["['name=John', 'age=30']"]
    C --> D["split('=') each"]
    D --> E["[['name','John'], ['age','30']]"]
    E --> F["Object.fromEntries()"]
    F --> G["{name: 'John', age: '30'}"]
```

### Common Inputs

| Input | Pair Sep | KV Sep | Result |
|-------|----------|--------|--------|
| `'name=John,age=30'` | `,` | `=` | `{name: 'John', age: '30'}` |
| `'name:John;age:30'` | `;` | `:` | `{name: 'John', age: '30'}` |
| `'key=value&other=data'` | `&` | `=` | `{key: 'value', other: 'data'}` |
| `' name = John '` | `,` | `=` | `{name: 'John'}` |
