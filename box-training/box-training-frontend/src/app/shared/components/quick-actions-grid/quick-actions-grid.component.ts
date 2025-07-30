import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Interfaz para los datos de una acción rápida
 */
export interface QuickAction {
  icon: string;
  title: string;
  description: string;
  action: () => void;
  disabled?: boolean;
}

/**
 * Componente genérico para mostrar grillas de acciones rápidas
 * Reutilizable entre admin y student dashboards
 */
// SE ESTÁ USANDO
@Component({
  selector: 'app-quick-actions-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './quick-actions-grid.component.html',
  styleUrls: ['./quick-actions-grid.component.scss']
})
export class QuickActionsGridComponent {
  /** Lista de acciones rápidas */
  @Input() actions: QuickAction[] = [];
  
  /** Clase CSS adicional para la grilla */
  @Input() gridClass?: string;
  
  /** Número de columnas (opcional) */
  @Input() columns?: number;

  /**
   * Ejecuta una acción
   */
  executeAction(action: QuickAction): void {
    if (!action.disabled) {
      action.action();
    }
  }
}
