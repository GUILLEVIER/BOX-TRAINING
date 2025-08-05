import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'

// Angular Material Modules
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatChipsModule } from '@angular/material/chips'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDividerModule } from '@angular/material/divider'

// Core Models
import { CreateInstructorDto } from '../../../../core/models'

// Core Services
import { InstructorsService } from '../../../../core/services/instructors.service'

// Shared Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { FormRowComponent } from '../../../../shared/components/form-row/form-row.component'

/**
 * Componente para crear un nuevo instructor
 * Formulario completo con validaciones
 */
@Component({
  selector: 'app-instructors-create',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    PageHeaderComponent,
    FormRowComponent,
  ],
  templateUrl: './instructors-create.component.html',
  styleUrls: ['./instructors-create.component.scss'],
})
export class InstructorsCreateComponent implements OnInit {
  /** Formulario principal */
  instructorForm!: FormGroup

  /** Estado de carga */
  loading = false

  /** Especialidades disponibles */
  availableSpecialties: string[] = []

  /** Especialidades seleccionadas */
  selectedSpecialties: string[] = []

  constructor(
    private fb: FormBuilder,
    private instructorsService: InstructorsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm()
    this.loadAvailableSpecialties()
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
      specialties: this.fb.array([], Validators.required),
      biography: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      photo: [''], // Opcional
    })
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
        this.showErrorMessage('Error al cargar las especialidades disponibles')
      },
    })
  }

  /**
   * Getter para el FormArray de especialidades
   */
  get specialtiesFormArray(): FormArray {
    return this.instructorForm.get('specialties') as FormArray
  }

  /**
   * Agrega una especialidad
   */
  addSpecialty(specialty: string): void {
    if (!this.selectedSpecialties.includes(specialty)) {
      this.selectedSpecialties.push(specialty)
      this.specialtiesFormArray.push(this.fb.control(specialty))
    }
  }

  /**
   * Remueve una especialidad
   */
  removeSpecialty(specialty: string): void {
    const index = this.selectedSpecialties.indexOf(specialty)
    if (index >= 0) {
      this.selectedSpecialties.splice(index, 1)
      this.specialtiesFormArray.removeAt(index)
    }
  }

  /**
   * Verifica si una especialidad está seleccionada
   */
  isSpecialtySelected(specialty: string): boolean {
    return this.selectedSpecialties.includes(specialty)
  }

  /**
   * Obtiene especialidades disponibles para seleccionar
   */
  getAvailableSpecialtiesForSelection(): string[] {
    return this.availableSpecialties.filter(
      specialty => !this.selectedSpecialties.includes(specialty)
    )
  }

  /**
   * Track by function for specialties
   */
  trackBySpecialty(index: number, specialty: string): string {
    return specialty
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.instructorForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido'
      }
      if (field.errors['email']) {
        return 'Ingrese un email válido'
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength
        return `Mínimo ${requiredLength} caracteres`
      }
      if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength
        return `Máximo ${requiredLength} caracteres`
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') {
          return 'Ingrese un número de teléfono válido'
        }
      }
    }
    return ''
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.instructorForm.get(fieldName)
    return !!(field?.errors && field.touched)
  }

  /**
   * Maneja el evento de cambio de archivo para la foto
   */
  onFileSelect(event: any): void {
    const file = event.target.files[0]
    if (file) {
      // Aquí se puede agregar lógica para subir la imagen
      // Por ahora solo guardamos una URL de placeholder
      this.instructorForm.patchValue({
        photo: 'assets/images/instructors/placeholder.jpg',
      })
    }
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    if (this.instructorForm.valid && this.selectedSpecialties.length > 0) {
      this.loading = true

      const instructorData: CreateInstructorDto = {
        name: this.instructorForm.value.name.trim(),
        lastName: this.instructorForm.value.lastName.trim(),
        email: this.instructorForm.value.email.trim().toLowerCase(),
        phone: this.instructorForm.value.phone.trim(),
        specialties: this.selectedSpecialties,
        biography: this.instructorForm.value.biography.trim(),
        photo: this.instructorForm.value.photo || undefined,
      }

      this.instructorsService.createInstructor(instructorData).subscribe({
        next: response => {
          this.showSuccessMessage(response.message || 'Instructor creado exitosamente')
          this.router.navigate(['/admin/instructors'])
        },
        error: error => {
          this.showErrorMessage(error.message || 'Error al crear el instructor')
          this.loading = false
        },
      })
    } else {
      this.markFormGroupTouched()
      if (this.selectedSpecialties.length === 0) {
        this.showErrorMessage('Debe seleccionar al menos una especialidad')
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
   * Cancela la creación y vuelve a la lista
   */
  onCancel(): void {
    this.router.navigate(['/admin/instructors'])
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
