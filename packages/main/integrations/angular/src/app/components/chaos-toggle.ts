import { Component, inject } from '@angular/core'
import { ChaosService } from '../services/chaos.service'

@Component({
  selector: 'app-chaos-toggle',
  templateUrl: './chaos-toggle.html',
  styleUrls: ['./chaos-toggle.scss'],
})
export class ChaosToggleComponent {
  private readonly chaosService = inject(ChaosService)
  readonly enabled = this.chaosService.enabled
  readonly loading = this.chaosService.loading
  readonly toggling = this.chaosService.toggling

  toggle(): void {
    this.chaosService.toggle()
  }
}
