## `first` / `head`

### **Get** default selection from lists 📍

@keywords: get, default, selection, dropdown

Retrieve the first element as the default selected item.

```typescript
const countries = ["United States", "Canada", "Mexico"];
countries[0];
// => "United States"
```

### **Extract** primary result from search

@keywords: extract, search, results, top

Get the top/most relevant result from a search response.

```typescript
const searchResults = [{ title: "Best Match", score: 0.98 }, ...];
searchResults[0];
// => { title: "Best Match", score: 0.98 }
```

### **Get** primary validation error

@keywords: validation, errors, primary, forms

Extract the first validation error to display.

```typescript
const errors = [{ field: "email", message: "Invalid" }, ...];
errors[0];
// => { field: "email", message: "Invalid" }
```
