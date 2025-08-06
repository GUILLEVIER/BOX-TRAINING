import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay, map } from 'rxjs/operators'
import { Schedule, PlanType } from '../models'
import { MockDataService } from './mock-data.service'

/**
 * Servicio para la gestión de horarios de clases
 */
@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Obtiene todos los horarios disponibles
   */
  getSchedules(): Observable<Schedule[]> {
    return of(null).pipe(
      delay(500),
      map(() => this.mockDataService.getSchedules())
    )
  }

  /**
   * Obtiene horarios filtrados por tipo de plan
   * @param planType Tipo de plan para filtrar horarios
   */
  getSchedulesByPlanType(planType: PlanType): Observable<Schedule[]> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const allSchedules = this.mockDataService.getSchedules()
        return allSchedules.filter(schedule => schedule.classType === planType)
      })
    )
  }

  /**
   * Obtiene un horario por su ID
   * @param id ID del horario
   */
  getScheduleById(id: string): Observable<Schedule | undefined> {
    return of(null).pipe(
      delay(300),
      map(() => this.mockDataService.getScheduleById(id))
    )
  }

  /**
   * Formatea la información del día de la semana
   * @param dayOfWeek Número del día (0-6)
   */
  getDayName(dayOfWeek: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return days[dayOfWeek] || ''
  }

  /**
   * Formatea el horario para mostrar
   * @param schedule Horario a formatear
   */
  formatScheduleDisplay(schedule: Schedule): string {
    const dayName = this.getDayName(schedule.dayOfWeek)
    return `${dayName} ${schedule.startTime} - ${schedule.endTime} (${schedule.room})`
  }
}
