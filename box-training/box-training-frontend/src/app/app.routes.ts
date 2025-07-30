import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { StudentGuard } from './core/guards/student.guard';
import { AuthGuard } from './core/guards/auth.guard';

/**
 * Configuración de rutas principales de la aplicación
 * Usando lazy loading para optimizar la carga
 */
export const routes: Routes = [
  // Ruta por defecto - redirige al login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // Módulo de autenticación (acceso público)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Panel de administración (requiere autenticación y rol admin)
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // Panel de estudiante (requiere autenticación)
  {
    path: 'student',
    canActivate: [AuthGuard, StudentGuard],
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes)
  },

  // Ruta comodín - página no encontrada
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
