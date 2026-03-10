import { Component, input } from '@angular/core'

@Component({
  selector: 'app-connection-error',
  templateUrl: './connection-error.html',
  styleUrls: ['./connection-error.scss'],
})
export class ConnectionErrorComponent {
  readonly url = input.required<string>()
}
