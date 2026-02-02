## `debounce` ⭐

### **Optimize search** input performance 📍

@keywords: optimize, search, input, typing, autocomplete, performance

Delay search execution until user stops typing to reduce API calls and improve performance.
Essential for search interfaces and autocomplete functionality.

```typescript
const search = debounce((query) => {
  api.search(query);
}, 300);

// User types "hello"... only one API call after 300ms
input.on("input", (e) => search(e.target.value));
```

### **Delay API** calls until idle 📍

@keywords: delay, API, idle, optimization, network, throttle

Delay API requests until user stops interacting to prevent server overload.
Critical for API optimization and reducing unnecessary network traffic.

```typescript
const saveData = debounce((data) => {
  api.save(data);
}, 1000);

// Save only after user stops editing for 1 second
editor.on("change", (data) => saveData(data));
```

### **Prevent rapid** button clicks

@keywords: prevent, rapid, clicks, submission, forms, duplicate

Debounce button clicks to prevent accidental multiple submissions.
Useful for form submissions and user interface interactions.

```typescript
const submitForm = debounce(() => {
  form.submit();
}, 500, true); // Immediate = true

// Only first click triggers action
button.on("click", submitForm);
```

### **Rate-limit WebSocket** messages in real-time apps

@keywords: websocket, realtime, messages, rate-limit, trading, chat, streaming

Debounce high-frequency WebSocket messages to prevent UI overload.
Critical for trading platforms, live dashboards, and real-time collaboration tools.

```typescript
// Debounce price updates from trading WebSocket
const handlePriceUpdate = debounce((priceData) => {
  updateTradingChart(priceData);
  recalculatePortfolioValue(priceData);
}, 100);

websocket.on("price_update", (data) => {
  handlePriceUpdate(data);
});

// For live chat typing indicators
const sendTypingIndicator = debounce(() => {
  socket.emit("user_typing", { roomId, userId });
}, 500);

messageInput.on("input", sendTypingIndicator);
```

