import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  /**
   * Formatea una fecha para mostrar
   */
  formatTimestamp(timestamp: string | Date | undefined): string {
    if (!timestamp) return ''

    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
}
