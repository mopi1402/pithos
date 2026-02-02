## `at` / `nth`

### **Access** array elements with negative indices 📍

@keywords: access, array, negative, indices, last

Retrieve elements from the end of an array using negative indices.

```typescript
const history = ["page1", "page2", "page3", "page4", "page5"];
history.at(-1); // => "page5"
history.at(-2); // => "page4"
```

### **Access** step in multi-step wizard

@keywords: access, wizard, steps, forms, onboarding

Get the current step data based on a dynamic step index.

```typescript
const wizardSteps = [{ id: "personal" }, { id: "address" }, { id: "payment" }];
wizardSteps[currentStepIndex];
// => { id: "payment" }
```

### **Access** carousel slide at offset

@keywords: carousel, slides, navigation, offset

Get slides relative to current position for navigation.

```typescript
const slides = ["intro", "features", "pricing", "contact"];
slides[currentIndex + 1]; // next
slides[currentIndex - 1]; // prev
```
