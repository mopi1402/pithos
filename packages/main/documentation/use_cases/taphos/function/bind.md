## `bind`

### **Bind** function context 📍

@keywords: bind, context, this, method

Bind a function to a specific `this` context.

```typescript
const obj = { name: "Alice" };
const greet = function() { return `Hello, ${this.name}`; };
const bound = greet.bind(obj);
bound(); // => "Hello, Alice"
```

### **Partial** application

@keywords: partial, arguments, curry

Pre-fill some arguments.

```typescript
const add = (a, b) => a + b;
const add5 = add.bind(null, 5);
add5(3); // => 8
```

### **Event** handler binding

@keywords: event, handler, callback

Bind methods for event handlers.

```typescript
class Button {
  handleClick = this.onClick.bind(this);
}
```
