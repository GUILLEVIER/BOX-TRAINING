/**
 * Modelo de datos para un Alumno
 * Define la información personal y de contacto de los alumnos
 */
export interface Student {
  /** Identificador único del alumno */
  id: string

  /** Nombre del alumno */
  firstName: string

  /** Apellido del alumno */
  lastName: string

  /** Email de contacto */
  email: string

  /** Número de teléfono */
  phone: string

  /** Fecha de nacimiento */
  birthDate: Date

  /** Fecha de registro en el sistema */
  registrationDate: Date

  /** Estado actual del alumno */
  status: StudentStatus
}

/**
 * Estados posibles de un alumno
 */
export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * DTO para crear un nuevo alumno
 */
export interface CreateStudentDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: Date
}

/**
 * DTO para actualizar datos de un alumno
 */
export interface UpdateStudentDto extends Partial<CreateStudentDto> {
  id: string
}

/**
 * Alumno con información extendida (incluye plan activo)
 */
export interface DetailedStudent extends Student {
  activePlan?: StudentPlan
  upcomingReservations?: Reservation[]
}

// Importaciones necesarias
import { StudentPlan } from './student-plan.model'
import { Reservation } from './reservation.model'
