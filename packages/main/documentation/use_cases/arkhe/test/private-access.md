## `cast` / `castArray` / `castMap`

### **Test private members** safely 📍

@keywords: test, private, members, access, internal, class

Access private class members in tests without TypeScript errors.
Essential for testing internal state.

```typescript
const service = new AuthService();
const exposed = cast<{ attempts: number }>(service);
expect(exposed.attempts).toBe(2);
```

### **Assert internal collections** 📍

@keywords: assert, internal, collections, array, map

Inspect private arrays or maps to verify internal data structures.

```typescript
const connections = castArray<Connection>(cast(pool).connections);
const aliases = castMap<string, Connection>(cast(pool).aliases);
```

### **Handle edge cases** with test utilities

@keywords: edge, cases, null, undefined, type, assertions

Use pre-cast null/undefined values for type-safe test assertions.

```typescript
const result = processValue(testNull);
expect(result).toBe('default');
```
