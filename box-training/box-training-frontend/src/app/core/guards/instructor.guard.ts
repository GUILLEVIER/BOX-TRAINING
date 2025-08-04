import { Injectable } from '@angular/core'
import { UserRole } from '../models'
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class InstructorGuard {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Verifica si el usuario puede activar rutas de instructor
   * @returns true si es instructor, false y redirige si no
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated() && this.authService.hasRole(UserRole.INSTRUCTOR)) {
      return true
    }

    // Redirigir según el rol del usuario
    const user = this.authService.getCurrentUser()
    if (user) {
      // Si está autenticado pero no es instructor, redirigir a su dashboard
      switch (user.role) {
        case UserRole.STUDENT:
          this.router.navigate(['/student/dashboard'])
          break
        case UserRole.ADMINISTRATOR:
          this.router.navigate(['/admin/dashboard'])
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
