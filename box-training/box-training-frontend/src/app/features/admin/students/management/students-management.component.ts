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
import { DetailedStudent, StudentStatus } from '../../../../core/models'

// Shared Component Types
import {
  ActionButton,
  ConfirmDialogData,
  FilterConfig,
  MenuAction,
  TableColumn,
} from '../../../../interfaces/propsInterface'

// Core Services
import { StudentsService } from '../../../../core/services/students.service'
import { PlansService } from '../../../../core/services/plans.service'

// Shared Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component'
import { ActionButtonsComponent } from '../../../../shared/components/action-buttons/action-buttons.component'
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'

/**
 * Componente para la gestión de alumnos del administrador
 * Permite ver, crear, editar y eliminar alumnos
 */
@Component({
  selector: 'app-students-management',
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
  templateUrl: './students-management.component.html',
  styleUrls: ['./students-management.component.scss'],
})
export class StudentsManagementComponent implements OnInit, AfterViewInit {
  /** Data source para la tabla */
  dataSource = new MatTableDataSource<DetailedStudent>([])

  /** Estado de carga */
  loading = true

  /** Lista de planes disponibles para obtener nombres */
  availablePlans: any[] = []

  /** Mapping de plan IDs a nombres de planes */
  planIdToNameMap: { [key: string]: string } = {}

  /** Lista de planes disponibles para filtros */
  plansForFilters: any[] = []

  /** Template references */
  @ViewChild('nameTemplate', { static: true }) nameTemplate!: TemplateRef<any>
  @ViewChild('planTemplate', { static: true }) planTemplate!: TemplateRef<any>
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>

  /** Configuración de columnas para la tabla */
  tableColumns: TableColumn[] = []

  /** Configuración de filtros para la tabla */
  tableFilters: FilterConfig[] = [
    {
      key: 'search',
      label: 'Buscar Alumnos',
      type: 'text',
      placeholder: 'Nombre, apellido o email',
    },
    {
      key: 'planId',
      label: 'Plan Inscrito',
      type: 'select',
      options: [], // Se cargará dinámicamente
    },
    {
      key: 'status',
      label: 'Estado del Alumno',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Activo' },
        { value: 'INACTIVE', label: 'Inactivo' },
      ],
    },
  ]

  constructor(
    private studentsService: StudentsService,
    private plansService: PlansService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeTableColumns()
    this.loadPlansData()
    this.loadStudents()
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
        label: 'Nombre Alumno',
        sortable: true,
        template: this.nameTemplate,
      },
      {
        key: 'activePlan',
        label: 'Plan Inscrito',
        sortable: false,
        template: this.planTemplate,
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
   * Carga los datos de planes necesarios
   */
  private loadPlansData(): void {
    // Cargar todos los planes para el mapping de nombres
    this.plansService.getPlans().subscribe({
      next: response => {
        this.availablePlans = response.data
        // Crear mapping de ID a nombre
        this.planIdToNameMap = {}
        this.availablePlans.forEach(plan => {
          this.planIdToNameMap[plan.id] = plan.name
        })
      },
      error: error => {
        console.error('Error al cargar planes:', error)
      },
    })

    // Cargar planes con estudiantes para filtros
    this.loadPlansForFilters()
  }

  /**
   * Carga los planes disponibles para los filtros
   */
  private loadPlansForFilters(): void {
    this.studentsService.getPlansWithStudents().subscribe({
      next: plans => {
        this.plansForFilters = plans
        // Actualizar las opciones del filtro de planes
        const planFilter = this.tableFilters.find(f => f.key === 'planId')
        if (planFilter) {
          planFilter.options = [
            { value: '', label: 'Todos los planes' },
            ...plans.map(plan => ({
              value: plan.id,
              label: `${plan.name} (${plan.studentsCount} alumnos)`,
            })),
          ]
        }
      },
      error: error => {
        console.error('Error al cargar planes para filtros:', error)
      },
    })
  }

  /**
   * Carga la lista de alumnos
   */
  private loadStudents(): void {
    this.loading = true

    this.studentsService.getStudents().subscribe({
      next: response => {
        this.dataSource.data = response.data
        this.loading = false
      },
      error: error => {
        console.error('Error al cargar alumnos:', error)
        this.showErrorMessage('Error al cargar los alumnos')
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
    this.dataSource.filterPredicate = (data: DetailedStudent, filter: string) => {
      let matches = true

      if (filterKey === 'planId' && filterValue) {
        matches = matches && data.activePlan?.planId === filterValue
      }
      if (filterKey === 'status' && filterValue) {
        matches = matches && data.status === filterValue
      }

      // Also apply text filter if it exists
      if (filter && filter.trim()) {
        const textMatch =
          data.firstName.toLowerCase().includes(filter) ||
          data.lastName.toLowerCase().includes(filter) ||
          data.email.toLowerCase().includes(filter)
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
   * Abre el diálogo para crear un nuevo alumno
   */
  openCreateStudentDialog(): void {
    console.log('Redireccionando a crear alumno: /admin/students/create')
    this.router.navigate(['/admin/students/create'])
  }

  /**
   * Ve los detalles de un alumno
   */
  viewStudent(student: DetailedStudent): void {
    console.log('Redireccionando a ver alumno: /admin/students/', student.id)
    this.router.navigate(['/admin/students', student.id])
  }

  /**
   * Edita un alumno
   */
  editStudent(student: DetailedStudent): void {
    console.log('Redireccionando a editar alumno: /admin/students/', student.id, 'edit')
    this.router.navigate(['/admin/students', student.id, 'edit'])
  }

  /**
   * Alterna el estado de un alumno
   */
  toggleStudentStatus(student: DetailedStudent): void {
    const newStatus =
      student.status === StudentStatus.ACTIVE ? StudentStatus.INACTIVE : StudentStatus.ACTIVE
    const action = newStatus === StudentStatus.ACTIVE ? 'activar' : 'desactivar'

    const dialogData: ConfirmDialogData = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Alumno`,
      message: `¿Está seguro que desea ${action} al alumno "${student.firstName} ${student.lastName}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.studentsService.toggleStudentStatus(student.id, newStatus).subscribe({
            next: () => {
              this.showSuccessMessage('Alumno modificado exitosamente')
              this.loadStudents()
            },
            error: error => {
              this.showErrorMessage(error.message || `Error al ${action} el alumno`)
            },
          })
        }
      })
  }

  /**
   * Elimina un alumno
   */
  deleteStudent(student: DetailedStudent): void {
    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Alumno',
      message: `¿Está seguro que desea eliminar al alumno "${student.firstName} ${student.lastName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.studentsService.deleteStudent(student.id).subscribe({
            next: () => {
              this.showSuccessMessage('Alumno eliminado exitosamente')
              this.loadStudents()
            },
            error: error => {
              this.showErrorMessage(error.message || 'Error al eliminar el alumno')
            },
          })
        }
      })
  }

  /**
   * Obtiene el color del chip para el estado
   */
  getStatusChipColor(status: StudentStatus): string {
    return status === StudentStatus.ACTIVE ? 'primary' : ''
  }

  /**
   * Obtiene el nombre completo del alumno
   */
  getFullName(student: DetailedStudent): string {
    return `${student.firstName} ${student.lastName}`
  }

  /**
   * Obtiene el nombre del plan activo del alumno
   */
  getActivePlanName(student: DetailedStudent): string {
    if (!student.activePlan) {
      return 'Sin plan activo'
    }

    // Usar el mapping para obtener el nombre del plan
    const planName = this.planIdToNameMap[student.activePlan.planId]
    return planName || 'Plan no encontrado'
  }

  /**
   * Gets action buttons for a student row
   */
  getActionButtons(student: DetailedStudent): ActionButton[] {
    return [
      {
        icon: 'visibility',
        tooltip: 'Ver detalles',
        action: 'view',
      },
      {
        icon: 'edit',
        tooltip: 'Editar alumno',
        action: 'edit',
      },
      {
        icon: student.status === StudentStatus.ACTIVE ? 'pause' : 'play_arrow',
        tooltip: student.status === StudentStatus.ACTIVE ? 'Desactivar' : 'Activar',
        color: student.status === StudentStatus.ACTIVE ? 'warn' : 'primary',
        action: 'toggle-status',
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar alumno',
        color: 'warn',
        action: 'delete',
      },
    ]
  }

  /**
   * Gets menu actions for a student row (if needed)
   */
  getMenuActions(student: DetailedStudent): MenuAction[] {
    return []
  }

  /**
   * Handles action button clicks
   */
  onActionClicked(event: { action: string; data?: any }, student: DetailedStudent): void {
    switch (event.action) {
      case 'view':
        this.viewStudent(student)
        break
      case 'edit':
        this.editStudent(student)
        break
      case 'toggle-status':
        this.toggleStudentStatus(student)
        break
      case 'delete':
        this.deleteStudent(student)
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
