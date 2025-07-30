import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { FormRowComponent } from '../../../shared/components';

/**
 * Componente de login
 * Permite a los usuarios autenticarse en el sistema
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    FormRowComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /** Formulario de login */
  loginForm: FormGroup;

  /** Estado de carga */
  loading = false;

  /** Ocultar contraseña */
  hidePassword = true;

  /** URL de retorno después del login */
  returnUrl = '/';

  /** Credenciales mock para demo */
  mockCredentials: Array<{ email: string, password: string, role: string }> = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Inicializar formulario
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.redirectToUserDashboard();
    }

    // Obtener credenciales mock para mostrar en la UI
    this.mockCredentials = this.authService.getMockCredentials();
  }

  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          this.showSuccessMessage(`¡Bienvenido ${response.user.name}!`);
          this.redirectToUserDashboard();
        },
        error: (error) => {
          this.loading = false;
          this.showErrorMessage(error.message || 'Error al iniciar sesión');
        }
      });
    }
  }

  /**
   * Rellena las credenciales en el formulario
   * @param email Email a rellenar
   * @param password Contraseña a rellenar
   */
  fillCredentials(email: string, password: string): void {
    this.loginForm.patchValue({
      email: email,
      password: password
    });
  }

  /**
   * Redirige al usuario a su dashboard correspondiente
   */
  private redirectToUserDashboard(): void {
    const user = this.authService.getCurrentUser();

    if (user) {
      switch (user.role) {
        case UserRole.ADMINISTRATOR:
          this.router.navigate(['/admin/dashboard']);
          break;
        case UserRole.STUDENT:
          this.router.navigate(['/student/dashboard']);
          break;
        case UserRole.INSTRUCTOR:
          this.router.navigate(['/instructor/dashboard']);
          break;
        default:
          this.router.navigate([this.returnUrl]);
      }
    } else {
      this.router.navigate([this.returnUrl]);
    }
  }

  /**
   * Muestra un mensaje de éxito
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra un mensaje de error
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
