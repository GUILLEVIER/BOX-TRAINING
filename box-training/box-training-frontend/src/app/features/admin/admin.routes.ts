import { Routes } from '@angular/router'

/**
 * Rutas del módulo de administración
 */
export const adminRoutes: Routes = [
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
          import('./dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('./plans/management/plans-management.component').then(
            c => c.PlansManagementComponent
          ),
      },
      {
        path: 'plans/create',
        loadComponent: () =>
          import('./plans/create/plans-create.component').then(c => c.PlansCreateComponent),
      },
      {
        path: 'plans/types/create',
        loadComponent: () =>
          import('./plans/types/create/plans-types-create.component').then(
            c => c.PlansTypesCreateComponent
          ),
      },
      {
        path: 'plans/:id',
        loadComponent: () =>
          import('./plans/detail/plans-detail.component').then(c => c.PlansDetailComponent),
      },
      {
        path: 'plans/:id/edit',
        loadComponent: () =>
          import('./plans/edit/plans-edit.component').then(c => c.PlansEditComponent),
      },
    ],
  },
]
