import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente genérico para secciones con título e icono
 * Reutilizable entre diferentes dashboards
 */
// SE ESTÁ USANDO
@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
  /** Icono de la sección */
  @Input() icon!: string;
  
  /** Título de la sección */
  @Input() title!: string;
  
  /** Clase CSS adicional */
  @Input() headerClass?: string;
}
