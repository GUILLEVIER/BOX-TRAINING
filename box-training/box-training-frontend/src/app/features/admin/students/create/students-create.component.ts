/**
 * Componente para crear nuevos alumnos
 * Incluye formulario con validaciones y soporte para imagen de perfil
 */
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { FormRowComponent } from '../../../../shared/components/form-row/form-row.component'
import { StudentsService } from '../../../../core/services/students.service'
import { CreateStudentDto } from '../../../../core/models/student.model'

@Component({
  selector: 'app-students-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PageHeaderComponent,
    FormRowComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './students-create.component.html',
  styleUrls: ['./students-create.component.scss'],
})
export class StudentsCreateComponent {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly studentsService = inject(StudentsService)

  // Signals
  protected readonly creating = signal(false)
  protected readonly selectedImage = signal<string | null>(null)
  private readonly selectedImageFile = signal<File | null>(null)

  // Form group
  protected readonly studentForm: FormGroup

  // Fecha máxima para fecha de nacimiento (18 años atrás)
  protected readonly maxDate = new Date(
    new Date().getFullYear() - 18,
    new Date().getMonth(),
    new Date().getDate()
  )
  // Fecha mínima para fecha de nacimiento (100 años atrás)
  protected readonly minDate = new Date(
    new Date().getFullYear() - 100,
    new Date().getMonth(),
    new Date().getDate()
  )

  constructor() {
    // Initialize form
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-\(\)]{8,15}$/)]],
      birthDate: ['', [Validators.required]],
    })
  }

  /**
   * Handles image selection
   */
  protected onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showErrorMessage('Solo se permiten archivos de imagen')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showErrorMessage('La imagen no puede superar los 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = e => {
      this.selectedImage.set(e.target?.result as string)
      this.selectedImageFile.set(file)
    }
    reader.readAsDataURL(file)
  }

  /**
   * Removes selected image
   */
  protected removeImage(): void {
    this.selectedImage.set(null)
    this.selectedImageFile.set(null)
    // Reset file input
    const fileInput = document.getElementById('imageInput') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  /**
   * Handles form submission
   */
  protected onSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.studentForm)
      this.showErrorMessage('Por favor, completa todos los campos requeridos')
      return
    }

    this.creating.set(true)

    // Prepare student data
    const formValue = this.studentForm.value
    const studentData: CreateStudentDto = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim().toLowerCase(),
      phone: formValue.phone.trim(),
      birthDate: formValue.birthDate,
      photo: this.selectedImage() || undefined,
    }

    // Call service to create student
    this.studentsService.createStudent(studentData).subscribe({
      next: response => {
        this.creating.set(false)
        if (response.success) {
          this.showSuccessMessage(response.message || 'Alumno creado exitosamente')
          this.router.navigate(['/admin/students'])
        } else {
          this.showErrorMessage(response.message || 'Error al crear el alumno')
        }
      },
      error: error => {
        this.creating.set(false)
        console.error('Error creating student:', error)
        this.showErrorMessage('Error al crear el alumno. Inténtalo nuevamente.')
      },
    })
  }

  /**
   * Marks all fields in form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field)
      control?.markAsTouched({ onlySelf: true })
    })
  }

  /**
   * Navigates back to students list
   */
  protected goBack(): void {
    this.router.navigate(['/admin/students'])
  }

  /**
   * Shows success message
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
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

  /**
   * Gets error message for form field
   */
  protected getFieldError(fieldName: string): string {
    const field = this.studentForm.get(fieldName)
    if (!field || !field.errors || !field.touched) return ''

    const errors = field.errors
    if (errors['required']) return 'Este campo es requerido'
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`
    if (errors['email']) return 'Formato de email inválido'
    if (errors['pattern']) return 'Formato de teléfono inválido'

    return 'Campo inválido'
  }

  /**
   * Checks if form field has error
   */
  protected hasFieldError(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName)
    return !!(field && field.errors && field.touched)
  }
}
