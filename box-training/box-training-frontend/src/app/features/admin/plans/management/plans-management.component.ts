import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router, RouterModule } from '@angular/router'
import { PlanStatus, Plan, PlanType } from '../../../../core/models'
import { PlansService } from '../../../../core/services/plans.service'
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component'
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import {
  DataTableComponent,
  TableColumn,
  FilterConfig,
} from '../../../../shared/components/data-table/data-table.component'
import {
  ActionButtonsComponent,
  ActionButton,
  MenuAction,
} from '../../../../shared/components/action-buttons/action-buttons.component'

/**
 * Componente para la gestión de planes del administrador
 * Permite ver, crear, editar y eliminar planes de entrenamiento
 */
@Component({
  selector: 'app-plans-management',
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
  templateUrl: './plans-management.component.html',
  styleUrls: ['./plans-management.component.scss'],
})
export class PlansManagementComponent implements OnInit {
  /** Data source para la tabla */
  dataSource = new MatTableDataSource<Plan>([])

  /** Estado de carga */
  loading = true

  /** Template references */
  @ViewChild('nameTemplate', { static: true }) nameTemplate!: TemplateRef<any>
  @ViewChild('typeTemplate', { static: true }) typeTemplate!: TemplateRef<any>
  @ViewChild('durationTemplate', { static: true }) durationTemplate!: TemplateRef<any>
  @ViewChild('classesTemplate', { static: true }) classesTemplate!: TemplateRef<any>
  @ViewChild('priceTemplate', { static: true }) priceTemplate!: TemplateRef<any>
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>

  /** Configuración de columnas para la tabla */
  tableColumns: TableColumn[] = []

  /** Configuración de filtros para la tabla */
  tableFilters: FilterConfig[] = [
    {
      key: 'search',
      label: 'Buscar planes',
      type: 'text',
      placeholder: 'Nombre o descripción',
    },
    {
      key: 'type',
      label: 'Tipo de Plan',
      type: 'select',
      options: [
        { value: 'PERSONALIZED', label: 'Personalizado' },
        { value: 'CROSSFIT', label: 'CrossFit' },
        { value: 'ZUMBA', label: 'Zumba' },
      ],
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Activo' },
        { value: 'INACTIVE', label: 'Inactivo' },
      ],
    },
  ]

  constructor(
    private plansService: PlansService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeTableColumns()
    this.loadPlanes()
  }

  /**
   * Initialize table columns with templates
   */
  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: 'name',
        label: 'Nombre',
        sortable: true,
        template: this.nameTemplate,
      },
      {
        key: 'type',
        label: 'Tipo',
        sortable: true,
        template: this.typeTemplate,
      },
      {
        key: 'durationDays',
        label: 'Duración',
        sortable: true,
        template: this.durationTemplate,
      },
      {
        key: 'includedClasses',
        label: 'Clases',
        sortable: true,
        template: this.classesTemplate,
      },
      {
        key: 'price',
        label: 'Precio',
        sortable: true,
        template: this.priceTemplate,
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
   * Configura la tabla después de la vista
   */
  ngAfterViewInit(): void {
    // No necesitamos configurar paginator y sort manualmente
    // ya que el DataTableComponent lo maneja internamente
  }

  /**
   * Carga la lista de planes
   */
  private loadPlanes(): void {
    this.loading = true

    this.plansService.getPlans().subscribe({
      next: response => {
        this.dataSource.data = response.data
        this.loading = false
      },
      error: error => {
        console.error('Error al cargar planes:', error)
        this.showErrorMessage('Error al cargar los planes')
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
    this.dataSource.filterPredicate = (data: Plan, filter: string) => {
      let matches = true

      if (filterKey === 'type' && filterValue) {
        matches = matches && data.type === filterValue
      }
      if (filterKey === 'status' && filterValue) {
        matches = matches && data.status === filterValue
      }

      // Also apply text filter if it exists
      if (filter && filter.trim()) {
        const textMatch =
          data.name.toLowerCase().includes(filter) ||
          data.description.toLowerCase().includes(filter)
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
   * Abre el diálogo para crear un nuevo plan
   */
  openCreatePlanDialog(): void {
    console.log('Redireccionando a crear plan: /admin/plans/create')
    this.router.navigate(['/admin/plans/create'])
  }

  /**
   * Abre el diálogo para crear un nuevo tipo de plan
   */
  openCreatePlanTypeDialog(): void {
    console.log('Redireccionando a crear tipo de plan: /admin/plans/types/create')
    this.router.navigate(['/admin/plans/types/create'])
  }

  /**
   * Ve los detalles de un plan
   */
  viewPlan(plan: Plan): void {
    console.log('Redireccionando a ver plan: /admin/plans/', plan.id)
    this.router.navigate(['/admin/plans', plan.id])
  }

  /**
   * Edita un plan
   */
  editPlan(plan: Plan): void {
    console.log('Redireccionando a editar plan: /admin/plans/', plan.id, 'edit')
    this.router.navigate(['/admin/plans', plan.id, 'edit'])
  }

  /**
   * Alterna el estado de un plan
   */
  togglePlanStatus(plan: Plan): void {
    const newStatus = plan.status === PlanStatus.ACTIVE ? PlanStatus.INACTIVE : PlanStatus.ACTIVE
    const action = newStatus === PlanStatus.ACTIVE ? 'activar' : 'desactivar'

    const dialogData: ConfirmDialogData = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Plan`,
      message: `¿Está seguro que desea ${action} el plan "${plan.name}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.plansService.updatePlan({ id: plan.id, status: newStatus }).subscribe({
            next: () => {
              this.showSuccessMessage('Plan modificado exitosamente')
              this.loadPlanes()
            },
            error: error => {
              this.showErrorMessage(`Error al ${action} el plan`)
            },
          })
        }
      })
  }

  /**
   * Elimina un plan
   */
  deletePlan(plan: Plan): void {
    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Plan',
      message: `¿Está seguro que desea eliminar el plan "${plan.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.plansService.deletePlan(plan.id).subscribe({
            next: () => {
              this.showSuccessMessage('Plan eliminado exitosamente')
              this.loadPlanes()
            },
            error: error => {
              this.showErrorMessage(error.message || 'Error al eliminar el plan')
            },
          })
        }
      })
  }

  /**
   * Asigna un plan a un estudiante
   */
  assignToStudent(plan: Plan): void {
    console.log('Redireccionando a asignar plan a estudiante: /admin/students/activate-plan')
    this.router.navigate(['/admin/students/activate-plan'], {
      queryParams: { planId: plan.id },
    })
  }

  /**
   * Duplica un plan
   */
  duplicatePlan(plan: Plan): void {
    // Implementar duplicación de plan
    console.log('Duplicar plan:', plan)
  }

  /**
   * Obtiene el color del chip para el estado
   */
  getStatusChipColor(state: PlanStatus): string {
    return state === PlanStatus.ACTIVE ? 'primary' : ''
  }

  /**
   * Formatea un valor monetario
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Gets action buttons for a plan row
   */
  getActionButtons(plan: Plan): ActionButton[] {
    return [
      {
        icon: 'visibility',
        tooltip: 'Ver detalles',
        action: 'view',
      },
      {
        icon: 'edit',
        tooltip: 'Editar plan',
        action: 'edit',
      },
      {
        icon: plan.status === PlanStatus.ACTIVE ? 'pause' : 'play_arrow',
        tooltip: plan.status === PlanStatus.ACTIVE ? 'Desactivar' : 'Activar',
        color: plan.status === PlanStatus.ACTIVE ? 'warn' : 'primary',
        action: 'toggle-status',
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar plan',
        color: 'warn',
        action: 'delete',
      },
    ]
  }

  /**
   * Gets menu actions for a plan row
   */
  getMenuActions(plan: Plan): MenuAction[] {
    return [
      {
        icon: 'person_add',
        label: 'Asignar a Estudiante',
        action: 'assign-student',
      },
      {
        icon: 'content_copy',
        label: 'Duplicar Plan',
        action: 'duplicate',
      },
    ]
  }

  /**
   * Handles action button clicks
   */
  onActionClicked(event: { action: string; data?: any }, plan: Plan): void {
    switch (event.action) {
      case 'view':
        this.viewPlan(plan)
        break
      case 'edit':
        this.editPlan(plan)
        break
      case 'toggle-status':
        this.togglePlanStatus(plan)
        break
      case 'delete':
        this.deletePlan(plan)
        break
      case 'assign-student':
        this.assignToStudent(plan)
        break
      case 'duplicate':
        this.duplicatePlan(plan)
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

  /**
   * Obtiene el nombre para mostrar del tipo de plan
   */
  getTypeDisplayName(type: PlanType): string {
    switch (type.name) {
      case 'ZUMBA':
        return 'Zumba'
      case 'CROSSFIT':
        return 'CrossFit'
      case 'PERSONALIZADO':
        return 'Personalizado'
      case 'BOX LIBRE':
        return 'Box Libre'
      case 'FUNCIONAL':
        return 'Funcional'
      default:
        return type.name
    }
  }

  getChipTypeColor(type: PlanType): string {
    switch (type.name) {
      case 'ZUMBA':
        return 'primary'
      case 'CROSSFIT':
        return 'accent'
      case 'PERSONALIZADO':
        return 'warn'
      case 'BOX LIBRE':
        return 'primary'
      case 'FUNCIONAL':
        return 'accent'
      default:
        return 'primary'
    }
  }
}
