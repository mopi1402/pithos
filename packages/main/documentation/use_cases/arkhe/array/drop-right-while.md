## `dropRightWhile`

### **Trim trailing empty or whitespace strings** 📍

@keywords: trim, trailing, empty, whitespace, cleanup, validation

Remove trailing empty or invalid entries from an array.
Perfect for cleaning up user inputs, CSV parsing, or form data with trailing blanks.

```typescript
const inputs = ["Alice", "Bob", "Charlie", "", "", ""];

const cleanedInputs = dropRightWhile(inputs, (val) => val === "");
// => ["Alice", "Bob", "Charlie"]
```

### **Remove trailing zeros or placeholder values**

@keywords: remove, trailing, zeros, placeholder, padding, numeric

Drop trailing numeric placeholders or padding from data arrays.
Perfect for trimming sensor data, audio buffers, or fixed-length records.

```typescript
const audioSamples = [0.5, 0.8, 0.3, 0.1, 0, 0, 0];

const trimmedSamples = dropRightWhile(audioSamples, (val) => val === 0);
// => [0.5, 0.8, 0.3, 0.1]
```

### **Exclude recent/future entries** from sorted data

@keywords: exclude, future, recent, sorted, threshold, date

Drop trailing elements from a sorted array based on a date or value threshold.
Perfect for excluding future-dated records, pending transactions, or draft entries.

```typescript
const posts = [
  { title: "Post 1", status: "published" },
  { title: "Post 2", status: "published" },
  { title: "Post 3", status: "draft" },
  { title: "Post 4", status: "draft" },
];

const publishedPosts = dropRightWhile(posts, (p) => p.status === "draft");
// => [{ title: "Post 1", status: "published" }, { title: "Post 2", status: "published" }]
```
