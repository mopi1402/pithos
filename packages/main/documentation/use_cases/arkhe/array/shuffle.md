## `shuffle` ⭐

### **Randomize quiz questions** 📍

@keywords: shuffle, randomize, quiz, questions, education

Shuffle questions to prevent memorization of order.
Essential for educational apps, quizzes, or exam systems.

```typescript
const questions = [
  { id: 1, text: "What is 2+2?" },
  { id: 2, text: "What is the capital of France?" },
  { id: 3, text: "Who wrote Hamlet?" },
  { id: 4, text: "What is H2O?" },
];

const randomizedQuiz = shuffle(questions);
// => Questions in random order
```

### **Randomize playlist order** 📍

@keywords: playlist, shuffle, music, random order, streaming

Create shuffled playlists for music or content.
Perfect for streaming apps, video queues, or content feeds.

```typescript
const playlist = ["Track 1", "Track 2", "Track 3", "Track 4", "Track 5"];

const shuffledPlaylist = shuffle(playlist);
// => ["Track 3", "Track 1", "Track 5", "Track 2", "Track 4"]
```

### **Deal cards in a game**

@keywords: cards, deck, shuffle, game, dealing

Shuffle a deck before dealing in card games.
Essential for gaming applications or simulations.

```typescript
const deck = ["A♠", "K♠", "Q♠", "J♠", "10♠", /* ... */];

const shuffledDeck = shuffle(deck);
// => Randomly ordered deck
```
