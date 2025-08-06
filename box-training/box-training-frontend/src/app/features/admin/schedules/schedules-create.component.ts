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
import { Schedule } from '../../../core/models/schedule.model'
import { User } from '../../../core/models/auth.model'
import { PlanType } from '../../../core/models/plan.model'
import { Instructor } from '../../../core/models/instructor.model'
import { LoadingComponent } from '../../../shared/components/loading/loading.component'

/**
 * Representa un bloque de horario con información adicional para administrador
 */
export interface AdminScheduleBlock extends Schedule {
  dayOfMonth: number
  exists: boolean
  currentReservations?: number
}

/**
 * Componente para la administración y creación de horarios por el administrador
 */
// TODO: SACAR COMPONENTES HTML Y CSS A ARCHIVOS SEPARADOS
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesCreateComponent {
  private readonly authService = inject(AuthService)
  private readonly mockDataService = inject(MockDataService)
  private readonly schedulesService = inject(SchedulesService)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)

  // Signals para el estado del componente
  protected readonly loading = signal(false)
  protected readonly currentUser = signal<User | null>(null)
  protected readonly planTypes = signal<PlanType[]>([])
  protected readonly instructors = signal<Instructor[]>([])
  protected readonly scheduleBlocks = signal<AdminScheduleBlock[]>([])
  protected readonly existingSchedules = signal<Schedule[]>([])

  // Signals para las fechas
  protected readonly startDate = signal<Date | null>(null)
  protected readonly endDate = signal<Date | null>(null)

  // Form para el rango de fechas
  protected dateRangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })

  // Computed para los días seleccionados
  protected readonly selectedDays = computed(() => {
    const start = this.startDate()
    const end = this.endDate()

    if (!start || !end) return []

    const days: Date[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  })

  // Computed para los bloques organizados por día
  protected readonly schedulesByDay = computed(() => {
    const blocks = this.scheduleBlocks()
    const days = this.selectedDays()

    const scheduleMap = new Map<string, AdminScheduleBlock[]>()

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
    this.loadInitialData()
  }

  /**
   * Carga los datos iniciales
   */
  private loadInitialData(): void {
    const user = this.authService.getCurrentUser()
    this.currentUser.set(user)

    // Cargar tipos de plan disponibles
    const planTypes = this.mockDataService.getPlanTypes()
    this.planTypes.set(planTypes)

    // Cargar instructores disponibles
    const instructors = this.mockDataService.getInstructors()
    this.instructors.set(instructors)

    // Cargar horarios existentes
    const schedules = this.mockDataService.getSchedules()
    this.existingSchedules.set(schedules)
  }

  /**
   * Confirma la selección del rango de fechas y carga los horarios
   */
  protected confirmDateSelection(event: Event): void {
    const start = this.dateRangeForm.get('start')?.value
    const end = this.dateRangeForm.get('end')?.value

    if (!start || !end) {
      this.showErrorMessage('Por favor selecciona un rango de fechas válido')
      return
    }

    // Actualizar las signals
    this.startDate.set(start)
    this.endDate.set(end)

    this.loadScheduleGrid()
  }

  /**
   * Carga la grilla de horarios para el rango de fechas seleccionado
   */
  private loadScheduleGrid(): void {
    this.loading.set(true)
    const days = this.selectedDays()
    const existingSchedules = this.existingSchedules()

    if (days.length === 0) {
      this.showErrorMessage('Por favor selecciona un rango de fechas válido')
      this.loading.set(false)
      return
    }

    // Simular carga de datos
    setTimeout(() => {
      const blocks: AdminScheduleBlock[] = []

      days.forEach(day => {
        this.timeSlots.forEach(timeSlot => {
          // Buscar si existe un horario para este día y hora
          const existingSchedule = existingSchedules.find(
            schedule => schedule.dayOfWeek === day.getDay() && schedule.startTime === timeSlot
          )

          if (existingSchedule) {
            // Si existe, crear bloque basado en el horario existente
            blocks.push({
              ...existingSchedule,
              dayOfMonth: day.getDate(),
              exists: true,
              currentReservations: Math.floor(Math.random() * existingSchedule.maxCapacity), // Simular reservas
            })
          } else {
            // Si no existe, crear bloque vacío
            const endTime = this.getEndTime(timeSlot)
            blocks.push({
              id: `empty-${day.getTime()}-${timeSlot}`,
              dayOfWeek: day.getDay(),
              startTime: timeSlot,
              endTime: endTime,
              maxCapacity: 0,
              instructorId: '',
              classType: { id: '', name: '', format: this.planTypes()[0]?.format },
              room: '',
              description: '',
              dayOfMonth: day.getDate(),
              exists: false,
              currentReservations: 0,
            })
          }
        })
      })

      this.scheduleBlocks.set(blocks)
      this.loading.set(false)
    }, 1000)
  }

  /**
   * Obtiene la hora de fin basada en la hora de inicio
   */
  private getEndTime(startTime: string): string {
    const startHour = parseInt(startTime.split(':')[0])
    const endHour = startHour + 1
    return `${endHour.toString().padStart(2, '0')}:00`
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
  protected getBlockForDayAndTime(day: Date, timeSlot: string): AdminScheduleBlock | null {
    const dayKey = this.getDayKey(day)
    const blocks = this.schedulesByDay().get(dayKey) || []
    return blocks.find(block => block.startTime === timeSlot) || null
  }

  /**
   * Obtiene el nombre completo del instructor
   */
  protected getInstructorName(instructorId: string): string {
    const instructor = this.instructors().find(i => i.id === instructorId)
    return instructor ? `${instructor.name} ${instructor.lastName}` : 'Sin asignar'
  }

  /**
   * Maneja el clic en un bloque de horario
   */
  protected onBlockClick(block: AdminScheduleBlock): void {
    if (block.exists) {
      this.openEditScheduleDialog(block)
    } else {
      this.openCreateScheduleDialog(block)
    }
  }

  /**
   * Abre el diálogo para crear un nuevo horario
   */
  private async openCreateScheduleDialog(block: AdminScheduleBlock): Promise<void> {
    try {
      const { CreateScheduleDialogComponent } = await import('./create-schedule-dialog')

      const dialogRef = this.dialog.open(CreateScheduleDialogComponent, {
        width: '600px',
        data: {
          timeSlot: {
            dayOfWeek: block.dayOfWeek,
            startTime: block.startTime,
            endTime: block.endTime,
          },
          planTypes: this.planTypes(),
          instructors: this.instructors(),
        },
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createSchedule(result)
        }
      })
    } catch (error) {
      console.error('Error loading CreateScheduleDialogComponent:', error)
      this.showErrorMessage('Error al cargar el diálogo de creación')
    }
  }

  /**
   * Abre el diálogo para editar un horario existente
   */
  private async openEditScheduleDialog(block: AdminScheduleBlock): Promise<void> {
    try {
      const { EditScheduleDialogComponent } = await import('./edit-schedule-dialog')

      const dialogRef = this.dialog.open(EditScheduleDialogComponent, {
        width: '600px',
        data: {
          schedule: block,
          planTypes: this.planTypes(),
          instructors: this.instructors(),
        },
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'delete') {
          this.deleteSchedule(block)
        } else if (result) {
          this.updateSchedule(result)
        }
      })
    } catch (error) {
      console.error('Error loading EditScheduleDialogComponent:', error)
      this.showErrorMessage('Error al cargar el diálogo de edición')
    }
  }

  /**
   * Crea un nuevo horario
   */
  private createSchedule(scheduleData: any): void {
    this.loading.set(true)

    // Simular creación del horario
    setTimeout(() => {
      const newSchedule: Schedule = {
        id: this.mockDataService.generateId(),
        dayOfWeek: scheduleData.dayOfWeek,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        maxCapacity: scheduleData.maxCapacity,
        instructorId: scheduleData.instructorId,
        classType: scheduleData.classType,
        room: scheduleData.room,
        description: scheduleData.description,
      }

      // Agregar a los datos mock (simulación)
      const currentSchedules = this.existingSchedules()
      this.existingSchedules.set([...currentSchedules, newSchedule])

      this.showSuccessMessage('Horario creado exitosamente')
      this.loadScheduleGrid() // Recargar la grilla
    }, 1000)
  }

  /**
   * Actualiza un horario existente
   */
  private updateSchedule(scheduleData: any): void {
    this.loading.set(true)

    // Simular actualización del horario
    setTimeout(() => {
      const currentSchedules = this.existingSchedules()
      const updatedSchedules = currentSchedules.map(schedule =>
        schedule.id === scheduleData.id ? { ...schedule, ...scheduleData } : schedule
      )
      this.existingSchedules.set(updatedSchedules)

      this.showSuccessMessage('Horario actualizado exitosamente')
      this.loadScheduleGrid() // Recargar la grilla
    }, 1000)
  }

  /**
   * Elimina un horario existente
   */
  private deleteSchedule(block: AdminScheduleBlock): void {
    this.loading.set(true)

    // Simular eliminación del horario
    setTimeout(() => {
      const currentSchedules = this.existingSchedules()
      const filteredSchedules = currentSchedules.filter(schedule => schedule.id !== block.id)
      this.existingSchedules.set(filteredSchedules)

      this.showSuccessMessage('Horario eliminado exitosamente')
      this.loadScheduleGrid() // Recargar la grilla
    }, 1000)
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
