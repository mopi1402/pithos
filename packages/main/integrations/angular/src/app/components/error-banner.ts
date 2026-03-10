import { Component, input } from '@angular/core'

@Component({
  selector: 'app-error-banner',
  templateUrl: './error-banner.html',
  styleUrls: ['./error-banner.scss'],
})
export class ErrorBannerComponent {
  readonly message = input<string | null>(null)
  readonly type = input<'error' | 'success'>('error')
}
