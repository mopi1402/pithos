## `fill`

### **Initialize game board** or grid 📍

@keywords: initialize, board, grid, array, static, immutable, design system, canvas, gaming, skeleton

Create an array filled with a static initial value.
Immutable alternative to `new Array(n).fill(v)`.

```typescript
// Create a row of empty slots
const emptyRow = fill(new Array(5), "empty");
// => ["empty", "empty", "empty", "empty", "empty"]
```

### **Reset status flags**

@keywords: reset, status, flags, range, bulk, update, skeleton

Reset a specific range of values within an array without mutating the original.
Useful for bulk updates or resetting state.

```typescript
const steps = ["done", "done", "error", "pending"];

// Reset steps 1 and 2 (indices 1 to 3) to "retry"
const retrying = fill(steps, "retry", 1, 3);
// => ["done", "retry", "retry", "pending"]
```

### **Create** a pixel grid for a canvas editor

@keywords: pixel, grid, canvas, editor, drawing, gaming, 3D

Initialize a 2D grid of default color values for a pixel art editor.
Essential for canvas-based drawing tools and tile map editors.

```typescript
const width = 32;
const height = 32;
const grid = times(height, () => fill(new Array(width), "#ffffff"));
// => 32x32 grid of white pixels

// Paint a pixel
grid[10][15] = "#ff0000";
renderGrid(grid);
```

### **Generate** skeleton loading rows

@keywords: skeleton, loading, placeholder, UI, design system, performance

Create placeholder rows for a table or list while data loads.
Perfect for skeleton screens in dashboards and data tables.

```typescript
const skeletonRows = fill(new Array(8), {
  name: "",
  email: "",
  status: "loading",
});

// Render shimmer placeholders
skeletonRows.map((_, i) => <SkeletonRow key={i} />);
```
