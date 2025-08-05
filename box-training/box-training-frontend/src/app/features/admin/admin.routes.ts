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
      {
        path: 'students',
        loadComponent: () =>
          import('./students/management/students-management.component').then(
            c => c.StudentsManagementComponent
          ),
      },
      {
        path: 'students/create',
        loadComponent: () =>
          import('./students/create/students-create.component').then(
            c => c.StudentsCreateComponent
          ),
      },
      {
        path: 'students/:id',
        loadComponent: () =>
          import('./students/detail/students-detail.component').then(
            c => c.StudentsDetailComponent
          ),
      },
      {
        path: 'students/:id/edit',
        loadComponent: () =>
          import('./students/edit/students-edit.component').then(c => c.StudentsEditComponent),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('./instructors/management/instructors-management.component').then(
            c => c.InstructorsManagementComponent
          ),
      },
      {
        path: 'instructors/create',
        loadComponent: () =>
          import('./instructors/create/instructors-create.component').then(
            c => c.InstructorsCreateComponent
          ),
      },
      {
        path: 'instructors/:id',
        loadComponent: () =>
          import('./instructors/detail/instructors-detail.component').then(
            c => c.InstructorsDetailComponent
          ),
      },
      {
        path: 'instructors/:id/edit',
        loadComponent: () =>
          import('./instructors/edit/instructors-edit.component').then(
            c => c.InstructorsEditComponent
          ),
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./schedules/schedules-create.component').then(c => c.SchedulesCreateComponent),
      },
    ],
  },
]
