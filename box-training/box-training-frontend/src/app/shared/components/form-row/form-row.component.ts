import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
/**
 * Componente para crear una fila de formulario
 * Permite agrupar controles de formulario en una fila
 */
@Component({
  selector: 'app-form-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-row" [class.full-width]="fullWidth">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './form-row.component.scss',
})
export class FormRowComponent {
  @Input() fullWidth: boolean = false
}
