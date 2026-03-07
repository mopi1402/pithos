## `set`

### **Update** nested data safely 📍

@keywords: update, nested, immutable, path, deep, reducer

Set a value at a deep path, creating intermediate objects if missing. Returns a new object (immutable).
Essential for reducer-like state updates.

```typescript
const updatedState = set(state, 'users[0].isActive', true);
```

### **Create** deep structures

@keywords: create, deep, structures, nested, builder, conversion

Build a deeply nested object from scratch by setting a single path on an empty object.
Useful for converting flat keys to nested objects.

```typescript
const obj = set({}, 'a.b.c', 'value');
// { a: { b: { c: 'value' } } }
```

### **Append** to arrays

@keywords: append, arrays, indices, elements, path, update

Use numeric indices in the path to create or update array elements.

```typescript
const list = set([], '[0].name', 'First');
// [{ name: 'First' }]
```

### **Update** dynamic form fields by path

@keywords: form, dynamic, field, path, onChange, nested, input, state, design system

Handle `onChange` events for deeply nested form fields using a dynamic path.
The standard pattern for complex forms with nested objects (address, billing, etc.).

```typescript
const [formData, setFormData] = useState({
  name: "",
  address: { street: "", city: "", zip: "" },
  billing: { card: "", expiry: "" },
});

const handleChange = (path: string, value: string) => {
  setFormData((prev) => set(prev, path, value));
};

// In JSX:
// <input onChange={(e) => handleChange("address.city", e.target.value)} />
// <input onChange={(e) => handleChange("billing.card", e.target.value)} />
```

### **Update** chart configuration at a specific path

@keywords: chart, config, update, path, nested, visualization, charts

Modify a specific chart option deep in the config tree without touching the rest.
Perfect for interactive chart editors and dashboard customization.

```typescript
let chartConfig = {
  title: { text: "Revenue" },
  xAxis: { type: "category", labels: { rotation: 0 } },
  series: [{ data: [10, 20, 30] }],
};

// User rotates x-axis labels
chartConfig = set(chartConfig, "xAxis.labels.rotation", -45);

// User changes title
chartConfig = set(chartConfig, "title.text", "Monthly Revenue");

renderChart(chartConfig);
```

### **Update** tree node expanded state by path

@keywords: tree, node, expand, collapse, path, nested, design system

Toggle a tree node's expanded state using its path in the tree structure.
Essential for tree components with expand/collapse functionality.

```typescript
let treeState = {
  root: {
    expanded: true,
    children: {
      src: { expanded: false, children: {} },
      tests: { expanded: false, children: {} },
    },
  },
};

const toggleNode = (path: string) => {
  const currentExpanded = get(treeState, `${path}.expanded`, false);
  treeState = set(treeState, `${path}.expanded`, !currentExpanded);
  renderTree(treeState);
};

toggleNode("root.children.src");
// => src node is now expanded
```

### **Update** stepper step status

@keywords: stepper, step, status, wizard, progress, design system

Mark a step as completed in a multi-step wizard state.
Perfect for stepper components tracking progress through a workflow.

```typescript
let wizardState = {
  steps: [
    { label: "Account", status: "current" },
    { label: "Profile", status: "pending" },
    { label: "Review", status: "pending" },
  ],
};

const completeStep = (stepIndex: number) => {
  wizardState = set(wizardState, `steps[${stepIndex}].status`, "completed");
  if (stepIndex + 1 < wizardState.steps.length) {
    wizardState = set(wizardState, `steps[${stepIndex + 1}].status`, "current");
  }
  renderStepper(wizardState);
};

completeStep(0);
// => Step 0 is "completed", Step 1 is "current"
```

### **Build** analytics event payloads dynamically

@keywords: analytics, event, payload, dynamic, tracking, observability, seo

Construct nested analytics payloads from flat user interaction data.
Essential for tracking systems with structured event schemas.

```typescript
let event = {};
event = set(event, "action", "purchase");
event = set(event, "metadata.product.id", "SKU-42");
event = set(event, "metadata.product.price", 29.99);
event = set(event, "metadata.user.segment", "premium");

analytics.track(event);
// => { action: "purchase", metadata: { product: { id: "SKU-42", price: 29.99 }, user: { segment: "premium" } } }
```
