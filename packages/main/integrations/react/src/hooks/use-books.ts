import { useState, useEffect, useCallback } from 'react'
import { fetchBooks, postBook, deleteBook, deleteAllBooks, seedBooks } from '../lib/api'
import type { StoredBook } from '../lib/schemas'

export function useBooks() {
  const [books, setBooks] = useState<StoredBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
    return fetchBooks().match(
      (data) => { setBooks(data); setLoading(false) },
      (e) => { setError(e); setLoading(false) },
    )
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addBook = useCallback((book: StoredBook) => {
    setError(null)
    return postBook(book)
      .map((saved) => { setBooks((prev) => [...prev, saved]) })
      .mapErr((e) => { setError(e); return e })
  }, [])

  const removeBook = useCallback((id: string) => {
    setError(null)
    return deleteBook(id)
      .map(() => { setBooks((prev) => prev.filter((b) => b.id !== id)) })
      .mapErr((e) => { setError(e); return e })
  }, [])

  const clearAll = useCallback(() => {
    setError(null)
    return deleteAllBooks()
      .map(() => { setBooks([]) })
      .mapErr((e) => { setError(e); return e })
  }, [])

  const seed = useCallback(() => {
    setError(null)
    return seedBooks()
      .map((data) => { setBooks(data) })
      .mapErr((e) => { setError(e); return e })
  }, [])

  return { books, loading, error, addBook, removeBook, clearAll, seed, refresh }
}
