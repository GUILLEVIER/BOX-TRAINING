import { Routes } from '@angular/router'

/**
 * Rutas del módulo de instructor
 */
export const instructorRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/instructor-dashboard.component').then(
            c => c.InstructorDashboardComponent
          ),
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./schedules/schedules-list.component').then(c => c.SchedulesListComponent),
      },
    ],
  },
]
