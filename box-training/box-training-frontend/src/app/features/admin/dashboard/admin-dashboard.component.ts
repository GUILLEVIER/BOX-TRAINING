import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { Router, RouterModule } from '@angular/router'
import { forkJoin } from 'rxjs'
import { DashboardStats, User } from '../../../core/models'
import { PlansService } from '../../../core/services/plans.service'
import { LoadingComponent } from '../../../shared/components/loading/loading.component'
import { StatsGridComponent } from '../../../shared/components/stats-grid/stats-grid.component'
import { QuickActionsGridComponent } from '../../../shared/components/quick-actions-grid/quick-actions-grid.component'
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component'
import { ActivityListComponent } from '../../../shared/components/activity-list/activity-list.component'
import { ActivityItem, QuickAction, StatItem } from '../../../interfaces/propsInterface'
import { AuthService } from '../../../core/services/auth.service'
import { MainHeaderComponent } from '../../../shared/components'

/**
 * Componente del dashboard del administrador
 * Muestra estadísticas generales y accesos rápidos a funciones principales
 */
// PROBADO
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatListModule,
    LoadingComponent,
    StatsGridComponent,
    QuickActionsGridComponent,
    SectionHeaderComponent,
    ActivityListComponent,
    MainHeaderComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  /** Usuario actual */
  currentUser: User | null = null

  /** Estado de carga */
  loading = true

  /** Estadísticas */
  plansStats: DashboardStats | null = null

  /** Datos para el componente de estadísticas */
  statsData: StatItem[] = []

  /** Acciones rápidas */
  quickActions: QuickAction[] = []

  /** Items de actividad para el componente de lista */
  activityItems: ActivityItem[] = []

  /** Actividades recientes mock */
  recentActivities = [
    {
      type: 'new',
      description: 'Nuevo alumno registrado: Ana Silva',
      date: new Date(),
    },
    {
      type: 'update',
      description: 'Plan CrossFit Básico actualizado',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      type: 'new',
      description: 'Nueva reserva para clase de Zumba',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ]

  constructor(
    private authService: AuthService,
    private plansService: PlansService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.loadDashboardData()
    this.setupQuickActions()
  }

  /**
   * Configura las acciones rápidas
   */
  private setupQuickActions(): void {
    this.quickActions = [
      {
        icon: 'add_circle',
        title: 'Crear Plan',
        description: 'Crear un nuevo plan de entrenamiento',
        action: () => this.openCreatePlanDialog(),
      },
      {
        icon: 'schedule',
        title: 'Configurar Horarios',
        description: 'Gestionar horarios de clases',
        action: () => this.openCreateScheduleDialog(),
      },
      {
        icon: 'person_add',
        title: 'Crear Alumno',
        description: 'Crear un nuevo alumno',
        action: () => this.openCreateStudentDialog(),
      },
      {
        icon: 'assessment',
        title: 'Ver Reportes',
        description: 'Análisis y estadísticas detalladas',
        action: () => this.navigateTo('/admin/reports'),
      },
    ]
  }

  /**
   * Prepara los datos de estadísticas para el componente genérico
   */
  private setupStatsData(): void {
    if (!this.plansStats) return

    this.statsData = [
      {
        icon: 'people',
        value: this.plansStats.totalPlans,
        label: 'Total Planes',
        sublabel: `${this.plansStats.activePlans} activos`,
        iconClass: 'primary',
      },
      {
        icon: 'fitness_center',
        value: this.plansStats.totalPlans,
        label: 'Planes Totales',
        sublabel: `${this.plansStats.activePlans} activos`,
        iconClass: 'accent',
      },
      {
        icon: 'event',
        value: this.plansStats.estimatedRevenue,
        label: 'Reservas Hoy',
        sublabel: 'Clases programadas',
        iconClass: 'warn',
      },
      {
        icon: 'attach_money',
        value: this.formatCurrency(12506000),
        label: 'Ingresos Estimados',
        sublabel: 'Este mes',
        iconClass: 'success',
      },
    ]
  }

  /**
   * Prepara los datos de actividad para el componente genérico
   */
  private setupActivityData(): void {
    this.activityItems = this.recentActivities.map(activity => ({
      icon: this.getActivityIcon(activity.type),
      iconClass: this.getActivityIconClass(activity.type),
      title: activity.description,
      timestamp: activity.date,
    }))
  }

  /**
   * Carga los datos del dashboard
   */
  private loadDashboardData(): void {
    this.loading = true

    // Combinar múltiples observables para cargar datos en paralelo
    forkJoin({
      plansStats: this.plansService.getStatisticsPlans(),
    }).subscribe({
      next: data => {
        // Simular estadísticas generales
        this.plansStats = {
          totalPlans: data.plansStats.totalPlans,
          activePlans: data.plansStats.activePlans,
          totalAssignments: data.plansStats.totalAssignments,
          activeAssignments: data.plansStats.activeAssignments,
          estimatedRevenue: data.plansStats.estimatedRevenue,
        }

        // Configurar datos para componentes genéricos
        this.setupStatsData()
        this.setupActivityData()

        this.loading = false
      },
      error: error => {
        console.error('Error al cargar datos del dashboard:', error)
        this.loading = false
      },
    })
  }

  /**
   * Navega a una ruta específica
   * @param route Ruta a navegar
   */
  navigateTo(route: string): void {
    // En una implementación real, se usaría Router
    console.log('Navegar a:', route)
  }

  /**
   * Formatea un valor monetario
   * @param amount Cantidad a formatear
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  /**
   * Formatea una fecha
   * @param date Fecha a formatear
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  /**
   * Obtiene el icono para un tipo de actividad
   * @param type Tipo de actividad
   */
  getActivityIcon(type: string): string {
    switch (type) {
      case 'new':
        return 'add_circle'
      case 'update':
        return 'edit'
      case 'delete':
        return 'remove_circle'
      default:
        return 'info'
    }
  }

  /**
   * Obtiene la clase CSS para el icono de actividad
   * @param type Tipo de actividad
   */
  getActivityIconClass(type: string): string {
    return `activity-icon-${type}`
  }

  /**
   * Abre el diálogo para crear un nuevo plan
   */
  openCreatePlanDialog(): void {
    console.log('Redireccionando a crear plan: /admin/plans/create')
    this.router.navigate(['/admin/plans/create'])
  }

  /**
   * Abre el diálogo para crear un nuevo alumno
   */
  openCreateStudentDialog(): void {
    console.log('Redireccionando a crear alumno: /admin/students/create')
    this.router.navigate(['/admin/students/create'])
  }

  /**
   * Abre el diálogo para crear un nuevo horario
   */
  openCreateScheduleDialog(): void {
    console.log('Redireccionando a crear horario: /admin/schedules')
    this.router.navigate(['/admin/schedules'])
  }
}
