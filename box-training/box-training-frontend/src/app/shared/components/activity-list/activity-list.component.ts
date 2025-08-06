import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { ActivityItem } from '../../../interfaces/propsInterface'
import { FormatterService } from '../../services/formatter.service'

/**
 * Componente genérico para mostrar listas de actividades
 * Reutilizable para actividad reciente, reservas, etc.
 */
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent {
  private formatterService: FormatterService = inject(FormatterService)
  /** Lista de elementos de actividad */
  @Input() items: ActivityItem[] = []
  /** Mensaje cuando no hay items */
  @Input() emptyMessage = 'No hay elementos para mostrar'
  /** Subtítulo cuando no hay items */
  @Input() emptySubtitle = 'Todo está funcionando normalmente'
  /** Icono cuando no hay items */
  @Input() emptyIcon = 'info'
  /** Clase CSS adicional para la tarjeta */
  @Input() cardClass?: string

  formatTimestamp(timestamp: string | Date | undefined): string {
    return this.formatterService.formatTimestamp(timestamp)
  }
}
