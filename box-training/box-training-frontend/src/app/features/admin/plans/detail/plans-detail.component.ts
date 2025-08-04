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
import { Plan, PlanStatus, PlanType, PlanFormat } from '../../../../core/models'
import { PlansService } from '../../../../core/services/plans.service'
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component'
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component'

/**
 * Componente para mostrar los detalles de un plan
 * Incluye información completa del plan y acciones disponibles
 */
@Component({
  selector: 'app-plans-detail',
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans-detail.component.html',
  styleUrls: ['./plans-detail.component.scss'],
})
export class PlansDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly snackBar = inject(MatSnackBar)
  private readonly dialog = inject(MatDialog)
  private readonly plansService = inject(PlansService)

  // Signals
  protected readonly loading = signal(true)
  protected readonly plan = signal<Plan | null>(null)
  protected readonly planId = signal<string | null>(null)

  // Computed signals
  protected readonly hasActiveStudents = computed(() => {
    const currentPlan = this.plan()
    return currentPlan ? this.checkActiveStudentsSync(currentPlan.id) : false
  })

  protected readonly canEditPlanType = computed(() => {
    return !this.hasActiveStudents()
  })

  /**
   * Verificación síncrona para el computed (simplificada)
   * En una implementación real, esto se haría de forma asíncrona
   */
  private checkActiveStudentsSync(planId: string): boolean {
    // TODO: Implementar verificación síncrona o usar un signal separado
    // Por ahora simulamos que algunos planes tienen estudiantes activos
    const plansWithActiveStudents = ['1', '2', '3'] // IDs de ejemplo
    return plansWithActiveStudents.includes(planId)
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
   * Carga los datos del plan
   */
  private loadPlan(id: string): void {
    this.loading.set(true)

    this.plansService.getPlanById(id).subscribe({
      next: plan => {
        this.plan.set(plan)
        this.loading.set(false)
      },
      error: error => {
        console.error('Error al cargar plan:', error)
        this.showErrorMessage('Error al cargar los detalles del plan')
        this.loading.set(false)
        this.goBack()
      },
    })
  }

  /**
   * Navega al formulario de edición
   */
  protected editPlan(): void {
    const id = this.planId()
    if (id) {
      this.router.navigate(['/admin/plans', id, 'edit'])
    }
  }

  /**
   * Alterna el estado del plan
   */
  protected togglePlanStatus(): void {
    const currentPlan = this.plan()
    if (!currentPlan) return

    const newStatus =
      currentPlan.status === PlanStatus.ACTIVE ? PlanStatus.INACTIVE : PlanStatus.ACTIVE
    const action = newStatus === PlanStatus.ACTIVE ? 'activar' : 'desactivar'

    const dialogData: ConfirmDialogData = {
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Plan`,
      message: `¿Está seguro que desea ${action} el plan "${currentPlan.name}"?`,
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      type: 'info',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed && currentPlan) {
          this.plansService.updatePlan({ id: currentPlan.id, status: newStatus }).subscribe({
            next: () => {
              this.showSuccessMessage('Plan modificado exitosamente')
              this.loadPlan(currentPlan.id)
            },
            error: error => {
              this.showErrorMessage(`Error al ${action} el plan`)
            },
          })
        }
      })
  }

  /**
   * Elimina el plan
   */
  protected deletePlan(): void {
    const currentPlan = this.plan()
    if (!currentPlan) return

    const dialogData: ConfirmDialogData = {
      title: 'Eliminar Plan',
      message: `¿Está seguro que desea eliminar el plan "${currentPlan.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    }

    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed && currentPlan) {
          this.plansService.deletePlan(currentPlan.id).subscribe({
            next: () => {
              this.showSuccessMessage('Plan eliminado exitosamente')
              this.router.navigate(['/admin/plans'])
            },
            error: error => {
              this.showErrorMessage(error.message || 'Error al eliminar el plan')
            },
          })
        }
      })
  }

  /**
   * Asigna el plan a un estudiante
   */
  protected assignToStudent(): void {
    const currentPlan = this.plan()
    if (currentPlan) {
      this.router.navigate(['/admin/students/activate-plan'], {
        queryParams: { planId: currentPlan.id },
      })
    }
  }

  /**
   * Navega de vuelta a la lista de planes
   */
  protected goBack(): void {
    this.router.navigate(['/admin/plans'])
  }

  /**
   * Obtiene el color del chip para el estado
   */
  protected getStatusChipColor(status: PlanStatus): string {
    return status === PlanStatus.ACTIVE ? 'primary' : ''
  }

  /**
   * Obtiene el nombre para mostrar del tipo de plan
   */
  protected getTypeDisplayName(type: PlanType): string {
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

  /**
   * Obtiene el color del chip para el tipo de plan
   */
  protected getChipTypeColor(type: PlanType): string {
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

  /**
   * Formatea un valor monetario
   */
  protected formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Formatea el tamaño de archivo
   */
  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
