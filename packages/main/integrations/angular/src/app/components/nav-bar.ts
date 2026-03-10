import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { ChaosToggleComponent } from './chaos-toggle'

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, ChaosToggleComponent],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.scss'],
})
export class NavBarComponent {}
