## `create`

### **Create** with prototype 📍

@keywords: create, prototype, inherit, object

Create object inheriting from prototype.

```typescript
const proto = { greet() { return 'Hello'; } };
const obj = Object.assign(Object.create(proto), { name: 'Fred' });
obj.greet();  // 'Hello'
```

### **Extend** base object

@keywords: extend, base, inherit, prototype

Create specialized object from base.

```typescript
const animal = { speak() { return 'sound'; } };
const dog = Object.assign(Object.create(animal), {
  speak() { return 'woof'; }
});
```
