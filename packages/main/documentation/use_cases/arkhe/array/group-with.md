## `groupWith`

### **Group consecutive numbers** 📍

@keywords: group, consecutive, sequence, runs, ranges, adjacent

Cluster adjacent elements that form a sequence.
Perfect for detecting runs, segmenting ranges, or identifying gaps in data.

```typescript
const numbers = [1, 2, 3, 10, 11, 12, 20, 21];

const consecutiveRuns = groupWith(numbers, (a, b) => b - a === 1);
// => [[1, 2, 3], [10, 11, 12], [20, 21]]
```

### **Group words by first letter**

@keywords: group, words, alphabetical, index, sorted, letter

Segment sorted text data when the first character changes.
Perfect for building alphabetical indexes or organizing sorted lists.

```typescript
const words = ["apple", "apricot", "banana", "blueberry", "cherry"];

const byFirstLetter = groupWith(words, (a, b) => a[0] === b[0]);
// => [["apple", "apricot"], ["banana", "blueberry"], ["cherry"]]
```

### **Group transactions by consecutive type**

@keywords: group, transactions, consecutive, patterns, batching, streaks

Cluster adjacent items sharing the same attribute value.
Useful for detecting patterns, batching operations, or summarizing streaks.

```typescript
const transactions = [
  { id: 1, type: "credit" },
  { id: 2, type: "credit" },
  { id: 3, type: "debit" },
  { id: 4, type: "debit" },
  { id: 5, type: "credit" },
];

const byType = groupWith(transactions, (a, b) => a.type === b.type);
// => [[credit, credit], [debit, debit], [credit]]
```
