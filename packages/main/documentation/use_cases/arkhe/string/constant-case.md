## `constantCase`

### **Generate** constants 📍

@keywords: generate, constants, environment, variables, Redux, actions

Convert strings to `CONSTANT_CASE` for environment variables or Redux action types.
Critical for code generation tools.
```typescript
const envVar = constantCase('api url'); // 'API_URL'
const action = constantCase('fetch users'); // 'FETCH_USERS'
```

### **Create** enum keys

@keywords: create, enum, keys, members, standardize, generation

Generate standardized enum member names from display text.
```typescript
const enumKey = constantCase('Pending Approval'); // 'PENDING_APPROVAL'
```
