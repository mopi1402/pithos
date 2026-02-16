## `partial` ⭐

### **Pre-fill** arguments 📍

@keywords: partial, arguments, curry, bind

Create function with pre-filled arguments.

```typescript
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = greet.bind(null, "Hello");
sayHello("Alice"); // => "Hello, Alice!"
```

### **Configure** function

@keywords: configure, preset, factory

Create configured versions of functions.

```typescript
const log = (level, msg) => console[level](msg);
const logError = log.bind(null, "error");
logError("Something went wrong");
```

### **Curry** first argument

@keywords: curry, first, argument

Fix the first parameter.

```typescript
const multiply = (a, b) => a * b;
const double = multiply.bind(null, 2);
double(5); // => 10
```
