import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { Observable, of, timer } from 'rxjs'
import { map, switchMap, catchError } from 'rxjs/operators'
import { Plan, PlanType, UpdatePlanDto, PlanFormat } from '../../../../core/models/plan.model'
import { PlansService } from '../../../../core/services/plans.service'
import { PageHeaderComponent, FormRowComponent } from '../../../../shared/components'
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { ConfirmDialogData } from '../../../../interfaces/propsInterface'

/**
 * Componente para editar planes de entrenamiento existentes
 * Cumple con los criterios de aceptación para la edición de planes
 */
// TODO: SACAR COMPONENTES HTML Y CSS A ARCHIVOS SEPARADOS
@Component({
  selector: 'app-plans-edit',
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
    MatDialogModule,
    PageHeaderComponent,
    FormRowComponent,
    MatProgressSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans-edit.component.html',
  styleUrls: ['./plans-edit.component.scss'],
})
export class PlansEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)
  private readonly plansService = inject(PlansService)

  // Signals
  protected readonly loading = signal(true)
  protected readonly saving = signal(false)
  protected readonly originalPlan = signal<Plan | null>(null)
  protected readonly planId = signal<string | null>(null)
  protected readonly selectedImage = signal<string | null>(null)
  protected readonly selectedDocuments = signal<File[]>([])
  private readonly selectedImageFile = signal<File | null>(null)
  protected readonly hasActiveStudents = signal(false)

  // Form groups
  protected readonly planForm: FormGroup
  protected readonly basicInfoGroup: FormGroup
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
    const selectedTypes = this.selectedPlanTypes()
    return selectedTypes?.some(type => type.format === PlanFormat.ONLINE) || false
  })

  protected readonly canEditPlanType = computed(() => {
    return !this.hasActiveStudents()
  })

  protected readonly showWarningMessage = computed(() => {
    return this.hasActiveStudents() && this.hasFormChanges()
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
   * Validador asíncrono para verificar nombres únicos de planes (excluyendo el plan actual)
   */
  private uniquePlanNameValidator = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null)
    }

    const currentPlanId = this.planId()
    return timer(500).pipe(
      switchMap(() => this.plansService.getPlans()),
      map(response => {
        const existingPlan = response.data.find(
          plan =>
            plan.name.toLowerCase() === control.value.toLowerCase() && plan.id !== currentPlanId
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.planId.set(id)
        this.loadPlan(id)
      }
    })
  }

  /**
   * Carga los datos del plan a editar
   */
  private loadPlan(id: string): void {
    this.loading.set(true)

    this.plansService.getPlanById(id).subscribe({
      next: plan => {
        this.originalPlan.set(plan)
        this.populateForm(plan)
        this.checkActiveStudents(id)
        this.loading.set(false)
      },
      error: error => {
        console.error('Error al cargar plan:', error)
        this.showErrorMessage('Error al cargar el plan')
        this.loading.set(false)
        this.router.navigate(['/admin/plans'])
      },
    })
  }

  /**
   * Verifica si el plan tiene estudiantes activos
   */
  private checkActiveStudents(planId: string): void {
    this.plansService.hasActiveStudents(planId).subscribe({
      next: hasActive => {
        this.hasActiveStudents.set(hasActive)
      },
      error: error => {
        console.error('Error verificando estudiantes activos:', error)
        // En caso de error, asumimos que no hay estudiantes activos
        this.hasActiveStudents.set(false)
      },
    })
  }

  /**
   * Puebla el formulario con los datos del plan
   */
  private populateForm(plan: Plan): void {
    this.basicInfoGroup.patchValue({
      name: plan.name,
      type: plan.type,
      description: plan.description,
    })

    this.configGroup.patchValue({
      durationDays: plan.durationDays,
      includedClasses: plan.includedClasses,
      price: plan.price,
    })

    this.selectedPlanTypes.set(plan.type)

    // Load existing images
    if (plan.images && plan.images.length > 0) {
      this.selectedImage.set(`/assets/images/plans/${plan.images[0]}`)
    }

    // Load existing documents
    if (plan.documents && plan.documents.length > 0) {
      // Convert document names to File objects for display purposes
      // In a real implementation, you might want to handle this differently
      this.documentsGroup.patchValue({
        documents: plan.documents,
      })
    }
  }

  /**
   * Verifica si hay cambios en el formulario
   */
  private hasFormChanges(): boolean {
    const original = this.originalPlan()
    if (!original) return false

    const current = this.planForm.value
    return (
      current.basicInfo.name !== original.name ||
      current.basicInfo.description !== original.description ||
      JSON.stringify(current.basicInfo.type) !== JSON.stringify(original.type) ||
      current.config.durationDays !== original.durationDays ||
      current.config.includedClasses !== original.includedClasses ||
      current.config.price !== original.price ||
      this.selectedImageFile() !== null ||
      this.selectedDocuments().length > 0
    )
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
   * Shows confirmation dialog if there are active students
   */
  private showActiveStudentsConfirmation(): Observable<boolean> {
    if (!this.hasActiveStudents()) {
      return of(true)
    }

    const dialogData: ConfirmDialogData = {
      title: 'Plan con Estudiantes Activos',
      message: `Este plan tiene estudiantes activos. Los cambios no afectarán a los estudiantes actuales, pero se aplicarán a nuevas asignaciones. ¿Desea continuar?`,
      confirmText: 'Sí, Continuar',
      cancelText: 'Cancelar',
      type: 'warning',
    }

    return this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .pipe(map(result => !!result))
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

    // Show confirmation if needed
    this.showActiveStudentsConfirmation().subscribe(confirmed => {
      if (confirmed) {
        this.updatePlan()
      }
    })
  }

  /**
   * Updates the plan
   */
  private updatePlan(): void {
    this.saving.set(true)

    const formValue = this.planForm.value
    const originalPlan = this.originalPlan()!

    const updatePlanDto: UpdatePlanDto = {
      id: originalPlan.id,
      name: formValue.basicInfo.name,
      description: formValue.basicInfo.description,
      durationDays: formValue.config.durationDays,
      includedClasses: formValue.config.includedClasses,
      price: formValue.config.price,
    }

    // Only include type changes if there are no active students
    if (!this.hasActiveStudents()) {
      updatePlanDto.type = formValue.basicInfo.type
    }

    // Add image if selected
    if (this.selectedImageFile()) {
      updatePlanDto.images = [this.selectedImageFile()!.name]
    }

    // Add documents if any
    if (this.selectedDocuments().length > 0) {
      updatePlanDto.documents = this.selectedDocuments().map(doc => doc.name)
    }

    this.plansService.updatePlan(updatePlanDto).subscribe({
      next: response => {
        this.saving.set(false)
        this.showSuccessMessage(response.message || 'Plan actualizado exitosamente')
        this.router.navigate(['/admin/plans', originalPlan.id])
      },
      error: error => {
        this.saving.set(false)
        const errorMessage = error?.message || 'Error al actualizar el plan'
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
   * Navigates back to plan details
   */
  protected goBack(): void {
    const planId = this.planId()
    if (planId) {
      this.router.navigate(['/admin/plans', planId])
    } else {
      this.router.navigate(['/admin/plans'])
    }
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
