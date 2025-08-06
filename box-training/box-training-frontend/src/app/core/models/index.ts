/**
 * Archivo de índice para exportar todos los modelos
 * Facilita la importación de modelos desde otros archivos
 */

// Modelos principales
export * from './plan.model'
export * from './schedule.model'
export * from './student.model'
export * from './instructor.model'
export * from './student-plan.model'
export * from './reservation.model'
export * from './notification.model'
export * from './auth.model'

/**
 * Interfaces comunes utilizadas en toda la aplicación
 */

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Filtros de búsqueda
 */
export interface SearchFilters {
  search?: string
  dateFrom?: Date
  dateTo?: Date
  status?: string
  type?: string
}

/**
 * Opciones de select
 */
export interface SelectOption {
  value: any
  label: string
  disabled?: boolean
}

/**
 * Estadísticas del dashboard
 */
export interface DashboardStats {
  totalPlans: number
  activePlans: number
  totalAssignments: number
  activeAssignments: number
  estimatedRevenue: number
}

/**
 * Configuración de la aplicación
 */
export interface AppConfig {
  apiUrl: string
  tokenKey: string
  refreshTokenKey: string
  defaultPageSize: number
  maxFileSize: number
  allowedFileTypes: string[]
}
