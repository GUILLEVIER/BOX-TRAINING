import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router, RouterModule, RouterOutlet } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserRole, User } from '../../core/models'
import { AuthService } from '../../core/services/auth.service'

/**
 * Componente principal de layout de la aplicación
 * Contiene la barra de navegación, menú lateral y área de contenido
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: `./main-layout.component.html`,
  styleUrls: [`./main-layout.component.scss`],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  /** Subject para manejar la destrucción del componente */
  private destroy$ = new Subject<void>()

  /** Usuario actual */
  currentUser: User | null = null

  /** Estado de autenticación */
  isAuthenticated = false

  /** Estado del menú lateral */
  isOpen = true

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el estado de autenticación
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user
      this.isAuthenticated = !!user
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Alterna la visibilidad del menú lateral
   */
  toggleSidenav(): void {
    this.isOpen = !this.isOpen
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  isAdmin(): boolean {
    return this.authService.isAdmin()
  }

  /**
   * Verifica si el usuario actual es estudiante
   */
  isStudent(): boolean {
    return this.authService.isStudent()
  }

  /**
   * Obtiene el nombre de display del rol
   */
  getRoleDisplayName(rol?: UserRole): string {
    switch (rol) {
      case UserRole.ADMINISTRATOR:
        return 'Administrador'
      case UserRole.STUDENT:
        return 'Estudiante'
      case UserRole.INSTRUCTOR:
        return 'Instructor'
      default:
        return ''
    }
  }

  /**
   * Navega al perfil del usuario
   */
  navigateToProfile(): void {
    if (this.isAdmin()) {
      console.log('Navigating to admin profile: /admin/profile')
      this.router.navigate(['/admin/profile'])
    } else if (this.isStudent()) {
      console.log('Navigating to student profile: /student/profile')
      this.router.navigate(['/student/profile'])
    } else {
      console.log('Navigating to instructor profile: /instructor/profile')
      this.router.navigate(['/instructor/profile'])
    }
  }

  /**
   * Navega al login
   */
  navigateToLogin(): void {
    this.router.navigate(['/auth/login'])
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout()
    //this.router.navigate(['/auth/login'])
  }
}
