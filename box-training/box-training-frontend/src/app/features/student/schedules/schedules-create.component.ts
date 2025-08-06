import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDialog } from '@angular/material/dialog'

import { AuthService } from '../../../core/services/auth.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { SchedulesService } from '../../../core/services/schedules.service'
import { Schedule, ScheduleDetail } from '../../../core/models/schedule.model'
import { User } from '../../../core/models/auth.model'
import { PlanType } from '../../../core/models/plan.model'
import { LoadingComponent } from '../../../shared/components/loading/loading.component'
import { ScheduleBlockComponent } from './schedule-block'

/**
 * Representa un bloque de horario con información adicional
 */
export interface ScheduleBlock extends Schedule {
  dayOfMonth: number
  available: boolean
  currentReservations?: number
  isSelected?: boolean
}

/**
 * Componente para la visualización y reserva de horarios por rango de fechas
 */
@Component({
  selector: 'app-schedules-create',
  standalone: true,
  templateUrl: './schedules-create.component.html',
  styleUrl: './schedules-create.component.scss',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    LoadingComponent,
    ScheduleBlockComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesCreateComponent {
  private readonly authService = inject(AuthService)
  private readonly mockDataService = inject(MockDataService)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)

  // Signals para el estado del componente
  protected readonly loading = signal(false)
  protected readonly currentUser = signal<User | null>(null)
  protected readonly userPlanTypes = signal<PlanType[] | null>(null)
  protected readonly scheduleBlocks = signal<ScheduleBlock[]>([])
  protected readonly selectedSchedules = signal<string[]>([])
  protected readonly reserving = signal(false)

  // Signals para las fechas
  protected readonly startDate = signal<Date | null>(null)
  protected readonly endDate = signal<Date | null>(null)

  // Form para el rango de fechas (mantener para el template)
  protected dateRangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })

  // Computed para los días seleccionados
  protected readonly selectedDays = computed(() => {
    console.log('Ejecutando selectedDays computed')
    const start = this.startDate()
    const end = this.endDate()

    console.log('Rango de fechas seleccionado:', start, end)

    if (!start || !end) return []

    const days: Date[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    console.log('Días calculados:', days)
    return days
  })

  // Computed para los bloques organizados por día
  protected readonly schedulesByDay = computed(() => {
    const blocks = this.scheduleBlocks()
    const days = this.selectedDays()

    const scheduleMap = new Map<string, ScheduleBlock[]>()

    days.forEach(day => {
      const dayKey = this.getDayKey(day)
      const dayBlocks = blocks.filter(
        block => block.dayOfWeek === day.getDay() && block.dayOfMonth === day.getDate()
      )
      scheduleMap.set(dayKey, dayBlocks)
    })

    return scheduleMap
  })

  // Horarios disponibles (6 AM a 8 PM)
  protected readonly timeSlots = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ]

  constructor() {
    this.loadUserData()
  }

  /**
   * Carga los datos del usuario actual
   */
  private loadUserData(): void {
    const user = this.authService.getCurrentUser()
    this.currentUser.set(user)

    if (user) {
      const activePlan = this.mockDataService.getStudentActivePlan(user.id)
      if (activePlan) {
        const planInfo = this.mockDataService.getPlanById(activePlan.planId)
        if (planInfo) {
          this.userPlanTypes.set(planInfo.type)
        }
      }
    }
  }

  /**
   * Confirma la selección del rango de fechas y carga los horarios
   */
  protected confirmDateSelection(event: Event): void {
    console.log('Evento:', event)
    console.log('Form válido:', this.dateRangeForm.valid)
    console.log('Form value completo:', this.dateRangeForm.value)

    const start = this.dateRangeForm.get('start')?.value
    const end = this.dateRangeForm.get('end')?.value

    if (!start || !end) {
      this.showErrorMessage('Por favor selecciona un rango de fechas válido')
      return
    }

    // Actualizar las signals
    this.startDate.set(start)
    this.endDate.set(end)

    console.log('IRÉ A CARGAR HORARIOS PARA EL RANGO:', start, end)
    this.loadSchedules()
  }

  /**
   * Carga los horarios para el rango de fechas seleccionado
   */
  private loadSchedules(): void {
    console.log('Iniciando loadSchedules')
    this.loading.set(true)
    const days = this.selectedDays()
    const planTypes = this.userPlanTypes()

    console.log('PLAN: ', planTypes)
    console.log('DAYS: ', days)

    if (!planTypes || days.length === 0) {
      this.showErrorMessage('Por favor selecciona un plan y un rango de fechas válido')
      this.loading.set(false)
      return
    }

    // Simular carga de horarios
    setTimeout(() => {
      const blocks: ScheduleBlock[] = []

      days.forEach(day => {
        this.timeSlots.forEach((timeSlot, index) => {
          const endTime = this.timeSlots[index + 1] || '21:00'

          // Simular algunos horarios disponibles
          if (Math.random() > 0.3) {
            // 70% de probabilidad de tener clase
            const block: ScheduleBlock = {
              id: `${day.getTime()}-${timeSlot}`,
              dayOfWeek: day.getDay(),
              dayOfMonth: day.getDate(),
              startTime: timeSlot,
              endTime: endTime,
              maxCapacity: 15,
              instructorId: '1',
              classType: {
                id: planTypes[Math.floor(Math.random() * planTypes.length)].id,
                name: planTypes[Math.floor(Math.random() * planTypes.length)].name,
                format: planTypes[Math.floor(Math.random() * planTypes.length)].format,
              },
              room: 'Sala Principal',
              description: `Clase de ${
                planTypes[Math.floor(Math.random() * planTypes.length)].name
              } - ${timeSlot}`,
              available: Math.random() > 0.2, // 80% disponible
              currentReservations: Math.floor(Math.random() * 15),
              isSelected: false,
            }
            blocks.push(block)
          }
        })
      })

      console.log('Bloques generados:', blocks)
      this.scheduleBlocks.set(blocks)
      this.loading.set(false)
    }, 1000)
  }

  /**
   * Obtiene la clave para un día específico
   */
  protected getDayKey(day: Date): string {
    return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
  }

  /**
   * Obtiene el nombre del día
   */
  protected getDayName(day: Date): string {
    return day.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })
  }

  /**
   * Obtiene los bloques para un día específico y hora
   */
  protected getBlockForDayAndTime(day: Date, timeSlot: string): ScheduleBlock | null {
    const dayKey = this.getDayKey(day)
    const blocks = this.schedulesByDay().get(dayKey) || []
    return blocks.find(block => block.startTime === timeSlot) || null
  }

  /**
   * Maneja el clic en un bloque de horario
   */
  protected onBlockClick(block: ScheduleBlock): void {
    this.openScheduleDetail(block)
  }

  /**
   * Selecciona o deselecciona un bloque de horario
   */
  protected toggleScheduleSelection(block: ScheduleBlock): void {
    const current = this.selectedSchedules()
    let updated: string[]

    if (current.includes(block.id)) {
      updated = current.filter(id => id !== block.id)
    } else {
      updated = [...current, block.id]
    }

    this.selectedSchedules.set(updated)
  }

  /**
   * Verifica si un horario está seleccionado
   */
  protected isScheduleSelected(scheduleId: string): boolean {
    return this.selectedSchedules().includes(scheduleId)
  }

  /**
   * Abre el diálogo de detalle del horario
   */
  private async openScheduleDetail(block: ScheduleBlock): Promise<void> {
    const { ScheduleDetailDialogComponent } = await import(
      './schedule-detail-dialog/schedule-detail-dialog.component'
    )

    const dialogRef = this.dialog.open(ScheduleDetailDialogComponent, {
      width: '500px',
      data: block,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reserve') {
        this.toggleScheduleSelection(block)
      }
    })
  }

  /**
   * Realiza la reserva de los horarios seleccionados
   */
  protected reserveSelectedSchedules(): void {
    if (this.selectedSchedules().length === 0) {
      this.showErrorMessage('Selecciona al menos un horario para reservar')
      return
    }

    this.reserving.set(true)

    // Simular proceso de reserva
    setTimeout(() => {
      this.reserving.set(false)
      this.showSuccessMessage(
        `Se reservaron ${this.selectedSchedules().length} horarios exitosamente`
      )
      this.selectedSchedules.set([])
    }, 2000)
  }

  /**
   * Limpia todas las selecciones
   */
  protected clearSelections(): void {
    this.selectedSchedules.set([])
  }

  /**
   * Muestra mensaje de error
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    })
  }

  /**
   * Muestra mensaje de éxito
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    })
  }
}
