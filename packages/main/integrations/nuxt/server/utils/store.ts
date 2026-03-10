/**
 * In-memory book store.
 *
 * Shared across requests via module-level state (works in dev with
 * a single Nuxt server process).
 *
 * `globalThis` is used so the state survives HMR reloads during
 * development — without it, every file change resets the store.
 *
 * Files in `server/utils/` are auto-imported by Nuxt in all server
 * handlers, so these functions are available without explicit imports.
 */

import type { StoredBook } from '../../app/lib/types'

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
