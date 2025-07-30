import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core'
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
import { PlanType, CreatePlanDto } from '../../../../core/models/plan.model'
import { PlansService } from '../../../../core/services/plans.service'
import { PageHeaderComponent, FormRowComponent } from '../../../../shared/components'

/**
 * Componente para crear nuevos planes de entrenamiento
 * Incluye formulario con validaciones
 */
@Component({
  selector: 'app-plans-create',
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
    PageHeaderComponent,
    FormRowComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans-create.component.html',
  styleUrls: ['./plans-create.component.scss'],
})
export class PlansCreateComponent {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly plansService = inject(PlansService)

  // Signals
  protected readonly creating = signal(false)

  // Form groups
  protected readonly planForm: FormGroup
  protected readonly basicInfoGroup: FormGroup
  protected readonly configGroup: FormGroup

  // Computed signals
  protected readonly configPreview = computed(() => {
    const duration = this.configGroup.get('durationDays')?.value
    const classes = this.configGroup.get('includedClasses')?.value
    const price = this.configGroup.get('price')?.value
    return duration && classes && price
  })

  // Plan types configuration
  protected readonly planTypes = [
    {
      value: PlanType.CROSSFIT,
      label: 'CrossFit',
      description: 'Entrenamiento funcional de alta intensidad',
      icon: 'fitness_center',
    },
    {
      value: PlanType.ZUMBA,
      label: 'Zumba',
      description: 'Baile fitness divertido y energético',
      icon: 'music_note',
    },
    {
      value: PlanType.PERSONALIZED,
      label: 'Personalizado',
      description: 'Entrenamiento uno a uno con instructor',
      icon: 'person',
    },
  ]

  constructor() {
    // Initialize form groups
    this.basicInfoGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    })

    this.configGroup = this.fb.group({
      durationDays: ['', [Validators.required, Validators.min(1), Validators.max(365)]],
      includedClasses: ['', [Validators.required, Validators.min(1), Validators.max(999)]],
      price: ['', [Validators.required, Validators.min(0)]],
    })

    // Main form
    this.planForm = this.fb.group({
      basicInfo: this.basicInfoGroup,
      config: this.configGroup,
    })
  }

  /**
   * Gets plan type label
   */
  protected getPlanTypeLabel(type: PlanType): string {
    const planType = this.planTypes.find(p => p.value === type)
    return planType?.label || ''
  }

  /**
   * Gets duration text
   */
  protected getDurationText(): string {
    const days = this.configGroup.get('durationDays')?.value
    if (!days) return ''

    if (days === 1) return '1 día'
    if (days < 7) return `${days} días`
    if (days === 7) return '1 semana'
    if (days < 30) return `${Math.floor(days / 7)} semanas`
    if (days === 30) return '1 mes'
    if (days < 365) return `${Math.floor(days / 30)} meses`
    return '1 año'
  }

  /**
   * Gets classes text
   */
  protected getClassesText(): string {
    const classes = this.configGroup.get('includedClasses')?.value
    if (!classes) return ''

    return classes === 999 ? 'Clases ilimitadas' : `${classes} clases`
  }

  /**
   * Formats currency
   */
  protected formatCurrency(amount: number): string {
    if (!amount && amount !== 0) return ''
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  /**
   * Handles form submission
   */
  protected onSubmit(): void {
    if (this.planForm.invalid) {
      this.markFormGroupTouched(this.planForm)
      this.showErrorMessage('Por favor, complete todos los campos requeridos')
      return
    }

    this.creating.set(true)

    const formValue = this.planForm.value
    const createPlanDto: CreatePlanDto = {
      name: formValue.basicInfo.name,
      type: formValue.basicInfo.type,
      description: formValue.basicInfo.description,
      durationDays: formValue.config.durationDays,
      includedClasses: formValue.config.includedClasses,
      price: formValue.config.price,
      availableSchedules: [],
    }

    this.plansService.createPlan(createPlanDto).subscribe({
      next: response => {
        this.creating.set(false)
        this.showSuccessMessage('Plan creado exitosamente')
        this.router.navigate(['/admin/plans'])
      },
      error: error => {
        this.creating.set(false)
        const errorMessage = error?.message || 'Error al crear el plan'
        this.showErrorMessage(errorMessage)
      },
    })
  }

  /**
   * Marks all fields in form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key)
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      } else {
        control?.markAsTouched()
      }
    })
  }

  /**
   * Navigates back to plans list
   */
  protected goBack(): void {
    this.router.navigate(['/admin/plans'])
  }

  /**
   * Shows success message
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    })
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
}
