import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, firstValueFrom } from 'rxjs'
import { ensureAsync } from '@pithos/core/bridges/ensureAsync'
import { ResultAsync } from '@pithos/core/zygos/result/result-async'
import { storedBooksSchema, storedBookSchema, chaosSchema } from '../lib/schemas'
import type { StoredBook } from '../lib/schemas'
import { extractErrorFromBody } from '../lib/errors'
import { API_URL } from '../lib/constants'

export const CONNECTION_ERROR_PREFIX = 'CONNECTION_ERROR:'

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient)

  private url(path = ''): string {
    return `${API_URL}${path}`
  }

  private safeRequest<T>(observable$: Observable<T>): ResultAsync<T, string> {
    return ResultAsync.fromPromise(
      firstValueFrom(observable$),
      (e) => {
        if (e instanceof HttpErrorResponse) {
          if (e.status === 0) {
            return `${CONNECTION_ERROR_PREFIX}${API_URL}`
          }
          return extractErrorFromBody(e.error)
        }
        return String(e)
      },
    )
  }

  fetchBooks(): ResultAsync<StoredBook[], string> {
    return this.safeRequest(
      this.http.get<unknown>(this.url('/books'))
    ).andThen((data) => ensureAsync(storedBooksSchema, data))
  }

  postBook(book: StoredBook): ResultAsync<StoredBook, string> {
    return this.safeRequest(
      this.http.post<unknown>(this.url('/books'), book)
    ).andThen((data) => ensureAsync(storedBookSchema, data))
  }

  deleteBook(id: string): ResultAsync<void, string> {
    return this.safeRequest(
      this.http.delete<unknown>(this.url(`/books?id=${id}`))
    ).map(() => {})
  }

  deleteAllBooks(): ResultAsync<void, string> {
    return this.safeRequest(
      this.http.delete<unknown>(this.url('/books?id=all'))
    ).map(() => {})
  }

  seedBooks(): ResultAsync<StoredBook[], string> {
    return this.safeRequest(
      this.http.post<unknown>(this.url('/books/seed'), null)
    ).andThen((data) => ensureAsync(storedBooksSchema, data))
  }

  getChaos(): ResultAsync<boolean, string> {
    return this.safeRequest(
      this.http.get<unknown>(this.url('/books/chaos'))
    ).andThen((data) => ensureAsync(chaosSchema, data))
     .map((data) => data.enabled)
  }

  setChaos(enabled: boolean): ResultAsync<boolean, string> {
    return this.safeRequest(
      this.http.post<unknown>(this.url('/books/chaos'), { enabled })
    ).andThen((data) => ensureAsync(chaosSchema, data))
     .map((data) => data.enabled)
  }
}
