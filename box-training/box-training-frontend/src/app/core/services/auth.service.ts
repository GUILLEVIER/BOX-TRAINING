import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginDto, LoginResponse, UserRole } from '../models';
import { MockDataService } from './mock-data.service';

/**
 * Servicio de autenticación
 * Maneja el login, logout y estado de autenticación del usuario
 * Compatible con SSR (Server-Side Rendering)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** Flag para verificar si estamos en el navegador */
  private isBrowser: boolean;

  /** BehaviorSubject para mantener el estado del usuario autenticado */
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Observable público del usuario actual */
  public currentUser$ = this.currentUserSubject.asObservable();

  /** Clave para almacenar el token en localStorage */
  private readonly TOKEN_KEY = 'boxtraining_token';

  /** Clave para almacenar datos del usuario en localStorage */
  private readonly USER_KEY = 'boxtraining_user';

  constructor(
    private mockDataService: MockDataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    // Verificamos si estamos en el navegador
    this.isBrowser = isPlatformBrowser(platformId);

    // Verificar si hay un usuario logueado al inicializar (solo en el navegador)
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  /**
   * Carga el usuario desde localStorage si existe (solo en el navegador)
   */
  private loadUserFromStorage(): void {
    if (!this.isBrowser) {
      return; // No hacer nada en el servidor
    }

    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userData = localStorage.getItem(this.USER_KEY);

      if (token && userData) {
        const user: User = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
    }
  }

  /**
   * Realiza el login del usuario
   * @param credentials Credenciales de login (email y password)
   * @returns Observable con la respuesta del login
   */
  login(credentials: LoginDto): Observable<LoginResponse> {
    // Simular delay de red
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Buscar usuario por email
        const users = this.mockDataService.getUsers();
        console.log("USUARIOS MOCK:", users);
        const user = users.find(u => u.email === credentials.email);

        // Simular validación de password (en un entorno real sería en el backend)
        if (!user || !this.validatePassword(credentials.password, user.role)) {
          throw new Error('Credenciales inválidas');
        }

        // Generar token simulado
        const token = this.generateMockToken(user);

        // Actualizar usuario con token
        const userWithToken: User = {
          ...user,
          token,
          lastAccess: new Date()
        };

        // Guardar en localStorage (solo en el navegador)
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(userWithToken));
        }

        // Actualizar estado
        this.currentUserSubject.next(userWithToken);

        // Retornar respuesta de login
        const response: LoginResponse = {
          user: userWithToken,
          token,
          expiresIn: 24 * 60 * 60 // 24 horas en segundos
        };

        return response;
      })
    );
  }

  /**
   * Valida la password según el rol (simplificado para demo)
   * En un entorno real, esto se haría en el backend
   */
  private validatePassword(password: string, role: UserRole): boolean {
    // Passwords mock para demo
    const mockPasswords = {
      [UserRole.ADMINISTRATOR]: 'admin123',
      [UserRole.STUDENT]: 'student123',
      [UserRole.INSTRUCTOR]: 'instructor123'
    };

    return mockPasswords[role] === password;
  }

  /**
   * Genera un token mock para simulación
   */
  private generateMockToken(user: User): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // En un entorno real, esto sería un JWT real
    return btoa(JSON.stringify({ header, payload }));
  }

  /**
   * Realiza el logout del usuario
   */
  logout(): void {
    // Limpiar localStorage (solo en el navegador)
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }

    // Limpiar estado
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el token actual (solo en el navegador)
   */
  getToken(): string | null {
    if (!this.isBrowser) {
      return null; // No hay token en el servidor
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.currentUserSubject.value;
    return !!(token && user);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario actual tiene un rol específico
   * @param rol Rol a verificar
   */
  hasRole(rol: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === rol;
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMINISTRATOR);
  }

  /**
   * Verifica si el usuario actual es alumno
   */
  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }

  /**
   * Verifica si el usuario actual es instructor
   */
  isInstructor(): boolean {
    return this.hasRole(UserRole.INSTRUCTOR);
  }

  /**
   * Refresca el token (simulado)
   */
  refreshToken(): Observable<string> {
    const user = this.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return of(null).pipe(
      delay(500),
      map(() => {
        const newToken = this.generateMockToken(user);
        const updatedUser = { ...user, token: newToken };

        // Actualizar localStorage solo en el navegador
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, newToken);
          localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        }

        this.currentUserSubject.next(updatedUser);

        return newToken;
      })
    );
  }

  /**
   * Obtiene información de usuarios mock para demo
   * (Solo para mostrar en la interfaz las credenciales de prueba)
   */
  getMockCredentials(): { email: string; password: string; role: string }[] {
    return [
      {
        email: 'admin@boxtraining.com',
        password: 'admin123',
        role: 'Administrador'
      },
      {
        email: 'ana.silva@email.com',
        password: 'student123',
        role: 'Alumno'
      },
      {
        email: 'luis.martinez@email.com',
        password: 'student123',
        role: 'Alumno'
      },
      {
        email: 'guillermo.morales@gmail.com',
        password: 'instructor123',
        role: 'Instructor'
      }
    ];
  }
}
