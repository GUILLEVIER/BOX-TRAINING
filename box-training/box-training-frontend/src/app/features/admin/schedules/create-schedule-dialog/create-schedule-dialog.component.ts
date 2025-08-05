import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'

import { PlanType } from '../../../../core/models/plan.model'
import { Instructor } from '../../../../core/models/instructor.model'

/**
 * Datos que recibe el diálogo para crear horario
 */
interface CreateScheduleDialogData {
  timeSlot: {
    dayOfWeek: number
    startTime: string
    endTime: string
  }
  planTypes: PlanType[]
  instructors: Instructor[]
}

/**
 * Lista de salas/lugares disponibles
 */
const ROOMS = [
  'Sala Principal',
  'Sala de Baile',
  'Sala Privada',
  'Área Funcional',
  'Patio Exterior',
  'Sala de Spinning',
]

/**
 * Diálogo para crear un nuevo horario de clase
 */
@Component({
  selector: 'app-create-schedule-dialog',
  standalone: true,
  templateUrl: './create-schedule-dialog.component.html',
  styleUrl: './create-schedule-dialog.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateScheduleDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateScheduleDialogComponent>)
  private readonly fb = inject(FormBuilder)

  /** Datos del diálogo */
  readonly data: CreateScheduleDialogData = inject(MAT_DIALOG_DATA)

  /** Salas disponibles */
  protected readonly rooms = ROOMS

  /** Estado de carga */
  protected readonly loading = signal(false)

  /** Formulario para crear horario */
  protected createForm: FormGroup

  constructor() {
    this.createForm = this.fb.group({
      classType: ['', Validators.required],
      maxCapacity: [15, [Validators.required, Validators.min(1), Validators.max(50)]],
      instructorId: ['', Validators.required],
      room: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
    })
  }

  /**
   * Obtiene el nombre del día de la semana
   */
  protected getDayName(): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return days[this.data.timeSlot.dayOfWeek]
  }

  /**
   * Cancela la creación y cierra el diálogo
   */
  protected onCancel(): void {
    this.dialogRef.close()
  }

  /**
   * Crea el horario con los datos del formulario
   */
  protected onCreate(): void {
    if (this.createForm.valid) {
      this.loading.set(true)

      const formValue = this.createForm.value
      const scheduleData = {
        dayOfWeek: this.data.timeSlot.dayOfWeek,
        startTime: this.data.timeSlot.startTime,
        endTime: this.data.timeSlot.endTime,
        maxCapacity: formValue.maxCapacity,
        instructorId: formValue.instructorId,
        classType: formValue.classType,
        room: formValue.room,
        description: formValue.description || '',
      }

      // Simular tiempo de procesamiento
      setTimeout(() => {
        this.loading.set(false)
        this.dialogRef.close(scheduleData)
      }, 1000)
    }
  }

  /**
   * Obtiene el nombre completo del instructor
   */
  protected getInstructorName(instructor: Instructor): string {
    return `${instructor.name} ${instructor.lastName}`
  }

  /**
   * Obtiene las especialidades del instructor como string
   */
  protected getInstructorSpecialties(instructor: Instructor): string {
    return instructor.specialties.join(', ')
  }
}
