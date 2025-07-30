import { Routes } from '@angular/router';

/**
 * Rutas del módulo de estudiante
 */
export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/student-dashboard.component').then(c => c.StudentDashboardComponent)
      },
      {
        path: 'reservation/create',
        loadComponent: () => import('./reservations/reservation-create.component').then(c => c.ReservationCreateComponent)
      }
    ]
  }
];
