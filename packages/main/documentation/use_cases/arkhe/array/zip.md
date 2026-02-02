## `zip` ⭐

### **Combine parallel arrays** into structured records 📍

@keywords: zip, parallel arrays, tuples, combine, structured data

Merge separate arrays of related data into tuples.
Perfect for API responses, CSV parsing, or data normalization.

```typescript
const names = ["Alice", "Bob", "Charlie"];
const ages = [25, 30, 28];
const roles = ["admin", "user", "user"];

const users = zip(names, ages, roles);
// => [
//   ["Alice", 25, "admin"],
//   ["Bob", 30, "user"],
//   ["Charlie", 28, "user"]
// ]

const userObjects = users.map(([name, age, role]) => ({ name, age, role }));
```

### **Create chart data points** from separate axis values 📍

@keywords: chart, data points, coordinates, visualization, graphing

Combine X and Y values into plottable coordinates.
Ideal for data visualization or graphing libraries.

```typescript
const timestamps = ["09:00", "10:00", "11:00", "12:00"];
const temperatures = [18.5, 21.2, 24.8, 26.1];

const dataPoints = zip(timestamps, temperatures);
// => [["09:00", 18.5], ["10:00", 21.2], ["11:00", 24.8], ["12:00", 26.1]]

const chartData = dataPoints.map(([time, temp]) => ({
  label: time,
  value: temp,
}));
```

### **Pair form labels with values**

@keywords: form, labels, values, dynamic forms, metadata

Combine field metadata with user input for dynamic forms.
Useful for form generation or data display grids.

```typescript
const fieldNames = ["firstName", "lastName", "email"];
const fieldValues = ["John", "Doe", "john@example.com"];
const required = [true, true, false];

const formFields = zip(fieldNames, fieldValues, required);
// => [
//   ["firstName", "John", true],
//   ["lastName", "Doe", true],
//   ["email", "john@example.com", false]
// ]
```
