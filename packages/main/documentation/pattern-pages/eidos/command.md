---
title: "Command Pattern in TypeScript"
sidebar_label: "Command"
description: "Learn how to implement the Command design pattern in TypeScript with functional programming. Build undo/redo systems with action history."
keywords:
  - command pattern typescript
  - undo redo typescript
  - action history
  - reversible operations
  - transaction pattern
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Command Pattern

Encapsulate a request as an object (or function pair), allowing you to parameterize, queue, log, and undo operations.

---

## The Problem

You're building a text editor. Users expect Ctrl+Z to undo. But your operations are scattered:

```typescript
function insertText(doc: Doc, text: string, pos: number) {
  doc.content = doc.content.slice(0, pos) + text + doc.content.slice(pos);
  // How do we undo this?
}

function deleteText(doc: Doc, start: number, end: number) {
  doc.content = doc.content.slice(0, start) + doc.content.slice(end);
  // What was deleted? Can't undo without knowing.
}
```

Operations don't know how to reverse themselves. Undo is impossible.

---

## The Solution

Each operation is a pair: execute and undo. Stack them for history:

```typescript
import { undoable, createCommandStack } from "@pithos/core/eidos/command/command";

const doc = { content: "Hello" };
const stack = createCommandStack();

// Insert "World" at position 5
const pos = 5;
const text = " World";

const insertCmd = undoable(
  () => { doc.content = doc.content.slice(0, pos) + text + doc.content.slice(pos); },
  () => { doc.content = doc.content.slice(0, pos) + doc.content.slice(pos + text.length); }
);

stack.execute(insertCmd);  // doc.content = "Hello World"
stack.undo();              // doc.content = "Hello"
stack.redo();              // doc.content = "Hello World"
```

Every operation knows how to reverse itself. Full undo/redo for free.

### Reactive variant

The imperative version above works great with Vue, Angular, and Svelte where mutation triggers reactivity. For React and other immutable-state systems, use the reactive variant where commands are pure `(state) => state` transforms:

```typescript
import { undoableState, createReactiveCommandStack } from "@pithos/core/eidos/command/command";

interface Doc { content: string }

const stack = createReactiveCommandStack<Doc>({
  initial: { content: "Hello" },
  onChange: setDoc, // React setState, Vue ref, Angular signal...
});

const pos = 5;
const text = " World";

stack.execute(undoableState(
  (doc) => ({ ...doc, content: doc.content.slice(0, pos) + text + doc.content.slice(pos) }),
  (doc) => ({ ...doc, content: doc.content.slice(0, pos) + doc.content.slice(pos + text.length) }),
));
// onChange fires with { content: "Hello World" }

stack.undo();  // onChange fires with { content: "Hello" }
stack.redo();  // onChange fires with { content: "Hello World" }
```

Same pattern, no mutation. The stack manages state and notifies your framework.

---

## Command vs Memento

Both patterns enable undo/redo, but they work differently:

- **Command** tracks individual operations and their reversal. Use when operations are known and reversible.
- **Memento** captures entire state snapshots. Use when state is complex or operations aren't easily reversible.

---

## Live Demo

<PatternDemo pattern="command" />

---

## Real-World Analogy

A macro recorder in a spreadsheet. You record a sequence of actions (commands), replay them on different data (queue), undo mistakes (undo), and save the macro for later (serialize). Each action is a discrete, reversible unit.

---

## When to Use It

- Implement undo/redo functionality
- Queue operations for later execution
- Log all operations for audit trails
- Support transactional behavior (rollback on failure)

---

## When NOT to Use It

If your operations aren't reversible or you just need to snapshot state, consider Memento instead.

---

## API

- [undoable](/api/eidos/command/undoable) — Create an imperative command with execute and undo thunks
- [createCommandStack](/api/eidos/command/createCommandStack) — Imperative command history with undo/redo
- [undoableState](/api/eidos/command/undoableState) — Create a pure state command `(S) => S`
- [createReactiveCommandStack](/api/eidos/command/createReactiveCommandStack) — Reactive command history with managed state and `onChange` callback
- [safeExecute](/api/eidos/command/safeExecute) — (deprecated) Use `Result.fromThrowable` from Zygos instead
