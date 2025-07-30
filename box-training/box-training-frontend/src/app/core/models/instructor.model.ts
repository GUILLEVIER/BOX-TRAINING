/**
 * Modelo de datos para un Instructor
 * Define la información de los instructores del box
 */
export interface Instructor {
  /** Identificador único del instructor */
  id: string;

  /** Nombre del instructor */
  name: string;

  /** Apellido del instructor */
  lastName: string;

  /** Email de contacto */
  email: string;

  /** Número de teléfono */
  phone: string;

  /** Especialidades del instructor */
  specialties: string[];

  /** Biografía del instructor */
  biography: string;

  /** URL de la foto del instructor */
  photo?: string;

  /** Estado actual del instructor */
  status: InstructorState;
}

/**
 * Estados posibles de un instructor
 */
export enum InstructorState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

/**
 * DTO para crear un nuevo instructor
 */
export interface CreateInstructorDto {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  biography: string;
  photo?: string;
}

/**
 * DTO para actualizar un instructor
 */
export interface UpdateInstructorDto extends Partial<CreateInstructorDto> {
  id: string;
}
