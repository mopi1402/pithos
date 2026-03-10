import { Component, input, output } from '@angular/core'
import type { StoredBook } from '../../../lib/schemas'

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.html',
  styleUrls: ['./book-card.scss'],
})
export class BookCardComponent {
  readonly book = input.required<StoredBook>()
  readonly remove = output<string>()
}
