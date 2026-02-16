Converts string to space-separated lowercase words.
Splits on case boundaries, underscores, hyphens, and emojis. Supports Unicode.
```mermaid
flowchart LR
    A["'fooBar'"] --> B["lowerCase(_)"]
    B --> C["'foo bar'"]
```

### Conversion Examples

| Input | Output |
|-------|--------|
| `'--Foo-Bar--'` | `'foo bar'` |
| `'fooBar'` | `'foo bar'` |
| `'__FOO_BAR__'` | `'foo bar'` |
| `'ÑoñoCase'` | `'ñoño case'` |

### Process

```mermaid
flowchart LR
    A["Input string"] --> B["Split uppercase groups"]
    B --> C["Replace _/- with spaces"]
    C --> D["Separate emojis"]
    D --> E["Normalize spaces"]
    E --> F["trim + toLowerCase"]
```
