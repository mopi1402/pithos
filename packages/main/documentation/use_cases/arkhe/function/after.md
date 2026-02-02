## `after`

### **Trigger after warmup period** 📍

@keywords: trigger, warmup, threshold, accumulate, stabilize, delay

Execute only after a certain number of preliminary calls have occurred.
Perfect for waiting until a system stabilizes or data accumulates.
```typescript
// Only start calculating average after 5 data points
const updateAverage = after(5, (values) => {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  displayAverage(avg);
});

sensor.on("reading", (value) => {
  readings.push(value);
  updateAverage(readings);
});
// First 4 readings: nothing happens
// 5th reading onward: average is displayed
```

### **Confirm after multiple signals** 📍

@keywords: confirm, multiple, signals, safety, destructive, double-check

Require multiple confirmations before executing a destructive action.
Essential for safety mechanisms and preventing accidental triggers.
```typescript
const confirmDelete = after(2, () => {
  deleteAllData();
  console.log("Data deleted after double confirmation");
});

// User must click "Delete" twice
deleteButton.on("click", confirmDelete);
```

### **Batch notifications** after threshold 📍

@keywords: batch, notifications, threshold, accumulate, summary, alerts

Send a summary notification only after N events accumulate.
Useful for reducing notification spam while still alerting users.
```typescript
const notifyBatch = after(10, (errors) => {
  sendAlert(`${errors.length} errors occurred in the last hour`);
});

errorStream.on("error", (err) => {
  errorLog.push(err);
  notifyBatch(errorLog);
});
// Alert sent only after 10+ errors
```
