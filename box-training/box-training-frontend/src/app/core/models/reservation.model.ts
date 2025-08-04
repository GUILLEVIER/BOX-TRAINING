/**
 * Modelo de datos para una Reserva
 * Define el agendamiento de un alumno en un horario específico
 */
export interface Reservation {
  /** Identificador único de la reserva */
  id: string

  /** ID del alumno que realizó la reserva */
  studentId: string

  /** ID del horario reservado */
  scheduleId: string

  /** Fecha específica de la clase reservada */
  date: Date

  /** Estado actual de la reserva */
  status: ReservationStatus

  /** Fecha y hora en que se realizó la reserva */
  reservationDate: Date

  /** Fecha de cancelación (si aplica) */
  cancellationDate?: Date
}

/**
 * Estados posibles de una reserva
 */
export enum ReservationStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * DTO para crear una nueva reserva
 */
export interface CreateReservationDto {
  studentId: string
  scheduleId: string
  date: Date
}

/**
 * DTO para cancelar una reserva
 */
export interface CancelReservationDto {
  reservationId: string
}

/**
 * Reserva con información extendida
 */
export interface DetailedReservation extends Reservation {
  studentFirstName: string
  studentLastName: string
  scheduleDescription: string
  instructorFirstName: string
  classType: string
  startTime: string
  endTime: string
  room: string
  canCancel: boolean
}

/**
 * Información de disponibilidad para agendar
 */
export interface ScheduleAvailability {
  scheduleId: string
  date: Date
  availableSlots: number
  maxCapacity: number
  isAvailable: boolean
}
