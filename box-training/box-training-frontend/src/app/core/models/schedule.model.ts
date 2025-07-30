/**
 * Modelo de datos para un Horario de clase
 * Define la programación de clases en el box
 */
export interface Schedule {
  /** Identificador único del horario */
  id: string;

  /** Día de la semana (0-6, donde 0 es Domingo) */
  dayOfWeek: number;

  /** Hora de inicio en formato HH:mm */
  startTime: string;

  /** Hora de finalización en formato HH:mm */
  endTime: string;

  /** Capacidad máxima de alumnos para esta clase */
  maxCapacity: number;

  /** ID del instructor asignado */
  instructorId: string;

  /** Tipo de clase que se dicta en este horario */
  classType: PlanType;

  /** Salon o área donde se dicta la clase */
  room: string;

  /** Descripción adicional del horario */
  description: string;

  /** Ocupación actual del horario */
  currentOccupancy?: number;
}

/**
 * Importamos TipoPlan desde el modelo de plan
 */
import { PlanType } from './plan.model';

/**
 * DTO para crear un nuevo horario
 */
export interface CreateScheduleDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  instructorId: string;
  classType: PlanType;
  room: string;
  description: string;
}

/**
 * DTO para actualizar un horario existente
 */
export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {
  id: string;
}

/**
 * Horario con información extendida (incluye datos del instructor)
 */
export interface ScheduleDetail extends Schedule {
  instructorFirstName: string;
  instructorLastName: string;
  studentsReserved: StudentReservation[];
  available: boolean;
}

/**
 * Información básica de un alumno en una reserva
 */
export interface StudentReservation {
  id: string;
  firstName: string;
  lastName: string;
}
