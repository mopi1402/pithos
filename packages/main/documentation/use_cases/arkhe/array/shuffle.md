## `shuffle` ⭐

### **Randomize quiz questions** 📍

@keywords: shuffle, randomize, quiz, questions, education, gaming

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

@keywords: cards, deck, shuffle, game, dealing, gaming

Shuffle a deck before dealing in card games.
Essential for gaming applications or simulations.

```typescript
const deck = ["A♠", "K♠", "Q♠", "J♠", "10♠", /* ... */];

const shuffledDeck = shuffle(deck);
// => Randomly ordered deck
```

### **Randomize display order** to avoid position bias

@keywords: randomize, display, position, bias, A/B testing, marketplace, ads, fairness, performance

Shuffle product or ad listings to ensure fair exposure and prevent position bias.
Important for marketplaces, ad platforms, and A/B testing where order influences clicks.

```typescript
const sponsoredListings = [
  { id: "ad-1", advertiser: "Nike", bid: 2.50 },
  { id: "ad-2", advertiser: "Adidas", bid: 2.50 },
  { id: "ad-3", advertiser: "Puma", bid: 2.50 },
  { id: "ad-4", advertiser: "Reebok", bid: 2.50 },
];

// Same bid tier → randomize to give equal exposure
const fairOrder = shuffle(sponsoredListings);
// => Random order each page load, no advertiser is always first
```

### **Shuffle** tile positions in a puzzle game

@keywords: puzzle, tiles, board, game, scramble, gaming

Scramble tile positions to create a new puzzle board.
Essential for sliding puzzles, memory games, and board game setups.

```typescript
const tiles = range(1, 16).map((n) => ({ id: n, label: String(n) }));

const scrambledBoard = shuffle(tiles);
// => Tiles in random order for a new game round

renderBoard(chunk(scrambledBoard, 4)); // 4x4 grid
```

### **Randomize** survey answer order to reduce bias

@keywords: survey, answers, bias, research, UX, randomize, a11y

Shuffle answer options so the first choice doesn't get unfair preference.
Critical for research surveys, polls, and educational assessments.

```typescript
const question = {
  text: "Which framework do you prefer?",
  options: ["React", "Vue", "Angular", "Svelte", "Solid"],
};

const displayed = {
  ...question,
  options: shuffle(question.options),
};
// => Options in random order each time the survey loads
```
