import { Component } from '@angular/core'
import { AddFormComponent } from './components/add-form'

@Component({
  selector: 'app-add-page',
  imports: [AddFormComponent],
  template: `<app-add-form />`,
})
export class AddPage {}
