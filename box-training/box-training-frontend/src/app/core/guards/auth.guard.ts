import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard que protege las rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Verifica si el usuario puede activar la ruta
   * @returns true si está autenticado, false y redirige al login si no
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Redirigir al login si no está autenticado
    this.router.navigate(['/auth/login']);
    return false;
  }
}
