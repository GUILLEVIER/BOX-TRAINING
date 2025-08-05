import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { MatTabsModule } from '@angular/material/tabs'
import { MatListModule } from '@angular/material/list'

import { PlanType } from '../../../../core/models/plan.model'
import { Instructor } from '../../../../core/models/instructor.model'
import { AdminScheduleBlock } from '../schedules-create.component'
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'

/**
 * Datos que recibe el diálogo para editar horario
 */
interface EditScheduleDialogData {
  schedule: AdminScheduleBlock
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
 * Diálogo para editar un horario de clase existente
 */
@Component({
  selector: 'app-edit-schedule-dialog',
  standalone: true,
  templateUrl: './edit-schedule-dialog.component.html',
  styleUrl: './edit-schedule-dialog.component.scss',
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
    MatTabsModule,
    MatListModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditScheduleDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditScheduleDialogComponent>)
  private readonly fb = inject(FormBuilder)
  private readonly dialog = inject(MatDialog)

  /** Datos del diálogo */
  readonly data: EditScheduleDialogData = inject(MAT_DIALOG_DATA)

  /** Salas disponibles */
  protected readonly rooms = ROOMS

  /** Estado de carga */
  protected readonly loading = signal(false)

  /** Formulario para editar horario */
  protected editForm: FormGroup

  /** Estudiantes reservados simulados */
  protected readonly reservedStudents = signal([
    { id: '1', firstName: 'Ana', lastName: 'Silva' },
    { id: '2', firstName: 'Luis', lastName: 'Martinez' },
    { id: '3', firstName: 'Carmen', lastName: 'Lopez' },
  ])

  constructor() {
    this.editForm = this.fb.group({
      classType: [this.data.schedule.classType, Validators.required],
      maxCapacity: [
        this.data.schedule.maxCapacity,
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
      instructorId: [this.data.schedule.instructorId, Validators.required],
      room: [this.data.schedule.room, Validators.required],
      description: [this.data.schedule.description || '', Validators.maxLength(500)],
    })
  }

  /**
   * Obtiene el nombre del día de la semana
   */
  protected getDayName(): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return days[this.data.schedule.dayOfWeek]
  }

  /**
   * Obtiene el instructor actual
   */
  protected getCurrentInstructor(): Instructor | undefined {
    return this.data.instructors.find(i => i.id === this.data.schedule.instructorId)
  }

  /**
   * Cancela la edición y cierra el diálogo
   */
  protected onCancel(): void {
    this.dialogRef.close()
  }

  /**
   * Guarda los cambios del horario
   */
  protected onSave(): void {
    if (this.editForm.valid) {
      this.loading.set(true)

      const formValue = this.editForm.value
      const scheduleData = {
        id: this.data.schedule.id,
        dayOfWeek: this.data.schedule.dayOfWeek,
        startTime: this.data.schedule.startTime,
        endTime: this.data.schedule.endTime,
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
   * Confirma y elimina el horario
   */
  protected onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Horario',
        message: `¿Estás seguro de que deseas eliminar esta clase de ${this.data.schedule.classType.name}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete')
      }
    })
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

  /**
   * Verifica si el formulario tiene cambios
   */
  protected hasChanges(): boolean {
    const formValue = this.editForm.value
    const original = this.data.schedule

    return (
      JSON.stringify(formValue.classType) !== JSON.stringify(original.classType) ||
      formValue.maxCapacity !== original.maxCapacity ||
      formValue.instructorId !== original.instructorId ||
      formValue.room !== original.room ||
      (formValue.description || '') !== (original.description || '')
    )
  }
}
