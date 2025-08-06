import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatExpansionModule } from '@angular/material/expansion'
import {
  DetailedStudent,
  StudentStatus,
  StudentPlan,
  StudentPlanStatus,
  Plan,
  ActivatePlanDto,
  FreezePlanDto,
  CancelPlanDto,
} from '../../../../core/models'
import { StudentsService } from '../../../../core/services/students.service'
import { PlansService } from '../../../../core/services/plans.service'
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'
import { ConfirmDialogData } from '../../../../interfaces/propsInterface'

/**
 * Componente para mostrar los detalles de un estudiante
 * Incluye información completa del estudiante y acciones disponibles
 */
@Component({
  selector: 'app-students-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    PageHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './students-detail.component.html',
  styleUrls: ['./students-detail.component.scss'],
})
export class StudentsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)
  private readonly fb = inject(FormBuilder)
  private readonly studentsService = inject(StudentsService)
  private readonly plansService = inject(PlansService)

  // Signals
  protected readonly loading = signal(true)
  protected readonly student = signal<DetailedStudent | null>(null)
  protected readonly studentId = signal<string | null>(null)
  protected readonly availablePlans = signal<Plan[]>([])
  protected readonly showActivatePlan = signal(false)
  protected readonly showFreezePlan = signal(false)
  protected readonly showCancelPlan = signal(false)

  // Forms
  protected readonly activatePlanForm: FormGroup
  protected readonly freezePlanForm: FormGroup
  protected readonly cancelPlanForm: FormGroup

  // Computed signals
  protected readonly hasActivePlan = computed(() => {
    const currentStudent = this.student()
    return currentStudent?.activePlan?.status === StudentPlanStatus.ACTIVE
  })

  protected readonly hasPaidPlan = computed(() => {
    const currentStudent = this.student()
    return currentStudent?.activePlan?.status === StudentPlanStatus.PAID
  })

  protected readonly canActivatePlan = computed(() => {
    return this.hasPaidPlan() && !this.hasActivePlan()
  })

  protected readonly studentFullName = computed(() => {
    const currentStudent = this.student()
    return currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : ''
  })

  constructor() {
    // Initialize forms
    this.activatePlanForm = this.fb.group({
      planId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
    })

    this.freezePlanForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      reason: [''],
    })

    this.cancelPlanForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.studentId.set(id)
        this.loadStudent(id)
        this.loadAvailablePlans()
      }
    })
  }

  /**
   * Carga los datos del estudiante
   */
  private loadStudent(id: string): void {
    this.loading.set(true)

    this.studentsService.getStudentById(id).subscribe({
      next: student => {
        this.student.set(student)
        this.loading.set(false)
      },
      error: error => {
        console.error('Error al cargar estudiante:', error)
        this.showErrorMessage('Error al cargar los detalles del estudiante')
        this.loading.set(false)
        this.goBack()
      },
    })
  }

  /**
   * Carga los planes disponibles
   */
  private loadAvailablePlans(): void {
    this.plansService.getPlans().subscribe({
      next: response => {
        this.availablePlans.set(response.data.filter(plan => plan.status === 'ACTIVE'))
      },
      error: error => {
        console.error('Error al cargar planes:', error)
      },
    })
  }

  /**
   * Navega al formulario de edición
   */
  protected editStudent(): void {
    const id = this.studentId()
    if (id) {
      this.router.navigate(['/admin/students', id, 'edit'])
    }
  }

  /**
   * Alterna el estado del estudiante
   */
  protected toggleStudentStatus(): void {
    const currentStudent = this.student()
    if (!currentStudent) return

    const newStatus =
      currentStudent.status === StudentStatus.ACTIVE ? StudentStatus.INACTIVE : StudentStatus.ACTIVE
    const action = newStatus === StudentStatus.ACTIVE ? 'activar' : 'desactivar'

    const dialogData: ConfirmDialogData = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Estudiante`,
      message: `¿Está seguro que desea ${action} al estudiante "${this.studentFullName()}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed && currentStudent) {
          this.studentsService.toggleStudentStatus(currentStudent.id, newStatus).subscribe({
            next: () => {
              this.showSuccessMessage('Estudiante modificado exitosamente')
              this.loadStudent(currentStudent.id)
            },
            error: error => {
              this.showErrorMessage(`Error al ${action} el estudiante`)
            },
          })
        }
      })
  }

  /**
   * Elimina el estudiante
   */
  protected deleteStudent(): void {
    const currentStudent = this.student()
    if (!currentStudent) return

    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Estudiante',
      message: `¿Está seguro que desea eliminar al estudiante "${this.studentFullName()}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed && currentStudent) {
          this.studentsService.deleteStudent(currentStudent.id).subscribe({
            next: () => {
              this.showSuccessMessage('Estudiante eliminado exitosamente')
              this.router.navigate(['/admin/students'])
            },
            error: error => {
              this.showErrorMessage(error.message || 'Error al eliminar el estudiante')
            },
          })
        }
      })
  }

  /**
   * Muestra el formulario para activar plan
   */
  protected showActivatePlanForm(): void {
    this.showActivatePlan.set(true)
    this.activatePlanForm.patchValue({
      startDate: new Date(),
    })
  }

  /**
   * Activa el plan del estudiante
   */
  protected activatePlan(): void {
    if (this.activatePlanForm.invalid) return

    const currentStudent = this.student()
    if (!currentStudent?.activePlan) return

    const formValue = this.activatePlanForm.value
    const activateData: ActivatePlanDto = {
      studentId: currentStudent.id,
      planId: formValue.planId || currentStudent.activePlan.planId,
      startDate: formValue.startDate,
    }

    this.studentsService.activateStudentPlan(activateData).subscribe({
      next: response => {
        if (response.success) {
          this.showSuccessMessage(response.message || 'Plan activado exitosamente')
          this.showActivatePlan.set(false)
          this.loadStudent(currentStudent.id)
        } else {
          this.showErrorMessage(response.message || 'Error al activar el plan')
        }
      },
      error: error => {
        this.showErrorMessage('Error al activar el plan')
      },
    })
  }

  /**
   * Muestra el formulario para congelar plan
   */
  protected showFreezePlanForm(): void {
    this.showFreezePlan.set(true)
    this.freezePlanForm.patchValue({
      startDate: new Date(),
    })
  }

  /**
   * Congela el plan del estudiante
   */
  protected freezePlan(): void {
    if (this.freezePlanForm.invalid) return

    const currentStudent = this.student()
    if (!currentStudent?.activePlan) return

    const formValue = this.freezePlanForm.value
    const freezeData: FreezePlanDto = {
      studentPlanId: currentStudent.activePlan.id,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      reason: formValue.reason,
    }

    this.studentsService.freezeStudentPlan(freezeData).subscribe({
      next: response => {
        if (response.success) {
          this.showSuccessMessage(response.message || 'Plan congelado exitosamente')
          this.showFreezePlan.set(false)
          this.loadStudent(currentStudent.id)
        } else {
          this.showErrorMessage(response.message || 'Error al congelar el plan')
        }
      },
      error: error => {
        this.showErrorMessage('Error al congelar el plan')
      },
    })
  }

  /**
   * Muestra el formulario para anular plan
   */
  protected showCancelPlanForm(): void {
    this.showCancelPlan.set(true)
  }

  /**
   * Anula el plan del estudiante
   */
  protected cancelPlan(): void {
    if (this.cancelPlanForm.invalid) return

    const currentStudent = this.student()
    if (!currentStudent?.activePlan) return

    const formValue = this.cancelPlanForm.value
    const cancelData: CancelPlanDto = {
      studentPlanId: currentStudent.activePlan.id,
      reason: formValue.reason,
    }

    const dialogData: ConfirmDialogData = {
      title: 'Anular Plan',
      message: `¿Está seguro que desea anular el plan del estudiante? Esta acción no se puede deshacer.`,
      confirmText: 'Anular Plan',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.studentsService.cancelStudentPlan(cancelData).subscribe({
            next: response => {
              if (response.success) {
                this.showSuccessMessage(response.message || 'Plan anulado exitosamente')
                this.showCancelPlan.set(false)
                this.loadStudent(currentStudent!.id)
              } else {
                this.showErrorMessage(response.message || 'Error al anular el plan')
              }
            },
            error: error => {
              this.showErrorMessage('Error al anular el plan')
            },
          })
        }
      })
  }

  /**
   * Cancela la acción actual
   */
  protected cancelAction(): void {
    this.showActivatePlan.set(false)
    this.showFreezePlan.set(false)
    this.showCancelPlan.set(false)
    this.activatePlanForm.reset()
    this.freezePlanForm.reset()
    this.cancelPlanForm.reset()
  }

  /**
   * Navega de vuelta a la lista de estudiantes
   */
  protected goBack(): void {
    this.router.navigate(['/admin/students'])
  }

  /**
   * Obtiene el color del chip para el estado del estudiante
   */
  protected getStudentStatusChipColor(status: StudentStatus): string {
    return status === StudentStatus.ACTIVE ? 'primary' : ''
  }

  /**
   * Obtiene el color del chip para el estado del plan
   */
  protected getPlanStatusChipColor(status: StudentPlanStatus): string {
    switch (status) {
      case StudentPlanStatus.ACTIVE:
        return 'primary'
      case StudentPlanStatus.PAID:
        return 'accent'
      case StudentPlanStatus.PENDING_PAYMENT:
        return 'warn'
      case StudentPlanStatus.FROZEN:
        return ''
      case StudentPlanStatus.CANCELED:
      case StudentPlanStatus.EXPIRED:
        return 'warn'
      default:
        return ''
    }
  }

  /**
   * Obtiene el texto para mostrar del estado del plan
   */
  protected getPlanStatusText(status: StudentPlanStatus): string {
    switch (status) {
      case StudentPlanStatus.PENDING_PAYMENT:
        return 'Pendiente de Pago'
      case StudentPlanStatus.PAID:
        return 'Pagado'
      case StudentPlanStatus.ACTIVE:
        return 'Activo'
      case StudentPlanStatus.FROZEN:
        return 'Congelado'
      case StudentPlanStatus.CANCELED:
        return 'Anulado'
      case StudentPlanStatus.EXPIRED:
        return 'Vencido'
      default:
        return status
    }
  }

  /**
   * Formatea una fecha
   */
  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  /**
   * Calcula la edad del estudiante
   */
  protected calculateAge(birthDate: Date): number {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  /**
   * Muestra un mensaje de éxito
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    })
  }

  /**
   * Muestra un mensaje de error
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    })
  }
}
