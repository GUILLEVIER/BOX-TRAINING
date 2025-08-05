import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Observable, of, timer } from 'rxjs'
import { switchMap, map, catchError } from 'rxjs/operators'

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDialogModule, MatDialog } from '@angular/material/dialog'

// Core Models
import { Student, UpdateStudentDto } from '../../../../core/models'

// Core Services
import { StudentsService } from '../../../../core/services/students.service'

// Shared Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { FormRowComponent } from '../../../../shared/components/form-row/form-row.component'
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component'

/**
 * Componente para editar estudiantes existentes
 * Cumple con los criterios de aceptación para la edición de estudiantes
 */
@Component({
  selector: 'app-students-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinner,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    PageHeaderComponent,
    FormRowComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './students-edit.component.html',
  styleUrls: ['./students-edit.component.scss'],
})
export class StudentsEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)
  private readonly studentsService = inject(StudentsService)

  // Signals
  protected readonly loading = signal(true)
  protected readonly saving = signal(false)
  protected readonly originalStudent = signal<Student | null>(null)
  protected readonly studentId = signal<string | null>(null)
  protected readonly selectedImage = signal<string | null>(null)
  private readonly selectedImageFile = signal<File | null>(null)

  // Form groups
  protected readonly studentForm: FormGroup
  protected readonly basicInfoGroup: FormGroup

  // Computed signals
  protected readonly studentFullName = computed(() => {
    const student = this.originalStudent()
    return student ? `${student.firstName} ${student.lastName}` : ''
  })

  protected readonly hasFormChanges = computed(() => {
    return this.hasChanges()
  })

  protected readonly maxBirthDate = computed(() => {
    const today = new Date()
    // Minimum age: 10 years
    const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
    return maxDate
  })

  /**
   * Validador asíncrono para verificar emails únicos (excluyendo el estudiante actual)
   */
  private uniqueEmailValidator = (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null)
    }

    const currentStudentId = this.studentId()
    return timer(500).pipe(
      switchMap(() => this.studentsService.getStudents()),
      map(response => {
        const existingStudent = response.data.find(
          student =>
            student.email.toLowerCase() === control.value.toLowerCase() &&
            student.id !== currentStudentId
        )
        return existingStudent ? { uniqueEmail: { value: control.value } } : null
      }),
      catchError(() => of(null))
    )
  }

  constructor() {
    // Initialize form groups
    this.basicInfoGroup = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email], [this.uniqueEmailValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-\(\)]{8,15}$/)]],
      birthDate: ['', [Validators.required, this.birthDateValidator]],
    })

    // Main form
    this.studentForm = this.fb.group({
      basicInfo: this.basicInfoGroup,
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.studentId.set(params['id'])
        this.loadStudent(params['id'])
      } else {
        this.router.navigate(['/admin/students'])
      }
    })
  }

  /**
   * Validador personalizado para fecha de nacimiento
   */
  private birthDateValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null
    }

    const birthDate = new Date(control.value)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      // Adjust age if birthday hasn't occurred this year
    }

    if (birthDate >= today) {
      return { futureDate: true }
    }

    if (age < 10) {
      return { tooYoung: true }
    }

    if (age > 100) {
      return { tooOld: true }
    }

    return null
  }

  /**
   * Carga los datos del estudiante a editar
   */
  private loadStudent(id: string): void {
    this.loading.set(true)

    this.studentsService.getStudentById(id).subscribe({
      next: student => {
        this.originalStudent.set(student)
        this.populateForm(student)
        this.loading.set(false)
      },
      error: error => {
        console.error('Error al cargar el estudiante:', error)
        this.showErrorMessage(error.message || 'Error al cargar los datos del estudiante')
        this.router.navigate(['/admin/students'])
      },
    })
  }

  /**
   * Puebla el formulario con los datos del estudiante
   */
  private populateForm(student: Student): void {
    this.basicInfoGroup.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      birthDate: student.birthDate,
    })

    // Set image if exists
    if (student.photo) {
      this.selectedImage.set(student.photo)
    }
  }

  /**
   * Verifica si hay cambios en el formulario
   */
  private hasChanges(): boolean {
    const originalStudent = this.originalStudent()
    if (!originalStudent) return false

    const formValue = this.basicInfoGroup.value
    const imageChanged = this.selectedImageFile() !== null

    return (
      originalStudent.firstName !== formValue.firstName ||
      originalStudent.lastName !== formValue.lastName ||
      originalStudent.email !== formValue.email ||
      originalStudent.phone !== formValue.phone ||
      //originalStudent.birthDate.getTime() !== new Date(formValue.birthDate).getTime() ||
      imageChanged
    )
  }

  /**
   * Calcula la edad del estudiante
   */
  protected calculateAge(): number | null {
    const birthDate = this.basicInfoGroup.get('birthDate')?.value
    if (!birthDate) return null

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
   * Handles image selection
   */
  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showErrorMessage('Por favor seleccione un archivo de imagen válido')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showErrorMessage('La imagen no puede exceder 5MB')
        return
      }

      this.selectedImageFile.set(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = e => {
        this.selectedImage.set(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Removes selected image
   */
  protected removeImage(): void {
    this.selectedImage.set(null)
    this.selectedImageFile.set(null)
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
   * Shows confirmation dialog for unsaved changes
   */
  private showUnsavedChangesConfirmation(): Observable<boolean> {
    const dialogData: ConfirmDialogData = {
      title: 'Cambios sin Guardar',
      message: 'Tiene cambios sin guardar. ¿Está seguro que desea salir sin guardar?',
      confirmText: 'Salir sin Guardar',
      cancelText: 'Continuar Editando',
      type: 'warning',
    }

    return this.dialog.open(ConfirmDialogComponent, { data: dialogData }).afterClosed()
  }

  /**
   * Handles form submission
   */
  protected onSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.basicInfoGroup)
      this.showErrorMessage('Por favor corrija los errores en el formulario')
      return
    }

    if (!this.hasFormChanges()) {
      this.showErrorMessage('No hay cambios para guardar')
      return
    }

    this.updateStudent()
  }

  /**
   * Updates the student
   */
  private updateStudent(): void {
    const currentStudent = this.originalStudent()
    if (!currentStudent) return

    this.saving.set(true)

    const formValue = this.basicInfoGroup.value
    const updateData: UpdateStudentDto = {
      id: currentStudent.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      birthDate: new Date(formValue.birthDate),
    }

    // Add photo if changed
    const imageFile = this.selectedImageFile()
    if (imageFile) {
      // In a real application, you would upload the image first
      // and get the URL to include in the update data
      updateData.photo = this.selectedImage() || undefined
    } else if (this.selectedImage() === null && currentStudent.photo) {
      // Image was removed
      updateData.photo = undefined
    }

    this.studentsService.updateStudent(updateData).subscribe({
      next: response => {
        this.saving.set(false)
        this.showSuccessMessage('Estudiante actualizado exitosamente')
        this.router.navigate(['/admin/students', currentStudent.id])
      },
      error: error => {
        this.saving.set(false)
        console.error('Error al actualizar el estudiante:', error)
        this.showErrorMessage(error.message || 'Error al actualizar el estudiante')
      },
    })
  }

  /**
   * Marks all fields in form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key)
      if (control) {
        control.markAsTouched()
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control)
        }
      }
    })
  }

  /**
   * Navigates back with unsaved changes check
   */
  protected goBack(): void {
    if (this.hasFormChanges()) {
      this.showUnsavedChangesConfirmation().subscribe(confirmed => {
        if (confirmed) {
          this.navigateToStudentDetail()
        }
      })
    } else {
      this.navigateToStudentDetail()
    }
  }

  /**
   * Navigates to student detail
   */
  private navigateToStudentDetail(): void {
    const studentId = this.studentId()
    if (studentId) {
      this.router.navigate(['/admin/students', studentId])
    } else {
      this.router.navigate(['/admin/students'])
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
