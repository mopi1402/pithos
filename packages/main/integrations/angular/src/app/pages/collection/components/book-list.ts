import { Component, inject, computed, signal, DestroyRef } from '@angular/core'
import { RouterLink } from '@angular/router'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import { BookService } from '../../../services/book.service'
import { CONNECTION_ERROR_PREFIX } from '../../../services/api-client.service'
import { BookCardComponent } from './book-card'
import { EmptyStateComponent } from './empty-state'
import { ConnectionErrorComponent } from './connection-error'
import { ErrorBannerComponent } from '../../../components/error-banner'

@Component({
  selector: 'app-book-list',
  imports: [RouterLink, BookCardComponent, EmptyStateComponent, ConnectionErrorComponent, ErrorBannerComponent],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss'],
})
export class BookListComponent {
  private readonly bookService = inject(BookService)
  private readonly destroyRef = inject(DestroyRef)
  private alive = true

  readonly books = this.bookService.books
  readonly loading = this.bookService.loading
  readonly error = this.bookService.error
  readonly seeding = signal(false)
  readonly clearing = signal(false)
  readonly removing = signal<string | null>(null)

  constructor() {
    this.destroyRef.onDestroy(() => { this.alive = false })
  }

  readonly groups = computed(() => {
    const books = this.books()
    if (books.length === 0) return []
    const grouped = groupBy(books, (b) => b.genre)
    return Object.entries(grouped).map(([genre, group]) => ({
      genre,
      books: orderBy(group ?? [], ['addedAt'], ['desc']),
    }))
  })

  readonly isConnectionError = computed(() =>
    this.error()?.startsWith(CONNECTION_ERROR_PREFIX) ?? false
  )

  readonly backendUrl = computed(() =>
    this.error()?.slice(CONNECTION_ERROR_PREFIX.length) ?? ''
  )

  removeBook(id: string): void {
    this.removing.set(id)
    this.bookService.removeBook(id).match(
      () => { if (this.alive) this.removing.set(null) },
      () => { if (this.alive) this.removing.set(null) },
    )
  }

  handleClear(): void {
    this.clearing.set(true)
    this.bookService.clearAll().match(
      () => { if (this.alive) this.clearing.set(false) },
      () => { if (this.alive) this.clearing.set(false) },
    )
  }

  handleSeed(): void {
    this.seeding.set(true)
    this.bookService.seed().match(
      () => { if (this.alive) this.seeding.set(false) },
      () => { if (this.alive) this.seeding.set(false) },
    )
  }
}
