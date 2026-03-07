## `sampleSize`

### **Select multiple random items** for testing 📍

@keywords: random, multiple, sampling, testing, selection

Get N random elements from an array for sampling or testing.
Perfect for generating test data, random selections, or batch sampling.

```typescript
const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Tablet" },
  { id: 4, name: "Watch" },
  { id: 5, name: "Headphones" },
];

const testSample = sampleSize(products, 3);
// => [{ id: 3, name: "Tablet" }, { id: 1, name: "Laptop" }, { id: 5, name: "Headphones" }]
```

### **Generate random playlist**

@keywords: playlist, random, shuffle, music, tracks

Select random tracks for a shuffled playlist.
Ideal for music apps, content recommendations, or quiz questions.

```typescript
const allSongs = ["Song A", "Song B", "Song C", "Song D", "Song E", "Song F"];

const playlist = sampleSize(allSongs, 4);
// => ["Song C", "Song A", "Song F", "Song D"]
```

### **Random survey participants**

@keywords: survey, participants, random subset, user research, A/B testing

Select a random subset of users for surveys or feedback.
Useful for user research, A/B testing, or focus groups.

```typescript
const allUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
  { id: "u4", name: "Diana" },
  { id: "u5", name: "Eve" },
];

const surveyGroup = sampleSize(allUsers, 2);
// => [{ id: "u3", name: "Charlie" }, { id: "u1", name: "Alice" }]
```

### **Pick** random featured items for a homepage carousel

@keywords: featured, carousel, homepage, random, spotlight, design system, seo

Select a random subset of products or articles for a rotating carousel.
Essential for homepages and landing pages with dynamic featured content.

```typescript
const allFeatured = [
  { id: "p1", title: "Summer Collection", image: "/img/summer.jpg" },
  { id: "p2", title: "New Arrivals", image: "/img/new.jpg" },
  { id: "p3", title: "Best Sellers", image: "/img/best.jpg" },
  { id: "p4", title: "Flash Sale", image: "/img/sale.jpg" },
  { id: "p5", title: "Editor's Pick", image: "/img/pick.jpg" },
];

const carouselSlides = sampleSize(allFeatured, 3);
// => 3 random slides for the homepage carousel
renderCarousel(carouselSlides);
```
