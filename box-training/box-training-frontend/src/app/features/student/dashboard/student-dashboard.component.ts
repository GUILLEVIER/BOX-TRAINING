import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { RouterModule, Router } from '@angular/router'
import { Plan, StudentPlan, Reservation, User, PlanType } from '../../../core/models'
import { AuthService } from '../../../core/services/auth.service'
import { MockDataService } from '../../../core/services/mock-data.service'
import { LoadingComponent } from '../../../shared/components/loading/loading.component'
import { MainHeaderComponent } from '../../../shared/components/main-header/main-header.component'
import { PlanInfoComponent } from '../../../shared/components/plan-info/plan-info.component'
import { UpcomingReservationsComponent } from '../../../shared/components/upcoming-reservations/upcoming-reservations.component'
import { NoPlanMessageComponent } from '../../../shared/components/no-plan-message/no-plan-message.component'
import {
  StatsGridComponent,
  StatItem,
} from '../../../shared/components/stats-grid/stats-grid.component'
import {
  QuickActionsGridComponent,
  QuickAction,
} from '../../../shared/components/quick-actions-grid/quick-actions-grid.component'
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component'

/**
 * Interfaz para los datos del dashboard del alumno
 */
// PROBADO
interface StudentDashboardData {
  activePlan?: StudentPlan
  planInfo?: Plan
  upcomingReservations: Reservation[]
  statistics: {
    availableClasses: number
    scheduledClasses: number
    totalClasses: number
    remainingDays: number
  }
}

/**
 * Componente del dashboard del alumno
 * Muestra información del plan activo, estadísticas y próximas clases
 */
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatProgressBarModule,
    LoadingComponent,
    PlanInfoComponent,
    UpcomingReservationsComponent,
    MainHeaderComponent,
    NoPlanMessageComponent,
    StatsGridComponent,
    QuickActionsGridComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  /** Usuario actual */
  currentUser: User | null = null

  /** Estado de carga */
  loading = true

  /** Datos del dashboard */
  dashboardData: StudentDashboardData = {
    upcomingReservations: [],
    statistics: {
      availableClasses: 0,
      scheduledClasses: 0,
      totalClasses: 0,
      remainingDays: 0,
    },
  }

  /** Datos para el componente de estadísticas */
  statsData: StatItem[] = []

  /** Acciones rápidas */
  quickActions: QuickAction[] = []

  constructor(
    private authService: AuthService,
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.setupQuickActions()
    this.loadDashboardData()
  }

  /**
   * Configura las acciones rápidas
   */
  private setupQuickActions(): void {
    this.quickActions = [
      {
        icon: 'calendar_today',
        title: 'Agendar Clase',
        description: 'Reserva tu próxima sesión',
        action: () => this.navigateToSchedules(),
      },
      {
        icon: 'event_note',
        title: 'Mis Reservas',
        description: 'Gestiona tus clases',
        action: () => this.navigateToReservations(),
      },
      {
        icon: 'history',
        title: 'Historial',
        description: 'Ver clases pasadas',
        action: () => this.navigateToHistory(),
      },
    ]
  }

  /**
   * Prepara los datos de estadísticas para el componente genérico
   */
  private setupStatsData(): void {
    this.statsData = [
      {
        icon: 'fitness_center',
        value: this.dashboardData.statistics.availableClasses,
        label: 'Clases Disponibles',
        iconClass: 'available',
      },
      {
        icon: 'event',
        value: this.dashboardData.statistics.scheduledClasses,
        label: 'Clases Agendadas',
        iconClass: 'scheduled',
      },
      {
        icon: 'assessment',
        value: this.dashboardData.statistics.totalClasses,
        label: 'Total en el Plan',
        iconClass: 'total',
      },
    ]
  }

  /**
   * Carga los datos del dashboard
   */
  private loadDashboardData(): void {
    this.loading = true

    if (!this.currentUser) {
      this.loading = false
      return
    }

    // Obtener plan activo del alumno
    const activePlan = this.mockDataService.getStudentActivePlan(this.currentUser.id)
    console.log('PLAN ACTIVO: ', activePlan)

    if (activePlan) {
      // Obtener información del plan
      const planInfo = this.mockDataService.getPlanById(activePlan.planId)
      console.log('INFORMACIÓN DEL PLAN: ', planInfo)

      // Obtener próximas reservas
      const upcomingReservations = this.mockDataService.getStudentFutureReservations(
        this.currentUser.id
      )
      //const remainingDays = this.calculateRemainingDays(activePlan.endDate);

      // Calcular estadísticas
      const totalClasses = planInfo?.includedClasses || 0
      const availableClasses = activePlan.remainingClasses
      const scheduledClasses = upcomingReservations.length

      this.dashboardData = {
        activePlan,
        planInfo,
        upcomingReservations,
        statistics: {
          availableClasses,
          scheduledClasses,
          totalClasses,
          remainingDays: 0,
        },
      }

      // Configurar datos para componentes genéricos
      this.setupStatsData()
    }

    this.loading = false
  }

  private calculateRemainingDays(endDate: Date): number {
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
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

  /**
   * Navega a horarios disponibles
   */
  navigateToSchedules(): void {
    this.router.navigate(['/student/reservation/create'])
    // Router navigation - placeholder
    console.log('Navegar a horarios')
  }

  /**
   * Navega a mis reservas
   */
  navigateToReservations(): void {
    console.log('Navegar a reservas')
  }

  /**
   * Navega al historial
   */
  navigateToHistory(): void {
    console.log('Navegar a historial')
  }

  /**
   * Cancela una reserva
   */
  cancelReservation(reservation: Reservation): void {
    console.log('Cancelar reserva:', reservation)
  }

  /**
   * Contacta al administrador
   */
  contactAdmin(): void {
    console.log('Contactar administrador')
  }
}
