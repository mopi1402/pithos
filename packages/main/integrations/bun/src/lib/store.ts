import type { StoredBook } from './schemas.ts'

let books: StoredBook[] = []
let chaos = false

export function getAll(): StoredBook[] {
  return books
}

export function add(book: StoredBook): void {
  books = [...books, book]
}

export function remove(id: string): StoredBook | undefined {
  const book = books.find((b) => b.id === id)
  if (book) books = books.filter((b) => b.id !== id)
  return book
}

export function clear(): void {
  books = []
}

export function findByIsbn(isbn: string): StoredBook | undefined {
  return books.find((b) => b.isbn === isbn)
}

export function isChaosEnabled(): boolean {
  return chaos
}

export function setChaos(enabled: boolean): void {
  chaos = enabled
}
