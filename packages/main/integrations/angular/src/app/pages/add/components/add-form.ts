import { Component, inject, signal, DestroyRef } from '@angular/core'
import { FormField, form, submit, required, pattern, validate } from '@angular/forms/signals'
import type { FieldTree } from '@angular/forms/signals'
import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { BookService } from '../../../services/book.service'
import { bookSchema } from '../../../lib/schemas'
import { GENRES } from '../../../lib/constants'
import { ErrorBannerComponent } from '../../../components/error-banner'

interface BookFormModel {
  title: string
  author: string
  isbn: string
  genre: string
  addedAt: string
}

@Component({
  selector: 'app-add-form',
  imports: [FormField, ErrorBannerComponent],
  templateUrl: './add-form.html',
  styleUrls: ['./add-form.scss'],
})
export class AddFormComponent {
  private readonly bookService = inject(BookService)
  private readonly destroyRef = inject(DestroyRef)
  private alive = true

  readonly genres = [...GENRES]

  private readonly model = signal<BookFormModel>({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    addedAt: '',
  })

  readonly bookForm: FieldTree<BookFormModel> = form(
    this.model,
    (path) => {
      required(path.title, { message: 'Title is required.' })
      required(path.author, { message: 'Author is required.' })
      required(path.isbn, { message: 'ISBN is required.' })
      pattern(path.isbn, /^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/, {
        message: 'Please enter a valid ISBN (10 or 13 digits).',
      })
      required(path.genre, { message: 'Genre is required.' })
      validate(path.genre, (ctx) => {
        const value = ctx.value()
        if (!value || GENRES.includes(value as typeof GENRES[number])) return null
        return { kind: 'invalidGenre', message: 'Please select a valid genre.' }
      })
    },
  )

  submitState = signal<'idle' | 'submitting' | 'success' | 'error'>('idle')
  submitError = signal<string | null>(null)
  successTitle = signal('')

  constructor() {
    this.destroyRef.onDestroy(() => { this.alive = false })
  }

  async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault()

    await submit(this.bookForm, async (formTree) => {
      const raw = formTree().value()
      const data = {
        ...raw,
        addedAt: raw.addedAt ? new Date(raw.addedAt) : undefined,
      }

      const validated = ensure(bookSchema, data)
      if (validated.isErr()) {
        this.submitState.set('error')
        this.submitError.set(validated.error)
        return
      }

      this.submitState.set('submitting')

      const book = {
        id: crypto.randomUUID(),
        title: titleCase(validated.value.title),
        author: titleCase(validated.value.author),
        isbn: validated.value.isbn,
        genre: validated.value.genre,
        addedAt: (validated.value.addedAt ?? new Date()).toISOString(),
      }

      await this.bookService.addBook(book).match(
        (saved) => {
          if (!this.alive) return
          this.successTitle.set(saved.title)
          this.submitState.set('success')
          this.bookForm().reset({ title: '', author: '', isbn: '', genre: '', addedAt: '' })
        },
        (e) => {
          if (!this.alive) return
          this.submitState.set('error')
          this.submitError.set(e)
        },
      )
    })
  }
}
