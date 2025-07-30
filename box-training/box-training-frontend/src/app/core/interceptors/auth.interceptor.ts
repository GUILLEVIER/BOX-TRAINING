import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional para autenticación y manejo de errores
 * Agrega el token de autenticación a las peticiones y maneja errores globales
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectar servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Obtener el token de autenticación
  const token = authService.getToken();

  // Clonar la petición y agregar headers de autenticación si existe token
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // Agregar headers comunes
  authReq = authReq.clone({
    headers: authReq.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
  });

  // Continuar con la petición y manejar errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      return handleError(error, authService, router, snackBar);
    })
  );
};

/**
 * Maneja los errores HTTP de forma centralizada
 * @param error Error HTTP recibido
 * @param authService Servicio de autenticación
 * @param router Servicio de navegación
 * @param snackBar Servicio de notificaciones
 */
function handleError(
  error: HttpErrorResponse,
  authService: AuthService,
  router: Router,
  snackBar: MatSnackBar
): Observable<never> {
  let errorMessage = 'Ha ocurrido un error inesperado';

  if (error.error instanceof ErrorEvent) {
    // Error del lado del cliente
    errorMessage = `Error: ${error.error.message}`;
    console.error('Error del cliente:', error.error);
  } else {
    // Error del lado del servidor
    console.error('Error del servidor:', error);

    switch (error.status) {
      case 400:
        errorMessage = 'Solicitud inválida. Verifique los datos enviados.';
        break;
      case 401:
        errorMessage = 'No tiene autorización para realizar esta acción.';
        handleUnauthorized(authService, router);
        break;
      case 403:
        errorMessage = 'No tiene permisos para acceder a este recurso.';
        break;
      case 404:
        errorMessage = 'El recurso solicitado no fue encontrado.';
        break;
      case 409:
        errorMessage = 'Conflicto: El recurso ya existe o hay datos duplicados.';
        break;
      case 422:
        errorMessage = 'Datos de entrada inválidos.';
        if (error.error?.errors) {
          // Si hay errores de validación específicos, mostrar el primero
          const firstError = Object.values(error.error.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
        break;
      case 503:
        errorMessage = 'Servicio temporalmente no disponible.';
        break;
      default:
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
    }
  }

  // Mostrar mensaje de error al usuario
  showErrorMessage(errorMessage, snackBar);

  // Retornar el error para que lo maneje el componente si es necesario
  return throwError(() => new Error(errorMessage));
}

/**
 * Maneja errores de autenticación (401)
 * @param authService Servicio de autenticación
 * @param router Servicio de navegación
 */
function handleUnauthorized(authService: AuthService, router: Router): void {
  // Limpiar sesión y redirigir al login
  authService.logout();
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: router.url }
  });
}

/**
 * Muestra un mensaje de error usando Angular Material Snackbar
 * @param message Mensaje a mostrar
 * @param snackBar Servicio de notificaciones
 */
function showErrorMessage(message: string, snackBar: MatSnackBar): void {
  snackBar.open(message, 'Cerrar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['error-snackbar']
  });
}
