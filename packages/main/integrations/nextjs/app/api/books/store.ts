/**
 * In-memory book store.
 *
 * Replaces the cookie-based storage to give the API route a real
 * data layer that can fail in interesting ways (chaos mode).
 * Shared across requests via module-level state (works in dev with
 * a single Next.js process).
 *
 * `globalThis` is used so the state survives Turbopack HMR reloads
 * during development — without it, every file change resets the store.
 *
 * Limitation: each serverless function instance gets its own copy of
 * this state. This is fine for a single-process dev server but would
 * not work in a production serverless deployment.
 */

import type { StoredBook } from '../../lib/types'

const g = globalThis as unknown as {
  __bookStore?: { books: StoredBook[]; chaos: boolean }
}

if (!g.__bookStore) {
  g.__bookStore = { books: [], chaos: false }
}

const state = g.__bookStore

export function getAll(): StoredBook[] {
  return state.books
}

export function add(book: StoredBook): void {
  state.books = [...state.books, book]
}

export function remove(id: string): StoredBook | undefined {
  const book = state.books.find((b) => b.id === id)
  if (book) state.books = state.books.filter((b) => b.id !== id)
  return book
}

export function clear(): void {
  state.books = []
}

export function findByIsbn(isbn: string): StoredBook | undefined {
  return state.books.find((b) => b.isbn === isbn)
}

export function isChaosEnabled(): boolean {
  return state.chaos
}

export function setChaos(enabled: boolean): void {
  state.chaos = enabled
}
