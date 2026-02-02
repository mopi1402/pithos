Converts string to space-separated lowercase words.
**Deprecated**: Use words + join manually.
```mermaid
flowchart LR
    A["'Foo Bar'"] --> B["lowerCase(_)"]
    B --> C["'foo bar'"]
```

### Native Equivalent

```typescript
// ❌ lowerCase(str)
// ✅ str.toLowerCase().replace(/[_-]+/g, ' ')
```
