import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

/**
 * Componente para encabezados principales de la aplicación
 * Muestra un título y un icono, con soporte para mostrar el nombre de usuario y rol
 */
@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent {
  /** Icono a mostrar en el encabezado */
  @Input() icon: string = 'dashboard'
  @Input() title: string = 'Dashboard'
  @Input() userName?: string
  @Input() userRole?: string
}
