/**
 * Modelo de datos para un Plan de entrenamiento
 * Define los tipos de planes disponibles y su configuración
 */
export interface Plan {
  /** Identificador único del plan */
  id: string

  /** Nombre descriptivo del plan */
  name: string

  /** Tipo de entrenamiento del plan */
  type: PlanType[]

  /** Descripción detallada del plan */
  description: string

  /** Duración del plan en días */
  durationDays: number

  /** Número máximo de clases incluidas en el plan */
  includedClasses: number

  /** Precio del plan */
  price: number

  /** Estado actual del plan */
  status: PlanStatus

  /** Fecha de creación del plan */
  creationDate: Date

  /** Fecha de última modificación */
  lastModifiedDate: Date

  /** Documentos asociados al plan */
  documents?: string[]

  /** Imagenes representativas del plan */
  images?: string[]
}

export interface PlanType {
  /** Identificador único del tipo de plan */
  id: string

  /** Nombre descriptivo del tipo de plan */
  // ZUMBA, CROSSFIT, PERSONALIZADO, BOX LIBRE, FUNCIONAL
  name: string

  /** Tipo de formato de entrenamiento */
  format: PlanFormat
}

export enum PlanFormat {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
}

/**
 * Estados posibles de un plan
 */
export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * DTO para crear un nuevo plan
 */
export interface CreatePlanDto {
  name: string
  type: PlanType[]
  description: string
  durationDays: number
  includedClasses: number
  price: number
  documents?: string[]
  images?: string[]
}

/**
 * DTO para crear un nuevo tipo de plan
 */
export interface CreatePlanTypeDto {
  name: string
  format: PlanFormat
}

/**
 * DTO para actualizar un plan existente
 */
export interface UpdatePlanDto extends Partial<CreatePlanDto> {
  id: string
  status?: PlanStatus
}

/**
 * DTO para eliminar un plan existente
 */
export interface DeletePlanDto {
  id: string
}

/**
 * DTO para duplicar un plan existente
 */
export interface DuplicatePlanDto {
  id: string
  newName: string // Nombre del nuevo plan duplicado
}
