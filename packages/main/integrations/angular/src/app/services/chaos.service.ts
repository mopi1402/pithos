import { Injectable, inject, signal } from '@angular/core'
import { ApiClient } from './api-client.service'

@Injectable({ providedIn: 'root' })
export class ChaosService {
  private readonly api = inject(ApiClient)
  private readonly _enabled = signal(false)
  private readonly _loading = signal(true)
  private readonly _toggling = signal(false)

  readonly enabled = this._enabled.asReadonly()
  readonly loading = this._loading.asReadonly()
  readonly toggling = this._toggling.asReadonly()

  constructor() {
    this.api.getChaos().match(
      (val) => { this._enabled.set(val); this._loading.set(false) },
      () => { this._loading.set(false) },
    )
  }

  toggle(): void {
    if (this._toggling()) return
    const next = !this._enabled()
    this._toggling.set(true)
    this._enabled.set(next)
    this.api.setChaos(next).match(
      (val) => { this._enabled.set(val); this._toggling.set(false) },
      () => { this._enabled.set(!next); this._toggling.set(false) },
    )
  }
}
