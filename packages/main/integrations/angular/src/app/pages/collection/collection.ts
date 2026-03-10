import { Component } from '@angular/core'
import { BookListComponent } from './components/book-list'

@Component({
  selector: 'app-collection-page',
  imports: [BookListComponent],
  template: `<app-book-list />`,
})
export class CollectionPage {}
