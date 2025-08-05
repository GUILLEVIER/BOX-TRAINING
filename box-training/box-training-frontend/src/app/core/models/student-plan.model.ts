import { PlanType } from './plan.model'

/**
 * Modelo de datos para la relación Plan-Alumno
 * Define la asignación de un plan específico a un alumno
 */
export interface StudentPlan {
  /** Identificador único de la relación plan-alumno */
  id: string

  /** ID del alumno */
  studentId: string

  /** ID del plan asignado */
  planId: string

  /** Fecha de inicio del plan */
  startDate: Date

  /** Fecha de vencimiento del plan */
  endDate: Date

  /** Número de clases restantes en el plan */
  remainingClasses: number

  /** Estado actual del plan del alumno */
  status: StudentPlanStatus

  /** Motivo de anulación (si aplica) */
  reasonCancellation?: string

  /** Períodos de congelamiento del plan */
  frozenPeriods?: FrozenPeriod[]
}

/**
 * Estados posibles de un plan asignado a un alumno
 */
export enum StudentPlanStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

/**
 * Período de congelamiento de un plan
 */
export interface FrozenPeriod {
  /** Fecha de inicio del congelamiento */
  start: Date

  /** Fecha de fin del congelamiento */
  end: Date

  /** Motivo del congelamiento */
  reason?: string
}

/**
 * DTO para activar un plan a un alumno
 */
export interface ActivatePlanDto {
  studentId: string
  planId: string
  startDate: Date
  includedClasses?: number // Si es diferente al plan base
}

/**
 * DTO para congelar un plan
 */
export interface FreezePlanDto {
  studentPlanId: string
  startDate: Date
  endDate: Date
  reason?: string
}

/**
 * DTO para anular un plan
 */
export interface CancelPlanDto {
  studentPlanId: string
  reason: string
}

/**
 * Plan alumno con información extendida
 */
export interface DetailedStudentPlan extends StudentPlan {
  planName: string
  planType: PlanType
  studentFirstName: string
  studentLastName: string
  remainingDays: number
  nextExpiration: boolean
}
