import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Instructor, InstructorState } from '../../../../core/models'
import { InstructorsService } from '../../../../core/services/instructors.service'
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'
import { ConfirmDialogData } from '../../../../interfaces/propsInterface'
import { LoadingComponent } from '../../../../shared/components'

/**
 * Componente para mostrar los detalles de un instructor
 * Incluye información completa del instructor y acciones disponibles
 */
@Component({
  selector: 'app-instructors-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    PageHeaderComponent,
    LoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './instructors-detail.component.html',
  styleUrls: ['./instructors-detail.component.scss'],
})
export class InstructorsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)
  private readonly instructorsService = inject(InstructorsService)

  // Signals
  protected readonly loading = signal(true)
  protected readonly instructor = signal<Instructor | null>(null)
  protected readonly instructorId = signal<string | null>(null)

  // Computed signals
  protected readonly instructorFullName = computed(() => {
    const currentInstructor = this.instructor()
    return currentInstructor ? `${currentInstructor.name} ${currentInstructor.lastName}` : ''
  })

  protected readonly isActive = computed(() => {
    const currentInstructor = this.instructor()
    return currentInstructor?.status === InstructorState.ACTIVE
  })

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.instructorId.set(id)
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
        this.loading.set(false)
      },
      error: error => {
        console.error('Error al cargar instructor:', error)
        this.showErrorMessage('Error al cargar los detalles del instructor')
        this.loading.set(false)
        this.goBack()
      },
    })
  }

  /**
   * Navega al formulario de edición
   */
  protected editInstructor(): void {
    const id = this.instructorId()
    if (id) {
      this.router.navigate(['/admin/instructors', id, 'edit'])
    }
  }

  /**
   * Alterna el estado del instructor
   */
  protected toggleInstructorStatus(): void {
    const currentInstructor = this.instructor()
    if (!currentInstructor) return

    const newStatus =
      currentInstructor.status === InstructorState.ACTIVE
        ? InstructorState.INACTIVE
        : InstructorState.ACTIVE
    const action = newStatus === InstructorState.ACTIVE ? 'activar' : 'desactivar'

    const dialogData: ConfirmDialogData = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Instructor`,
      message: `¿Está seguro que desea ${action} al instructor "${this.instructorFullName()}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed && currentInstructor) {
          this.instructorsService
            .toggleInstructorStatus(currentInstructor.id, newStatus)
            .subscribe({
              next: () => {
                this.showSuccessMessage('Instructor modificado exitosamente')
                this.loadInstructor(currentInstructor.id)
              },
              error: error => {
                this.showErrorMessage(`Error al ${action} el instructor`)
              },
            })
        }
      })
  }

  /**
   * Elimina el instructor
   */
  protected deleteInstructor(): void {
    const currentInstructor = this.instructor()
    if (!currentInstructor) return

    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Instructor',
      message: `¿Está seguro que desea eliminar al instructor "${this.instructorFullName()}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed && currentInstructor) {
          this.instructorsService.deleteInstructor(currentInstructor.id).subscribe({
            next: () => {
              this.showSuccessMessage('Instructor eliminado exitosamente')
              this.router.navigate(['/admin/instructors'])
            },
            error: error => {
              this.showErrorMessage(error.message || 'Error al eliminar el instructor')
            },
          })
        }
      })
  }

  /**
   * Navega de vuelta a la lista de instructores
   */
  protected goBack(): void {
    this.router.navigate(['/admin/instructors'])
  }

  /**
   * Obtiene el color del chip para el estado del instructor
   */
  protected getInstructorStatusChipColor(status: InstructorState): string {
    return status === InstructorState.ACTIVE ? 'primary' : ''
  }

  /**
   * Obtiene el texto para mostrar del estado del instructor
   */
  protected getInstructorStatusText(status: InstructorState): string {
    return status === InstructorState.ACTIVE ? 'Activo' : 'Inactivo'
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
