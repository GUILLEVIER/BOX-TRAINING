/**
 * Modelos para autenticación y autorización
 */

/**
 * Información del usuario logueado
 */
export interface User {
  /** Identificador único del usuario */
  id: string

  /** Email del usuario */
  email: string

  /** Nombre del usuario */
  name: string

  /** Apellido del usuario */
  lastName: string

  /** Rol del usuario en el sistema */
  role: UserRole

  /** Token de autenticación */
  token?: string

  /** Fecha de último acceso */
  lastAccess?: Date
}

/**
 * Roles disponibles en el sistema
 */
export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
}

/**
 * DTO para login
 */
export interface LoginDto {
  email: string
  password: string
}

/**
 * DTO para registro de nuevo usuario
 */
export interface RegisterDto {
  email: string
  password: string
  name: string
  lastName: string
  phone: string
  birthDate: Date
}

/**
 * Respuesta del login
 */
export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
