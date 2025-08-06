import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'

import { ScheduleBlock } from '../schedules-create.component'

/**
 * Componente para mostrar un bloque de horario individual
 */
// TODO: SACAR COMPONENTES HTML Y CSS A ARCHIVOS SEPARADOS
@Component({
  selector: 'app-schedule-block',
  standalone: true,
  styleUrl: './schedule-block.component.scss',
  template: `
    <mat-card
      class="schedule-block-card"
      [class.available]="block().available"
      [class.full]="!block().available"
      [class.selected]="selected()"
      (click)="onCardClick()"
    >
      <mat-card-content>
        <div class="block-header">
          <mat-checkbox
            [checked]="selected()"
            (change)="onSelectionChange($event.checked)"
            (click)="$event.stopPropagation()"
            [disabled]="!block().available"
          ></mat-checkbox>
          <span class="capacity-indicator">
            <mat-icon>{{ block().available ? 'group' : 'group_off' }}</mat-icon>
            {{ block().currentReservations || 0 }}/{{ block().maxCapacity }}
          </span>
        </div>

        <div class="block-info">
          <div class="class-type">{{ block().classType }}</div>
          <div class="room">{{ block().room }}</div>

          @if (!block().available) {
          <div class="status-indicator full">
            <mat-icon>warning</mat-icon>
            <span>Completo</span>
          </div>
          } @else {
          <div class="status-indicator available">
            <mat-icon>check_circle</mat-icon>
            <span>Disponible</span>
          </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleBlockComponent {
  /** Datos del bloque de horario */
  readonly block = input.required<ScheduleBlock>()

  /** Si el bloque está seleccionado */
  readonly selected = input<boolean>(false)

  /** Evento cuando cambia la selección */
  readonly selectionChange = output<ScheduleBlock>()

  /** Evento cuando se hace clic en la card */
  readonly click = output<ScheduleBlock>()

  /**
   * Maneja el clic en la card
   */
  protected onCardClick(): void {
    this.click.emit(this.block())
  }

  /**
   * Maneja el cambio de selección del checkbox
   */
  protected onSelectionChange(checked: boolean): void {
    if (this.block().available) {
      this.selectionChange.emit(this.block())
    }
  }
}
