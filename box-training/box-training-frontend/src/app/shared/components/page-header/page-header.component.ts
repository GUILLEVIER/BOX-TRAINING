import { Component, Input, TemplateRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'

/**
 * Componente Header de la página que muestra el título, subtítulo, icono y acciones adicionales.
 * Permite la navegación hacia atrás y la inclusión de acciones personalizadas.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title!: string
  @Input() subtitle?: string
  @Input() titleIcon?: string
  @Input() showBackButton: boolean = false
  @Input() backIcon: string = 'arrow_back'
  @Input() backTooltip: string = 'Volver'
  @Input() actions?: TemplateRef<any>

  onBackClick(): void {
    window.history.back()
  }
}
