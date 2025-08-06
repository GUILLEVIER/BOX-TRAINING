import { TemplateRef } from '@angular/core'
import { Plan, Reservation, StudentPlan } from '../core/models'

/**
 * Interfaz para definir las propiedades de los botones de acción
 */
export interface ActionButton {
  icon: string
  tooltip: string
  color?: 'primary' | 'accent' | 'warn'
  disabled?: boolean
  action: string
}

export interface MenuAction {
  icon: string
  label: string
  action: string
  disabled?: boolean
}

/**
 * Interfaz para items de actividad
 */
export interface ActivityItem {
  icon?: string
  iconClass?: string
  title: string
  subtitle?: string
  timestamp?: string | Date
  data?: any
}

/**
 * Interfaz para definir los chips de filtro
 */
export interface FilterChip {
  key: string
  label: string
  value: any
  removable?: boolean
}

/**
 * Datos para el diálogo de confirmación
 */
export interface ConfirmDialogData {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'danger'
}

/**
 * Interfaz para definir las columnas de una tabla
 */
export interface TableColumn {
  key: string
  label: string
  sortable: boolean
  template?: TemplateRef<any>
}

/**
 * Configuración de filtros para la tabla
 */
export interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'select'
  options?: { value: any; label: string }[]
  placeholder?: string
}

/**
 * Interfaz para los datos de una acción rápida
 */
export interface QuickAction {
  icon: string
  title: string
  description: string
  action: () => void
  disabled?: boolean
}

/**
 * Interfaz para los datos de una estadística
 */
export interface StatItem {
  icon: string
  value: number | string
  label: string
  sublabel?: string
  iconClass?: string
  cardClass?: string
}

/**
 * Interfaz para los datos del dashboard del alumno
 */
export interface StudentDashboardData {
  activePlan?: StudentPlan
  planInfo?: Plan
  upcomingReservations: Reservation[]
  statistics: {
    availableClasses: number
    scheduledClasses: number
    totalClasses: number
    remainingDays: number
  }
}
