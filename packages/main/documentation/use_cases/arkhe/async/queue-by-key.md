## `queueByKey` 💎

> Ensures sequential execution by key. Prevents race conditions by forcing operations to run one after another.

### **Sequential Database Writes** 📍

@keywords: sequential, database, writes, consistency, race-conditions, transactions

Ensure that updates to the same record happen strictly in order, preventing "Lost Update" anomalies.
Essential for counters, inventory management, or financial balances.

```typescript
// Safe inventory update
const decrementStock = async (productId: string) => {
  return await queueByKey(`stock-${productId}`, async () => {
    const current = await db.getStock(productId);
    if (current > 0) {
      await db.updateStock(productId, current - 1);
    }
  });
};

// Even if called in parallel, updates will run one after another
await Promise.all([
  decrementStock("item-1"),
  decrementStock("item-1"),
  decrementStock("item-1")
]);
// Stock decreases by 3 correctly
```

### **Prevent File Corruption**

@keywords: prevent, corruption, files, writes, sequential, safety

When appending to a file or updating a shared local resource, ensure only one write happens at a time.

```typescript
// Safe log appending
const writeLog = async (message: string) => {
  await queueByKey('system-log', async () => {
    const timestamp = new Date().toISOString();
    await fs.appendFile('system.log', `[${timestamp}] ${message}\n`);
  });
};
```

### **Ordered message processing**

@keywords: ordered, messages, sequential, chat, events, queue

Process messages for the same conversation in strict order.
Essential for chat apps, event sourcing, or command queues.
```typescript
const processMessage = async (conversationId: string, message: Message) => {
  return await queueByKey(`conv-${conversationId}`, async () => {
    // Messages for same conversation processed in order
    await db.insertMessage(message);
    await updateConversationTimestamp(conversationId);
    await notifyParticipants(conversationId, message);
  });
};

// Even if messages arrive out of order from WebSocket
socket.on("message", (msg) => {
  processMessage(msg.conversationId, msg);
});
// Each conversation's messages are processed sequentially
```

