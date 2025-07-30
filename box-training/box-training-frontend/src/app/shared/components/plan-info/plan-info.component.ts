import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Plan, StudentPlan, StudentPlanStatus } from '../../../core/models';

// SE ESTÁ USANDO
@Component({
  selector: 'app-plan-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatProgressBarModule],
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent {
  @Input() planInfo?: Plan;
  @Input() activePlan?: StudentPlan;
  @Input() remainingDays: number = 0;

  getColorStatus(status: StudentPlanStatus): string {
    switch (status) {
      case StudentPlanStatus.ACTIVE:
        return 'primary';
      case StudentPlanStatus.FROZEN:
        return 'warn';
      case StudentPlanStatus.EXPIRED:
        return '';
      case StudentPlanStatus.CANCELED:
        return '';
      default:
        return '';
    }
  }

  getStatusDisplayName(status: StudentPlanStatus): string {
    switch (status) {
      case StudentPlanStatus.ACTIVE:
        return 'Activo';
      case StudentPlanStatus.FROZEN:
        return 'Congelado';
      case StudentPlanStatus.EXPIRED:
        return 'Vencido';
      case StudentPlanStatus.CANCELED:
        return 'Anulado';
      default:
        return status;
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  getProgressPercentage(): number {
    if (!this.planInfo || !this.activePlan) return 0;
    
    const totalClasses = this.planInfo.includedClasses;
    const availableClasses = this.activePlan.remainingClasses;
    
    if (totalClasses === 0 || totalClasses === 999) return 0;

    const usedClasses = totalClasses - availableClasses;
    return Math.round((usedClasses / totalClasses) * 100);
  }

  getUsedClasses(): number {
    if (!this.planInfo || !this.activePlan) return 0;
    
    const totalClasses = this.planInfo.includedClasses;
    const availableClasses = this.activePlan.remainingClasses;
    
    if (totalClasses === 999) return 0; // Plan ilimitado
    return totalClasses - availableClasses;
  }
}