import { Routes } from '@angular/router'
import { AdminGuard } from './core/guards/admin.guard'
import { StudentGuard } from './core/guards/student.guard'
import { AuthGuard } from './core/guards/auth.guard'
import { InstructorGuard } from './core/guards/instructor.guard'

/**
 * Configuración de rutas principales de la aplicación
 * Usando lazy loading para optimizar la carga
 */
export const routes: Routes = [
  // Ruta por defecto - redirige al login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // Módulo de autenticación (acceso público)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },

  // Panel de administración (requiere autenticación y rol admin)
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },

  // Panel de estudiante (requiere autenticación)
  {
    path: 'student',
    canActivate: [AuthGuard, StudentGuard],
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes),
  },

  // Panel de profesor (requiere autenticación)
  {
    path: 'instructor',
    canActivate: [AuthGuard, InstructorGuard],
    loadChildren: () =>
      import('./features/instructor/instructor.routes').then(m => m.instructorRoutes),
  },

  // Ruta comodín - página no encontrada
  {
    path: '**',
    redirectTo: '/auth/login',
  },
]
