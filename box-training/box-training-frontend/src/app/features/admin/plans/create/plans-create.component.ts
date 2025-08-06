import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
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
import { Observable, of, timer } from 'rxjs'
import { map, switchMap, catchError } from 'rxjs/operators'
import { PlanType, CreatePlanDto, PlanFormat } from '../../../../core/models/plan.model'
import { PlansService } from '../../../../core/services/plans.service'
import { PageHeaderComponent, FormRowComponent } from '../../../../shared/components'

/**
 * Componente para crear nuevos planes de entrenamiento
 * Incluye formulario con validaciones y soporte para documentos e imágenes
 */
// TODO: SACAR COMPONENTES HTML Y CSS A ARCHIVOS SEPARADOS
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
  protected readonly selectedImage = signal<string | null>(null)
  protected readonly selectedDocuments = signal<File[]>([])
  private readonly selectedImageFile = signal<File | null>(null)

  // Form groups
  protected readonly planForm: FormGroup
  protected basicInfoGroup: FormGroup
  protected readonly configGroup: FormGroup
  protected readonly documentsGroup: FormGroup

  // Signals for reactive form values
  protected readonly selectedPlanTypes = signal<PlanType[]>([])

  // Computed signals
  protected readonly configPreview = computed(() => {
    const duration = this.configGroup.get('durationDays')?.value
    const classes = this.configGroup.get('includedClasses')?.value
    const price = this.configGroup.get('price')?.value
    return duration && classes && price
  })

  protected readonly hasOnlinePlanType = computed(() => {
    console.log('Checking for online plan types')
    const selectedTypes = this.selectedPlanTypes()
    console.log('Selected types:', selectedTypes)
    return selectedTypes?.some(type => type.format === PlanFormat.ONLINE) || false
  })

  // Plan types configuration
  protected readonly planTypes = [
    {
      value: {
        id: '1',
        name: 'CROSSFIT',
        format: PlanFormat.IN_PERSON,
      },
      label: 'CrossFit',
      description: 'Entrenamiento funcional de alta intensidad',
      icon: 'fitness_center',
    },
    {
      value: {
        id: '2',
        name: 'ZUMBA',
        format: PlanFormat.IN_PERSON,
      },
      label: 'Zumba',
      description: 'Baile fitness divertido y energético',
      icon: 'music_note',
    },
    {
      value: {
        id: '3',
        name: 'PERSONALIZADO',
        format: PlanFormat.IN_PERSON,
      },
      label: 'Personalizado',
      description: 'Entrenamiento uno a uno con instructor',
      icon: 'person',
    },
    {
      value: {
        id: '4',
        name: 'FUNCIONAL_ONLINE',
        format: PlanFormat.ONLINE,
      },
      label: 'Funcional Online',
      description: 'Entrenamiento funcional con contenido digital',
      icon: 'play_circle',
    },
    {
      value: {
        id: '5',
        name: 'YOGA_ONLINE',
        format: PlanFormat.ONLINE,
      },
      label: 'Yoga Online',
      description: 'Sesiones de yoga con videos y material digital',
      icon: 'self_improvement',
    },
  ]

  /**
   * Validador asíncrono para verificar nombres únicos de planes
   */
  private uniquePlanNameValidator = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null)
    }

    return timer(500).pipe(
      switchMap(() => this.plansService.getPlans()),
      map(response => {
        const existingPlan = response.data.find(
          plan => plan.name.toLowerCase() === control.value.toLowerCase()
        )
        return existingPlan
          ? { uniqueName: { message: 'Ya existe un plan con este nombre' } }
          : null
      }),
      catchError(() => of(null))
    )
  }

  constructor() {
    // Initialize form groups
    this.basicInfoGroup = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
        [this.uniquePlanNameValidator],
      ],
      type: [[], [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    })

    this.configGroup = this.fb.group({
      durationDays: ['', [Validators.required, Validators.min(1), Validators.max(365)]],
      includedClasses: ['', [Validators.required, Validators.min(1), Validators.max(999)]],
      price: ['', [Validators.required, Validators.min(0)]],
    })

    this.documentsGroup = this.fb.group({
      documents: [[]],
    })

    // Main form
    this.planForm = this.fb.group({
      basicInfo: this.basicInfoGroup,
      config: this.configGroup,
      documents: this.documentsGroup,
    })

    // Subscribe to plan type changes to keep signal reactive
    this.basicInfoGroup.get('type')?.valueChanges.subscribe(value => {
      this.selectedPlanTypes.set(value || [])
    })
  }

  /**
   * Gets plan type label
   */
  protected getPlanTypeLabel(type: PlanType): string {
    const planType = this.planTypes.find(p => p.value.id === type.id)
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
   * Handles image selection
   */
  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showErrorMessage('Por favor seleccione un archivo de imagen válido')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.showErrorMessage('La imagen no puede superar los 5MB')
      return
    }

    this.selectedImageFile.set(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = e => {
      this.selectedImage.set(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  /**
   * Removes selected image
   */
  protected removeImage(): void {
    this.selectedImage.set(null)
    this.selectedImageFile.set(null)
  }

  /**
   * Handles documents selection
   */
  protected onDocumentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files || [])

    if (files.length === 0) return

    // Validate file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      this.showErrorMessage('Algunos archivos no tienen un formato válido')
      return
    }

    // Validate file sizes (10MB max each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      this.showErrorMessage('Algunos archivos superan el límite de 10MB')
      return
    }

    // Add files to existing selection
    const currentDocs = this.selectedDocuments()
    const newDocs = [...currentDocs, ...files]
    this.selectedDocuments.set(newDocs)

    // Update form control
    this.documentsGroup.get('documents')?.setValue(newDocs)
  }

  /**
   * Removes a document from selection
   */
  protected removeDocument(fileToRemove: File): void {
    const currentDocs = this.selectedDocuments()
    const updatedDocs = currentDocs.filter(file => file !== fileToRemove)
    this.selectedDocuments.set(updatedDocs)
    this.documentsGroup.get('documents')?.setValue(updatedDocs)
  }

  /**
   * Formats file size for display
   */
  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
    }

    // Add image if selected
    if (this.selectedImageFile()) {
      createPlanDto.images = [this.selectedImageFile()!.name]
    }

    // Add documents if any
    if (this.selectedDocuments().length > 0) {
      createPlanDto.documents = this.selectedDocuments().map(doc => doc.name)
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
