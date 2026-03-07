## `takeRight`

### **Show recent activity** in dashboards 📍

@keywords: recent, activity, dashboard, last N, audit log, design system

Display the last N actions for quick context.
Perfect for "Recent Files", "Last Commands", or activity feeds.

```typescript
const auditLog = [
  "User login",
  "File uploaded",
  "Settings changed",
  "Report generated",
  "User logout",
];

const recentActions = takeRight(auditLog, 3);
// => ["Settings changed", "Report generated", "User logout"]
```

### **Extract trailing data points** for trend analysis

@keywords: trailing, trend, sparkline, recent data, performance, observability

Get the most recent values for sparklines or mini-charts.
Ideal for dashboards, stock tickers, or performance monitors.

```typescript
const cpuHistory = [45, 52, 48, 67, 72, 68, 71, 85, 82, 79];

const recentTrend = takeRight(cpuHistory, 4);
// => [71, 85, 82, 79]

const isIncreasing = recentTrend[3] > recentTrend[0];
// => true (trending up)
```

### **Get last page** of paginated data

@keywords: pagination, last page, batch, jump to end, final page

Extract the final batch when you know total count.
Useful for "Jump to last page" functionality.

```typescript
const allItems = Array.from({ length: 47 }, (_, i) => `Item ${i + 1}`);
const pageSize = 10;

const lastPage = takeRight(allItems, 47 % pageSize || pageSize);
// => ["Item 41", "Item 42", ..., "Item 47"]
```

### **Show** recent chat messages on reconnect

@keywords: recent, chat, messages, reconnect, websocket, design system, loading

Display the last N messages when a user reconnects to a chat room.
Essential for messaging apps and real-time collaboration tools.

```typescript
const chatHistory = await fetchChatHistory(roomId);

// Show last 50 messages on reconnect
const recentMessages = takeRight(chatHistory, 50);
renderMessages(recentMessages);

// Show "Load earlier messages" button if there are more
if (chatHistory.length > 50) {
  showLoadEarlierButton();
}
```
