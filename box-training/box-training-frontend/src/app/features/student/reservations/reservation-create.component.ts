import { Component, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatStepperModule } from '@angular/material/stepper'
import { MatChipsModule } from '@angular/material/chips'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTooltipModule } from '@angular/material/tooltip'

import { Schedule } from '../../../core/models/schedule.model'
import { SchedulesService } from '../../../core/services/schedules.service'
import { LoadingComponent } from '../../../shared/components/loading/loading.component'
import { FilterChipsComponent } from '../../../shared/components/filter-chips/filter-chips.component'
import { PlanType, User } from '../../../core/models'
import { AuthService } from '../../../core/services/auth.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { FilterChip } from '../../../interfaces/propsInterface'

// TODO: SACAR COMPONENTES HTML Y CSS A ARCHIVOS SEPARADOS
@Component({
  selector: 'app-reservation-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatStepperModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTooltipModule,
    LoadingComponent,
    FilterChipsComponent,
  ],
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.scss'],
})
export class ReservationCreateComponent implements OnInit {
  /** Usuario actual */
  currentUser: User | null = null
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly schedulesService = inject(SchedulesService)

  // Signals
  protected readonly loadingSchedules = signal(true)
  protected readonly creating = signal(false)
  protected readonly availableSchedules = signal<Schedule[]>([])
  protected readonly selectedSchedules = signal<string[]>([])
  protected readonly userPlanTypes = signal<PlanType[] | null>(null)

  protected readonly reservationForm: FormGroup
  protected readonly schedulesGroup: FormGroup

  // Computed signal para horarios filtrados
  protected readonly filteredSchedules = computed(() => {
    const planTypes = this.userPlanTypes()
    const schedules = this.availableSchedules()

    console.log('User Plan Types:', planTypes)
    console.log('Available Schedules:', schedules)

    if (!planTypes || schedules.length === 0) {
      return []
    }

    const filtered = schedules.filter(schedule => {
      console.log(
        `Comparing ${schedule.classType} === ${planTypes[0]}:`,
        schedule.classType === planTypes[0]
      )
      return schedule.classType === planTypes[0]
    })

    console.log('Filtered Schedules:', filtered)
    return filtered
  })

  constructor(private authService: AuthService, private mockDataService: MockDataService) {
    this.schedulesGroup = this.fb.group({
      availableSchedules: [[], [Validators.required, this.validateSchedules]],
    })

    // Main form
    this.reservationForm = this.fb.group({
      schedules: this.schedulesGroup,
    })
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.loadSchedules()
  }

  /**
   * Toggles schedule selection
   */
  protected toggleSchedule(scheduleId: string, selected: boolean): void {
    const current = this.selectedSchedules()
    let updated: string[]

    if (selected) {
      updated = [...current, scheduleId]
    } else {
      updated = current.filter(id => id !== scheduleId)
    }

    this.selectedSchedules.set(updated)
    this.schedulesGroup.get('availableSchedules')?.setValue(updated)
  }

  /**
   * Checks if schedule is selected
   */
  protected isScheduleSelected(scheduleId: string): boolean {
    return this.selectedSchedules().includes(scheduleId)
  }

  /**
   * Selects all available schedules
   */
  protected selectAllSchedules(): void {
    const allIds = this.filteredSchedules().map(s => s.id)
    this.selectedSchedules.set(allIds)
    this.schedulesGroup.get('availableSchedules')?.setValue(allIds)
  }

  /**
   * Clears all schedule selections
   */
  protected clearAllSchedules(): void {
    this.selectedSchedules.set([])
    this.schedulesGroup.get('availableSchedules')?.setValue([])
  }

  /**
   * Gets day name from number
   */
  protected getDayName(dayOfWeek: number): string {
    return this.schedulesService.getDayName(dayOfWeek)
  }

  /**
   * Gets schedule display text
   */
  protected getScheduleDisplayText(scheduleId: string): string {
    const schedule = this.availableSchedules().find(s => s.id === scheduleId)
    return schedule ? this.schedulesService.formatScheduleDisplay(schedule) : ''
  }

  /**
   * Loads available schedules
   */
  private loadSchedules(): void {
    this.loadingSchedules.set(true)

    if (!this.currentUser) {
      this.loadingSchedules.set(false)
      return
    }

    // Obtener plan activo del alumno
    const activePlan = this.mockDataService.getStudentActivePlan(this.currentUser.id)

    if (activePlan) {
      // Obtener información del plan para conocer el tipo
      const planInfo = this.mockDataService.getPlanById(activePlan.planId)
      if (planInfo) {
        this.userPlanTypes.set(planInfo.type)
        console.log('Setting user plan type:', planInfo.type)
      }
    }

    this.schedulesService.getSchedules().subscribe({
      next: schedules => {
        this.availableSchedules.set(schedules)
        this.loadingSchedules.set(false)
      },
      error: error => {
        console.error('Error loading schedules:', error)
        this.showErrorMessage('Error al cargar los horarios')
        this.loadingSchedules.set(false)
      },
    })
  }

  /**
   * Custom validator for schedules
   */
  private validateSchedules(control: any) {
    const schedules = control.value
    return schedules && schedules.length > 0 ? null : { required: true }
  }

  /**
   * Shows error message
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    })
  }

  /**
   * Handles form submission
   */
  protected onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos requeridos.')
      return
    }

    this.creating.set(true)
    const selectedSchedules = this.selectedSchedules()

    // Aquí se puede agregar la lógica para enviar la reserva al backend
    console.log('Reservando horarios:', selectedSchedules)

    // Simulación de envío exitoso
    setTimeout(() => {
      this.creating.set(false)
      this.snackBar.open('Reserva creada exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      })
      this.router.navigate(['/reservations'])
    }, 2000)
  }

  /**
   * Gets selected schedules as filter chips
   */
  protected getSelectedSchedulesChips(): FilterChip[] {
    return this.selectedSchedules().map(scheduleId => {
      const schedule = this.availableSchedules().find(s => s.id === scheduleId)
      return {
        key: scheduleId,
        label: schedule ? this.schedulesService.formatScheduleDisplay(schedule) : '',
        value: scheduleId,
        removable: true,
      }
    })
  }

  /**
   * Handles schedule chip removal
   */
  protected onScheduleChipRemoved(chip: FilterChip): void {
    this.toggleSchedule(chip.key, false)
  }
}
