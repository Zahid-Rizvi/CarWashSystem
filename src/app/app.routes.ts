import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.route';

export const routes: Routes = [
  ...AUTH_ROUTES,
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'washrequest',
    loadComponent: () => import('./features/washrequest/washrequest.component').then(m => m.WashRequestComponent)
  },
  {
    path: 'washpackages',
    loadComponent: () => import('./pages/washpackages/washpackages.component').then(m=>m.WashPackagesComponent)
  }
//   {
//     path: '**',
//     loadComponent: () =>
//       import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
//   },
];
