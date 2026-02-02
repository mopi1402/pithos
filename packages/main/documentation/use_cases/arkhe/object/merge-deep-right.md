## `mergeDeepRight` ⭐

### **Merge** with override precedence 📍

@keywords: merge, override, precedence, right, configuration, patch

Merge objects recursively where the second object (right) overrides the first.
Essential for applying configuration overrides or patching state.

```typescript
const finalConfig = mergeDeepRight(defaultConfig, userConfig);
// userConfig overrides defaults
```

### **Patch** complex state

@keywords: patch, state, update, partial, reducer, deep

Apply a partial update to a deep state tree.
Critical for reducer logic in state management.

```typescript
const nextState = mergeDeepRight(currentState, {
  ui: { sidebar: { isOpen: true } } // Only updates isOpen, preserves other ui props
});
```

### **Combine** nested defaults

@keywords: combine, nested, defaults, layers, configuration, override

Merge layers of configuration where inner layers override outer ones.

```typescript
const effective = mergeDeepRight(globalProps, localProps);
```
