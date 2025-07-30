/**
 * Modelo de datos para un Plan de entrenamiento
 * Define los tipos de planes disponibles y su configuración
 */
export interface Plan {
  /** Identificador único del plan */
  id: string;

  /** Nombre descriptivo del plan */
  name: string;

  /** Tipo de entrenamiento del plan */
  type: PlanType;

  /** Descripción detallada del plan */
  description: string;

  /** Duración del plan en días */
  durationDays: number;

  /** Número máximo de clases incluidas en el plan */
  includedClasses: number;

  /** Precio del plan */
  price: number;

  /** Estado actual del plan */
  status: PlanStatus;

  /** Array de IDs de horarios disponibles para este plan */
  availableSchedules: string[];

  /** Fecha de creación del plan */
  creationDate: Date;

  /** Fecha de última modificación */
  lastModifiedDate: Date;
}

/**
 * Tipos de planes disponibles en el box
 */
export enum PlanType {
  PERSONALIZED = 'PERSONALIZED',
  CROSSFIT = 'CROSSFIT',
  ZUMBA = 'ZUMBA'
}

/**
 * Estados posibles de un plan
 */
export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

/**
 * DTO para crear un nuevo plan
 */
export interface CreatePlanDto {
  name: string;
  type: PlanType;
  description: string;
  durationDays: number;
  includedClasses: number;
  price: number;
  availableSchedules: string[];
}

/**
 * DTO para actualizar un plan existente
 */
export interface UpdatePlanDto extends Partial<CreatePlanDto> {
  id: string;
  status?: PlanStatus;
}
