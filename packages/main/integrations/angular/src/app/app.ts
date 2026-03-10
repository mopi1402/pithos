import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavBarComponent } from './components/nav-bar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  styleUrls: ['./app.scss'],
  template: `
    <app-nav-bar />
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
