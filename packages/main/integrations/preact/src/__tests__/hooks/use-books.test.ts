import { describe, expect, vi, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { renderHook, act } from '@testing-library/preact'
import { okAsync } from '@pithos/core/zygos/result/result-async'
import { storedBookArb } from '../arbitraries'

vi.mock('../../lib/api', () => ({
  fetchBooks: vi.fn(),
  postBook: vi.fn(),
  deleteBook: vi.fn(),
  deleteAllBooks: vi.fn(),
  seedBooks: vi.fn(),
}))

import { useBooks } from '../../hooks/use-books'
import { fetchBooks, postBook, deleteBook } from '../../lib/api'

const flushMicrotasks = () => act(async () => {
  await new Promise((r) => setTimeout(r, 0))
})

describe('Adding a book updates the collection', () => {
  beforeEach(() => {
    vi.mocked(fetchBooks).mockReturnValue(okAsync([]))
  })

  itProp.prop([storedBookArb], { numRuns: 100 })(
    'collection contains the new book and size increases by 1',
    async (book) => {
      vi.mocked(postBook).mockReturnValue(okAsync(book))

      const { result } = renderHook(() => useBooks())
      await flushMicrotasks()

      const sizeBefore = result.current.books.length
      await act(async () => { await result.current.addBook(book) })

      expect(result.current.books.length).toBe(sizeBefore + 1)
      expect(result.current.books.some(b => b.id === book.id)).toBe(true)
    },
  )
})

describe('Removing a book updates the collection', () => {
  itProp.prop(
    [fc.array(storedBookArb, { minLength: 1, maxLength: 10 })],
    { numRuns: 100 },
  )('collection no longer contains the removed book and size decreases by 1', async (books) => {
    vi.mocked(fetchBooks).mockReturnValue(okAsync(books))
    vi.mocked(deleteBook).mockReturnValue(okAsync(undefined as void))

    const { result } = renderHook(() => useBooks())
    await flushMicrotasks()

    const bookToRemove = result.current.books[0]
    const sizeBefore = result.current.books.length

    await act(async () => { await result.current.removeBook(bookToRemove.id) })

    expect(result.current.books.length).toBe(sizeBefore - 1)
    expect(result.current.books.some(b => b.id === bookToRemove.id)).toBe(false)
  })
})
