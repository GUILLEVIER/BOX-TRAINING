import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Interfaz para los datos de una estadística
 */
export interface StatItem {
  icon: string;
  value: number | string;
  label: string;
  sublabel?: string;
  iconClass?: string;
  cardClass?: string;
}

/**
 * Componente genérico para mostrar grillas de estadísticas
 * Reutilizable entre admin y student dashboards
 */
// SE ESTÁ USANDO
@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stats-grid.component.html',
  styleUrls: ['./stats-grid.component.scss']
})
export class StatsGridComponent {
  /** Lista de estadísticas a mostrar */
  @Input() stats: StatItem[] = [];
  
  /** Clase CSS adicional para la grilla */
  @Input() gridClass?: string;
  
  /** Número de columnas (opcional) */
  @Input() columns?: number;
}
