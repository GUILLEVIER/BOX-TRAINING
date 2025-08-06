import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

/**
 * Componente de loading reutilizable
 * Muestra un spinner de carga con mensaje opcional
 */
// TODO: Considerar usar una animación acorde a la aplicación
// o un spinner más estilizado en lugar del predeterminado de Angular Material
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  /** Mensaje a mostrar debajo del spinner */
  @Input() message: string = ''
  /** Tamaño del spinner */
  @Input() size: number = 40
  /** Color del spinner */
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary'
  /** Si debe mostrarse como overlay sobre toda la pantalla */
  @Input() overlay: boolean = false
}
