Removes diacritical marks and converts ligatures to basic Latin letters.
```mermaid
flowchart LR
    A["'café'"] --> B["deburr(_)"]
    B --> C["'cafe'"]
```

### Process

```mermaid
flowchart LR
    A["Input: 'Müller'"] --> B["NFD normalize"]
    B --> C["'Mu\u0308ller'"]
    C --> D["Remove combining marks"]
    D --> E["'Muller'"]
```

### Ligature Expansion

| Input | Output |
|-------|--------|
| `œ` | `oe` |
| `æ` | `ae` |
| `ß` | `ss` |
| `Þ` | `Th` |
| `Ø` | `O` |

### Examples

| Input | Output |
|-------|--------|
| `café` | `cafe` |
| `Müller` | `Muller` |
| `Straße` | `Strasse` |
| `Œuvre` | `OEuvre` |
| `Þór` | `Thor` |
| `Łódź` | `Lodz` |
