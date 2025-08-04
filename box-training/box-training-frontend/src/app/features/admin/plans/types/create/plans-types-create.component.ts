import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
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
import { CreatePlanTypeDto, PlanFormat } from '../../../../../core/models'
import { PlansService } from '../../../../../core/services/plans.service'
import { PageHeaderComponent, FormRowComponent } from '../../../../../shared/components'

/**
 * Componente para crear nuevos tipos de planes de entrenamiento
 * Incluye formulario con validaciones
 */
@Component({
  selector: 'app-plans-types-create',
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
    PageHeaderComponent,
    FormRowComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans-types-create.component.html',
  styleUrls: ['./plans-types-create.component.scss'],
})
export class PlansTypesCreateComponent {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly plansService = inject(PlansService)

  // Signals
  protected readonly creating = signal(false)

  // Form group for creating plan type
  protected readonly planTypeForm: FormGroup

  // Plan formats configuration
  protected readonly planFormats = [
    {
      value: PlanFormat.IN_PERSON,
      label: 'Presencial',
      description: 'Entrenamiento en las instalaciones del box',
      icon: 'location_on',
    },
    {
      value: PlanFormat.ONLINE,
      label: 'Online',
      description: 'Entrenamiento virtual desde casa',
      icon: 'laptop',
    },
  ]

  constructor() {
    this.planTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      format: [PlanFormat.IN_PERSON, Validators.required],
    })
  }

  /**
   * Submits the form to create a new plan type
   */
  protected onSubmit(): void {
    if (this.planTypeForm.invalid) {
      this.markFormGroupTouched(this.planTypeForm)
      this.showErrorMessage('Por favor, complete todos los campos requeridos')
      return
    }

    this.creating.set(true)

    const formValue = this.planTypeForm.value
    const createPlanTypeDto: CreatePlanTypeDto = {
      name: formValue.name.toUpperCase(), // Convertir a mayúsculas para consistencia
      format: formValue.format,
    }

    this.plansService.createPlanType(createPlanTypeDto).subscribe({
      next: response => {
        this.creating.set(false)
        this.showSuccessMessage('Tipo de plan creado exitosamente')
        this.router.navigate(['/admin/plans'])
      },
      error: error => {
        this.creating.set(false)
        const errorMessage = error?.message || 'Error al crear el tipo de plan'
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
