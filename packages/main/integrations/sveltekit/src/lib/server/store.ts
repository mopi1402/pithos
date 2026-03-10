/**
 * In-memory book store.
 *
 * Deliberate demo choice (like Hono/Express). Data is lost on
 * server restart. In production, use a database.
 */
import type { StoredBook } from '$lib/types'
import type { SimpleResult } from '@pithos/core/arkhe/types/common/simple-result'

let books: StoredBook[] = []
let chaos = false

export function getBooks(): StoredBook[] {
  return books
}

export function addBook(book: StoredBook): SimpleResult {
  books = [...books, book]
  return { ok: true }
}

export function removeBook(id: string): SimpleResult {
  const index = books.findIndex((b) => b.id === id)
  if (index === -1) return { ok: false, error: `No book found with id "${id}".` }
  books = books.filter((b) => b.id !== id)
  return { ok: true }
}

export function clearBooks(): void {
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
