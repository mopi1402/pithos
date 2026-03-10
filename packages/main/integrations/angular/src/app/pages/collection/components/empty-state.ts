import { Component, input, output } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.scss'],
})
export class EmptyStateComponent {
  readonly seeding = input(false)
  readonly seed = output<void>()
}
