import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

// Core Models
import { Instructor, InstructorState } from '../../../../core/models'

// Shared Component Types
import {
  ActionButton,
  ConfirmDialogData,
  FilterConfig,
  MenuAction,
  TableColumn,
} from '../../../../interfaces/propsInterface'

// Core Services
import { InstructorsService } from '../../../../core/services/instructors.service'

// Shared Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component'
import { ActionButtonsComponent } from '../../../../shared/components/action-buttons/action-buttons.component'
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'

/**
 * Componente para la gestión de instructores del administrador
 * Permite ver, crear, editar y eliminar instructores
 */
@Component({
  selector: 'app-instructors-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    PageHeaderComponent,
    DataTableComponent,
    ActionButtonsComponent,
  ],
  templateUrl: './instructors-management.component.html',
  styleUrls: ['./instructors-management.component.scss'],
})
export class InstructorsManagementComponent implements OnInit, AfterViewInit {
  /** Data source para la tabla */
  dataSource = new MatTableDataSource<Instructor>([])

  /** Estado de carga */
  loading = true

  /** Template references */
  @ViewChild('nameTemplate', { static: true }) nameTemplate!: TemplateRef<any>
  @ViewChild('specialtiesTemplate', { static: true }) specialtiesTemplate!: TemplateRef<any>
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>

  /** Configuración de columnas para la tabla */
  tableColumns: TableColumn[] = []

  /** Configuración de filtros para la tabla */
  tableFilters: FilterConfig[] = [
    {
      key: 'search',
      label: 'Buscar Instructor',
      type: 'text',
      placeholder: 'Nombre, apellido o email',
    },
    {
      key: 'status',
      label: 'Estado del Instructor',
      type: 'select',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: 'ACTIVE', label: 'Activo' },
        { value: 'INACTIVE', label: 'Inactivo' },
      ],
    },
  ]

  constructor(
    private instructorsService: InstructorsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeTableColumns()
    this.loadInstructors()
  }

  ngAfterViewInit(): void {
    // No necesitamos configurar paginator y sort manualmente
    // ya que el DataTableComponent lo maneja internamente
  }

  /**
   * Initialize table columns with templates
   */
  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: 'fullName',
        label: 'Nombre Instructor',
        sortable: true,
        template: this.nameTemplate,
      },
      {
        key: 'specialties',
        label: 'Especialidades',
        sortable: false,
        template: this.specialtiesTemplate,
      },
      {
        key: 'status',
        label: 'Estado',
        sortable: true,
        template: this.statusTemplate,
      },
    ]
  }

  /**
   * Carga la lista de instructores
   */
  private loadInstructors(): void {
    this.loading = true

    this.instructorsService.getInstructors().subscribe({
      next: response => {
        this.dataSource.data = response.data
        this.loading = false
      },
      error: error => {
        console.error('Error al cargar instructores:', error)
        this.showErrorMessage('Error al cargar los instructores')
        this.loading = false
      },
    })
  }

  /**
   * Handles filter changes from data table
   */
  onFilterChange(filterData: { key: string; value: any }): void {
    const { key, value } = filterData

    if (key === 'search') {
      this.dataSource.filter = value.trim().toLowerCase()
    } else {
      // For select filters, we need to implement custom filtering
      this.applySelectFilter(key, value)
    }
  }

  /**
   * Applies select filter
   */
  private applySelectFilter(filterKey: string, filterValue: any): void {
    this.dataSource.filterPredicate = (data: Instructor, filter: string) => {
      let matches = true

      if (filterKey === 'status' && filterValue) {
        matches = matches && data.status === filterValue
      }

      // Also apply text filter if it exists
      if (filter && filter.trim()) {
        const textMatch =
          data.name.toLowerCase().includes(filter) ||
          data.lastName.toLowerCase().includes(filter) ||
          data.email.toLowerCase().includes(filter) ||
          data.specialties.some(specialty => specialty.toLowerCase().includes(filter))
        matches = matches && textMatch
      }

      return matches
    }

    this.dataSource.filter = ' ' // Trigger filter
  }

  /**
   * Clears all filters
   */
  clearFilters(): void {
    this.dataSource.filter = ''
    this.dataSource.filterPredicate = () => true
  }

  /**
   * Abre el diálogo para crear un nuevo instructor
   */
  openCreateInstructorDialog(): void {
    console.log('Redireccionando a crear instructor: /admin/instructors/create')
    this.router.navigate(['/admin/instructors/create'])
  }

  /**
   * Ve los detalles de un instructor
   */
  viewInstructor(instructor: Instructor): void {
    console.log('Redireccionando a ver instructor: /admin/instructors/', instructor.id)
    this.router.navigate(['/admin/instructors', instructor.id])
  }

  /**
   * Edita un instructor
   */
  editInstructor(instructor: Instructor): void {
    console.log('Redireccionando a editar instructor: /admin/instructors/', instructor.id, 'edit')
    this.router.navigate(['/admin/instructors', instructor.id, 'edit'])
  }

  /**
   * Alterna el estado de un instructor
   */
  toggleInstructorStatus(instructor: Instructor): void {
    const newStatus =
      instructor.status === InstructorState.ACTIVE
        ? InstructorState.INACTIVE
        : InstructorState.ACTIVE
    const action = newStatus === InstructorState.ACTIVE ? 'activar' : 'desactivar'

    const dialogData: ConfirmDialogData = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Instructor`,
      message: `¿Está seguro que desea ${action} al instructor "${instructor.name} ${instructor.lastName}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.instructorsService.toggleInstructorStatus(instructor.id, newStatus).subscribe({
            next: () => {
              this.showSuccessMessage('Instructor modificado exitosamente')
              this.loadInstructors()
            },
            error: error => {
              this.showErrorMessage(error.message || `Error al ${action} el instructor`)
            },
          })
        }
      })
  }

  /**
   * Elimina un instructor
   */
  deleteInstructor(instructor: Instructor): void {
    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Instructor',
      message: `¿Está seguro que desea eliminar al instructor "${instructor.name} ${instructor.lastName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.instructorsService.deleteInstructor(instructor.id).subscribe({
            next: () => {
              this.showSuccessMessage('Instructor eliminado exitosamente')
              this.loadInstructors()
            },
            error: error => {
              this.showErrorMessage(error.message || 'Error al eliminar el instructor')
            },
          })
        }
      })
  }

  /**
   * Obtiene el color del chip para el estado
   */
  getStatusChipColor(status: InstructorState): string {
    return status === InstructorState.ACTIVE ? 'primary' : ''
  }

  /**
   * Obtiene el nombre completo del instructor
   */
  getFullName(instructor: Instructor): string {
    return `${instructor.name} ${instructor.lastName}`
  }

  /**
   * Track by function for specialties
   */
  trackBySpecialty(index: number, specialty: string): string {
    return specialty
  }

  /**
   * Gets action buttons for an instructor row
   */
  getActionButtons(instructor: Instructor): ActionButton[] {
    return [
      {
        icon: 'visibility',
        tooltip: 'Ver detalles',
        action: 'view',
      },
      {
        icon: 'edit',
        tooltip: 'Editar instructor',
        action: 'edit',
      },
      {
        icon: instructor.status === InstructorState.ACTIVE ? 'pause' : 'play_arrow',
        tooltip: instructor.status === InstructorState.ACTIVE ? 'Desactivar' : 'Activar',
        color: instructor.status === InstructorState.ACTIVE ? 'warn' : 'primary',
        action: 'toggle-status',
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar instructor',
        color: 'warn',
        action: 'delete',
      },
    ]
  }

  /**
   * Gets menu actions for an instructor row (if needed)
   */
  getMenuActions(instructor: Instructor): MenuAction[] {
    return []
  }

  /**
   * Handles action button clicks
   */
  onActionClicked(event: { action: string; data?: any }, instructor: Instructor): void {
    switch (event.action) {
      case 'view':
        this.viewInstructor(instructor)
        break
      case 'edit':
        this.editInstructor(instructor)
        break
      case 'toggle-status':
        this.toggleInstructorStatus(instructor)
        break
      case 'delete':
        this.deleteInstructor(instructor)
        break
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
