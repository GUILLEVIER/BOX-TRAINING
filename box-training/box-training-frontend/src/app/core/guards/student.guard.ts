import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { UserRole } from '../models/auth.model'

/**
 * Guard que protege las rutas de alumno
 * Solo permite acceso a usuarios con rol ALUMNO
 */
@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Verifica si el usuario puede activar rutas de alumno
   * @returns true si es alumno, false y redirige si no
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole(UserRole.STUDENT)) {
      return true
    }

    // Redirigir según el rol del usuario
    const user = this.authService.getCurrentUser()
    if (user) {
      // Si está autenticado pero no es alumno, redirigir a su dashboard
      switch (user.role) {
        case UserRole.ADMINISTRATOR:
          this.router.navigate(['/admin/dashboard'])
          break
        case UserRole.INSTRUCTOR:
          this.router.navigate(['/instructor/dashboard'])
          break
        default:
          this.router.navigate(['/'])
      }
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/auth/login'])
    }

    return false
  }
}
