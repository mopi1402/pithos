## `trim` / `trimStart` / `trimEnd` ⭐

### **Remove** whitespace 📍

@keywords: trim, whitespace, clean, strip

Remove leading/trailing whitespace.

```typescript
"  hello  ".trim();      // => "hello"
"  hello  ".trimStart(); // => "hello  "
"  hello  ".trimEnd();   // => "  hello"
```

### **Clean** user input

@keywords: clean, input, form, normalize

Normalize form input.

```typescript
const email = inputValue.trim().toLowerCase();
```

### **Process** text lines

@keywords: process, lines, text, clean

Clean each line in multiline text.

```typescript
const lines = text.split("\n").map(l => l.trim());
```

### **Clean** imported CSV or Excel data

@keywords: clean, CSV, Excel, import, BOM, whitespace, invisible, data

Strip invisible characters and extra whitespace from imported spreadsheet data.
Critical when processing user-uploaded CSV/Excel files with inconsistent formatting.

```typescript
const rawCells = ["  John Doe  ", "\tAlice\t", " Bob ", "\u00A0Charlie\u00A0"];

const cleaned = rawCells.map((cell) => trim(cell));
// => ["John Doe", "Alice", "Bob", "Charlie"]
```
