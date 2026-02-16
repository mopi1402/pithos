## `find` ⭐

### **Locate** item by condition 📍

@keywords: find, locate, search, condition, filter

Find a specific object in an array based on a matching condition.

```typescript
const users = [{ id: 1, role: "admin" }, { id: 2, role: "user" }];
users.find(user => user.role === "admin");
// => { id: 1, role: "admin" }
```

### **Get** matching configuration

@keywords: configuration, match, feature flags, environment

Find a configuration entry that matches specific criteria.

```typescript
const configs = [{ env: "dev", url: "localhost" }, { env: "prod", url: "api.com" }];
configs.find(c => c.env === process.env.NODE_ENV);
```

### **Retrieve** first valid option

@keywords: retrieve, valid, first, validation

Find the first item that meets validation criteria.

```typescript
const methods = [{ type: "card", valid: false }, { type: "paypal", valid: true }];
methods.find(m => m.valid);
// => { type: "paypal", valid: true }
```
