import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/**
 * Interfaz para items de actividad
 */
export interface ActivityItem {
  icon?: string;
  iconClass?: string;
  title: string;
  subtitle?: string;
  timestamp?: string | Date;
  data?: any;
}

/**
 * Componente genérico para mostrar listas de actividades
 * Reutilizable para actividad reciente, reservas, etc.
 */
// UNUSED
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent {
  /** Lista de elementos de actividad */
  @Input() items: ActivityItem[] = [];
  
  /** Mensaje cuando no hay items */
  @Input() emptyMessage = 'No hay elementos para mostrar';
  
  /** Subtítulo cuando no hay items */
  @Input() emptySubtitle = 'Todo está funcionando normalmente';
  
  /** Icono cuando no hay items */
  @Input() emptyIcon = 'info';
  
  /** Clase CSS adicional para la tarjeta */
  @Input() cardClass?: string;

  /**
   * Formatea una fecha para mostrar
   */
  formatTimestamp(timestamp: string | Date | undefined): string {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
