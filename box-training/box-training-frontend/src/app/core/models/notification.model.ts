/**
 * Modelo de datos para las Notificaciones
 * Define las notificaciones del sistema para los alumnos
 */
export interface Notification {
  /** Identificador único de la notificación */
  id: string;

  /** ID del alumno destinatario */
  studentId: string;

  /** Tipo de notificación */
  type: NotificationType;

  /** Título de la notificación */
  title: string;

  /** Mensaje de la notificación */
  message: string;

  /** Fecha de creación de la notificación */
  creationDate: Date;

  /** Fecha de envío (si ya fue enviada) */
  sendingDate?: Date;

  /** Indica si la notificación fue leída */
  read: boolean;

  /** Indica si requiere alguna acción del usuario */
  actionRequired?: boolean;

  /** Datos adicionales relacionados con la notificación */
  data?: any;
}

/**
 * Tipos de notificaciones disponibles
 */
export enum NotificationType {
  SPOT_AVAILABLE = 'SPOT_AVAILABLE',
  REMINDER = 'REMINDER',
  PLAN_EXPIRATION = 'PLAN_EXPIRATION',
  CANCELLATION = 'CANCELLATION',
  RESERVATION_CONFIRMATION = 'RESERVATION_CONFIRMATION',
  PLAN_ACTIVATED = 'PLAN_ACTIVATED',
  PLAN_FROZEN = 'PLAN_FROZEN',
  PLAN_CANCELED = 'PLAN_CANCELED'
}

/**
 * DTO para crear una nueva notificación
 */
export interface CreateNotificationDto {
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionRequired?: boolean;
  data?: any;
}

/**
 * Configuración de recordatorios del usuario
 */
export interface UserReminderSettings {
  studentId: string;
  reminder24h: boolean;
  reminder2h: boolean;
  reminderExpiration: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}
