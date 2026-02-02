## `eachRight`

### **Iterate** in reverse 📍

@keywords: iterate, reverse, backwards, each

Process array elements from end to start.

```typescript
const items = [1, 2, 3];
[...items].reverse().forEach(item => console.log(item));
// => 3, 2, 1
```

### **Process** stack order

@keywords: process, stack, LIFO, order

Handle items in LIFO order.

```typescript
const stack = ["first", "second", "third"];
for (let i = stack.length - 1; i >= 0; i--) {
  process(stack[i]);
}
```

### **Undo** in reverse order

@keywords: undo, reverse, history, actions

Apply undo operations in reverse.

```typescript
const history = [action1, action2, action3];
history.reduceRight((_, action) => action.undo(), null);
```
