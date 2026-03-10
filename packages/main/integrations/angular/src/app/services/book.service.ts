import { Injectable, inject, signal } from '@angular/core'
import { ResultAsync } from '@pithos/core/zygos/result/result-async'
import { ApiClient } from './api-client.service'
import type { StoredBook } from '../lib/schemas'

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly api = inject(ApiClient)
  private readonly _books = signal<StoredBook[]>([])
  private readonly _loading = signal(true)
  private readonly _error = signal<string | null>(null)

  readonly books = this._books.asReadonly()
  readonly loading = this._loading.asReadonly()
  readonly error = this._error.asReadonly()

  constructor() {
    this.api.fetchBooks().match(
      (data) => { this._books.set(data); this._loading.set(false) },
      (e) => { this._error.set(e); this._loading.set(false) },
    )
  }

  addBook(book: StoredBook): ResultAsync<StoredBook, string> {
    return this.api.postBook(book).map((saved) => {
      this._books.update((prev) => [...prev, saved])
      this._error.set(null)
      return saved
    }).mapErr((e) => { this._error.set(e); return e })
  }

  removeBook(id: string): ResultAsync<void, string> {
    return this.api.deleteBook(id).map(() => {
      this._books.update((prev) => prev.filter((b) => b.id !== id))
      this._error.set(null)
    }).mapErr((e) => { this._error.set(e); return e })
  }

  clearAll(): ResultAsync<void, string> {
    return this.api.deleteAllBooks().map(() => {
      this._books.set([])
      this._error.set(null)
    }).mapErr((e) => { this._error.set(e); return e })
  }

  seed(): ResultAsync<StoredBook[], string> {
    return this.api.seedBooks().map((data) => {
      this._books.set(data)
      this._error.set(null)
      return data
    }).mapErr((e) => { this._error.set(e); return e })
  }
}
