import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'add', loadComponent: () => import('./pages/add/add').then(m => m.AddPage) },
  { path: 'collection', loadComponent: () => import('./pages/collection/collection').then(m => m.CollectionPage) },
  { path: '', redirectTo: 'collection', pathMatch: 'full' },
]
