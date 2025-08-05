import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

// Angular Material Modules
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatChipsModule } from '@angular/material/chips'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

// Core Models
import { Instructor, UpdateInstructorDto } from '../../../../core/models'

// Core Services
import { InstructorsService } from '../../../../core/services/instructors.service'

// Shared Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'

/**
 * Componente para editar instructores existentes
 * Cumple con los criterios de aceptación para la edición de instructores
 */
@Component({
  selector: 'app-instructors-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  templateUrl: './instructors-edit.component.html',
  styleUrls: ['./instructors-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorsEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly instructorsService = inject(InstructorsService)
  private readonly snackBar = inject(MatSnackBar)

  // State signals
  protected readonly loading = signal(false)
  protected readonly saving = signal(false)
  protected readonly instructor = signal<Instructor | null>(null)
  protected readonly selectedImage = signal<string | null>(null)

  // Form and data
  protected instructorForm!: FormGroup
  protected availableSpecialties: string[] = []
  protected selectedSpecialties: string[] = []
  private instructorId: string = ''
  private originalFormValue: any = null

  // Computed properties
  protected readonly instructorFullName = computed(() => {
    const currentInstructor = this.instructor()
    return currentInstructor ? `${currentInstructor.name} ${currentInstructor.lastName}` : ''
  })

  // Form groups for better organization
  get instructorFormControls() {
    return this.instructorForm.controls
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadAvailableSpecialties()
    this.loadInstructorData()
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initializeForm(): void {
    this.instructorForm = this.fb.group({
      // Información básica
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      // Información profesional
      biography: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      photo: [''], // Opcional
    })
  }

  /**
   * Carga los datos del instructor desde la ruta
   */
  private loadInstructorData(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.instructorId = id
        this.loadInstructor(id)
      }
    })
  }

  /**
   * Carga los datos del instructor
   */
  private loadInstructor(id: string): void {
    this.loading.set(true)

    this.instructorsService.getInstructorById(id).subscribe({
      next: instructor => {
        this.instructor.set(instructor)
        this.populateForm(instructor)
        this.loading.set(false)
      },
      error: error => {
        console.error('Error al cargar instructor:', error)
        this.showErrorMessage('Error al cargar los datos del instructor')
        this.loading.set(false)
        this.goBack()
      },
    })
  }

  /**
   * Llena el formulario con los datos del instructor
   */
  private populateForm(instructor: Instructor): void {
    this.instructorForm.patchValue({
      name: instructor.name,
      lastName: instructor.lastName,
      email: instructor.email,
      phone: instructor.phone,
      biography: instructor.biography,
      photo: instructor.photo || '',
    })

    // Configurar especialidades
    this.selectedSpecialties = [...instructor.specialties]

    // Configurar imagen
    if (instructor.photo) {
      this.selectedImage.set(instructor.photo)
    }

    // Guardar valor original para detectar cambios
    this.originalFormValue = this.instructorForm.value
  }

  /**
   * Carga las especialidades disponibles
   */
  private loadAvailableSpecialties(): void {
    this.instructorsService.getAvailableSpecialties().subscribe({
      next: specialties => {
        this.availableSpecialties = specialties
      },
      error: error => {
        console.error('Error al cargar especialidades:', error)
      },
    })
  }

  /**
   * Obtiene las especialidades disponibles para seleccionar (no seleccionadas)
   */
  protected getAvailableSpecialtiesForSelection(): string[] {
    return this.availableSpecialties.filter(
      specialty => !this.selectedSpecialties.includes(specialty)
    )
  }

  /**
   * Agrega una especialidad
   */
  protected addSpecialty(specialty: string): void {
    if (!this.selectedSpecialties.includes(specialty)) {
      this.selectedSpecialties.push(specialty)
    }
  }

  /**
   * Remueve una especialidad
   */
  protected removeSpecialty(specialty: string): void {
    const index = this.selectedSpecialties.indexOf(specialty)
    if (index >= 0) {
      this.selectedSpecialties.splice(index, 1)
    }
  }

  /**
   * Maneja la selección de archivo para la imagen
   */
  protected onFileSelect(event: any): void {
    const file = event.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.showErrorMessage('Por favor seleccione un archivo de imagen válido')
        return
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showErrorMessage('La imagen no puede ser mayor a 2MB')
        return
      }

      // Crear URL de preview
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.selectedImage.set(e.target.result)
        this.instructorForm.patchValue({
          photo: e.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Remueve la imagen seleccionada
   */
  protected removeImage(): void {
    this.selectedImage.set(null)
    this.instructorForm.patchValue({
      photo: '',
    })
  }

  /**
   * Verifica si el formulario tiene cambios
   */
  protected hasFormChanges(): boolean {
    if (!this.originalFormValue) return false

    const currentValue = this.instructorForm.value
    const currentInstructor = this.instructor()

    // Comparar datos básicos
    const formDataChanged = JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue)

    // Comparar especialidades
    const originalSpecialties = currentInstructor?.specialties || []
    const specialtiesChanged =
      JSON.stringify(this.selectedSpecialties.sort()) !== JSON.stringify(originalSpecialties.sort())

    return formDataChanged || specialtiesChanged
  }

  /**
   * Envía el formulario
   */
  protected onSubmit(): void {
    if (this.instructorForm.valid && this.selectedSpecialties.length > 0 && this.hasFormChanges()) {
      this.saving.set(true)

      const formValue = this.instructorForm.value
      const updateData: UpdateInstructorDto = {
        id: this.instructorId,
        name: formValue.name.trim(),
        lastName: formValue.lastName.trim(),
        email: formValue.email.trim().toLowerCase(),
        phone: formValue.phone.trim(),
        specialties: this.selectedSpecialties,
        biography: formValue.biography.trim(),
        photo: formValue.photo || undefined,
      }

      this.instructorsService.updateInstructor(updateData).subscribe({
        next: response => {
          this.showSuccessMessage(response.message || 'Instructor actualizado exitosamente')
          this.saving.set(false)
          this.goBack()
        },
        error: error => {
          this.showErrorMessage(error.message || 'Error al actualizar el instructor')
          this.saving.set(false)
        },
      })
    } else {
      this.markFormGroupTouched()
      if (this.selectedSpecialties.length === 0) {
        this.showErrorMessage('Debe seleccionar al menos una especialidad')
      } else if (!this.hasFormChanges()) {
        this.showErrorMessage('No hay cambios para guardar')
      }
    }
  }

  /**
   * Marca todos los campos del formulario como touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.instructorForm.controls).forEach(key => {
      const control = this.instructorForm.get(key)
      control?.markAsTouched()
    })
  }

  /**
   * Navega de vuelta a la lista o detalle
   */
  protected goBack(): void {
    if (this.hasFormChanges()) {
      if (confirm('¿Está seguro que desea salir? Los cambios no guardados se perderán.')) {
        this.router.navigate(['/admin/instructors', this.instructorId])
      }
    } else {
      this.router.navigate(['/admin/instructors', this.instructorId])
    }
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
