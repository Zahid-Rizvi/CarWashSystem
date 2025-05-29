import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.route';
import { ChangePasswordComponent } from './features/change-password/change-password.component';

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
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m=>m.ServicesComponent)
  },
  {
    path: 'change-password',
    loadComponent: ()=> import('./features/change-password/change-password.component').then(m=>ChangePasswordComponent)
  }
//   {
//     path: '**',
//     loadComponent: () =>
//       import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
//   },
];
