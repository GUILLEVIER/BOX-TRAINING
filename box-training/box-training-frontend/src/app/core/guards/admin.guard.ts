import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

/**
 * Guard que protege las rutas de administrador
 * Solo permite acceso a usuarios con rol ADMINISTRADOR
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Verifica si el usuario puede activar rutas de administrador
   * @returns true si es administrador, false y redirige si no
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole(UserRole.ADMINISTRATOR)) {
      return true;
    }

    // Redirigir según el rol del usuario
    const user = this.authService.getCurrentUser();
    if (user) {
      // Si está autenticado pero no es admin, redirigir a su dashboard
      switch (user.role) {
        case UserRole.STUDENT:
          this.router.navigate(['/student/dashboard']);
          break;
        case UserRole.INSTRUCTOR:
          this.router.navigate(['/instructor/dashboard']);
          break;
        default:
          this.router.navigate(['/']);
      }
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/auth/login']);
    }
    return false;
  }
}
