import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay, map } from 'rxjs/operators'
import {
  Plan,
  CreatePlanDto,
  UpdatePlanDto,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  StudentPlanStatus,
  StudentPlan,
  ActivatePlanDto,
  FreezePlanDto,
  CancelPlanDto,
  CreatePlanTypeDto,
  PlanType,
} from '../models'
import { MockDataService } from './mock-data.service'

/**
 * Servicio para la gestión de planes de entrenamiento
 * Maneja CRUD de planes y operaciones relacionadas con asignación a alumnos
 */
@Injectable({
  providedIn: 'root',
})
export class PlansService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Obtiene todos los planes con paginación y filtros
   * @param params Parámetros de paginación
   * @param filters Filtros de búsqueda
   */
  getPlans(params?: PaginationParams, filters?: any): Observable<PaginatedResponse<Plan>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        let plans = this.mockDataService.getPlans()

        // Aplicar filtros si existen
        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            plans = plans.filter(
              plan =>
                plan.name.toLowerCase().includes(searchTerm) ||
                plan.description.toLowerCase().includes(searchTerm)
            )
          }

          if (filters.type) {
            plans = plans.filter(plan => plan.type === filters.type)
          }

          if (filters.status) {
            plans = plans.filter(plan => plan.status === filters.status)
          }
        }

        // Aplicar paginación si se proporcionan parámetros
        const page = params?.page || 1
        const limit = params?.limit || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        const paginatedPlans = plans.slice(startIndex, endIndex)

        return {
          data: paginatedPlans,
          total: plans.length,
          page,
          limit,
          totalPages: Math.ceil(plans.length / limit),
        }
      })
    )
  }

  /**
   * Obtiene un plan por su ID
   * @param id ID del plan
   */
  getPlanById(id: string): Observable<Plan> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const plan = this.mockDataService.getPlanById(id)
        if (!plan) {
          throw new Error(`Plan con ID ${id} no encontrado`)
        }
        return plan
      })
    )
  }

  /**
   * Verifica si un plan tiene estudiantes activos
   * @param planId ID del plan
   */
  hasActiveStudents(planId: string): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const studentPlans = this.mockDataService.getStudentPlans()
        return studentPlans.some(
          sp => sp.planId === planId && sp.status === StudentPlanStatus.ACTIVE
        )
      })
    )
  }

  /**
   * Crea un nuevo tipo de plan
   * @param createPlanTypeDto Datos del nuevo tipo de plan
   */
  createPlanType(createPlanTypeDto: CreatePlanTypeDto): Observable<ApiResponse<PlanType>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Validar que el nombre del tipo de plan sea único
        const existingTypes = this.mockDataService.getPlanTypes()
        const existsType = existingTypes.some(
          pt => pt.name.toLowerCase() === createPlanTypeDto.name.toLowerCase()
        )

        if (existsType) {
          throw new Error('Ya existe un tipo de plan con este nombre')
        }

        // Crear el nuevo tipo de plan
        const newPlanType = this.mockDataService.addPlanType(createPlanTypeDto)
        return {
          success: true,
          data: newPlanType,
          message: 'Tipo de plan creado exitosamente',
        }
      })
    )
  }

  /**
   * Crea un nuevo plan
   * @param planData Datos del nuevo plan
   */
  createPlan(planData: CreatePlanDto): Observable<ApiResponse<Plan>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Validar que el nombre del plan sea único
        const plans = this.mockDataService.getPlans()
        const existsPlan = plans.some(p => p.name.toLowerCase() === planData.name.toLowerCase())

        if (existsPlan) {
          throw new Error('Ya existe un plan con este nombre')
        }

        // Validar que se hayan seleccionado horarios
        /*
        if (!planData.availableSchedules || planData.availableSchedules.length === 0) {
          throw new Error('Debe seleccionar al menos un horario');
        }
        */

        // Validar duración y precio
        if (planData.durationDays <= 0) {
          throw new Error('La duración debe ser mayor a 0')
        }

        if (planData.price < 0) {
          throw new Error('El precio debe ser mayor o igual a 0')
        }

        // Crear el plan
        const newPlan = this.mockDataService.addPlan({
          ...planData,
          status: 'ACTIVE' as any,
        })

        return {
          success: true,
          data: newPlan,
          message: 'Plan creado exitosamente',
        }
      })
    )
  }

  /**
   * Actualiza un plan existente
   * @param updateData Datos de actualización del plan
   */
  updatePlan(updateData: UpdatePlanDto): Observable<ApiResponse<Plan>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const existingPlan = this.mockDataService.getPlanById(updateData.id)
        if (!existingPlan) {
          throw new Error('Plan no encontrado')
        }

        // Verificar si hay alumnos activos con este plan
        const studentPlans = this.mockDataService.getStudentPlans()
        const hasActiveStudents = studentPlans.some(
          sp => sp.planId === updateData.id && sp.status === StudentPlanStatus.ACTIVE
        )

        // Si hay alumnos activos, no permitir cambio de tipo
        if (
          hasActiveStudents &&
          updateData.type &&
          JSON.stringify(updateData.type) !== JSON.stringify(existingPlan.type)
        ) {
          throw new Error('No se puede cambiar el tipo de plan mientras haya alumnos activos')
        }

        // Validar nombre único si se está cambiando
        if (updateData.name && updateData.name !== existingPlan.name) {
          const plans = this.mockDataService.getPlans()
          const existsName = plans.some(
            p => p.id !== updateData.id && p.name.toLowerCase() === updateData.name!.toLowerCase()
          )

          if (existsName) {
            throw new Error('Ya existe un plan con este nombre')
          }
        }

        // Validar datos de negocio
        if (updateData.durationDays && updateData.durationDays <= 0) {
          throw new Error('La duración debe ser mayor a 0')
        }

        if (updateData.price && updateData.price < 0) {
          throw new Error('El precio debe ser mayor o igual a 0')
        }

        if (updateData.includedClasses && updateData.includedClasses <= 0) {
          throw new Error('El número de clases debe ser mayor a 0')
        }

        // Actualizar el plan
        const planActualizado = this.mockDataService.updatePlan(updateData.id, updateData)
        if (!planActualizado) {
          throw new Error('Error al actualizar el plan')
        }

        const message = hasActiveStudents
          ? 'Plan actualizado. Los cambios no afectan a alumnos activos.'
          : 'Plan actualizado exitosamente'

        return {
          success: true,
          data: planActualizado,
          message: message,
        }
      })
    )
  }

  /**
   * Elimina un plan
   * @param id ID del plan a eliminar
   */
  deletePlan(id: string): Observable<ApiResponse<void>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const deleted = this.mockDataService.deletePlan(id)

        if (!deleted) {
          throw new Error('No se puede eliminar el plan. Verifique que no tenga alumnos activos.')
        }

        return {
          success: true,
          message: 'Plan eliminado exitosamente',
        }
      })
    )
  }

  /**
   * Activa un plan para un alumno
   * @param activateData Datos para activar el plan
   */
  activateStudentPlan(activateData: ActivatePlanDto): Observable<ApiResponse<StudentPlan>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Verificar que el alumno existe
        const student = this.mockDataService.getStudentById(activateData.studentId)
        if (!student) {
          throw new Error('Alumno no encontrado')
        }

        // Verificar que el plan existe
        const plan = this.mockDataService.getPlanById(activateData.planId)
        if (!plan) {
          throw new Error('Plan no encontrado')
        }

        // Desactivar plan anterior si existe
        const studentPlans = this.mockDataService.getStudentPlans()
        const previousPlan = studentPlans.find(
          sp => sp.studentId === activateData.studentId && sp.status === StudentPlanStatus.ACTIVE
        )

        if (previousPlan) {
          this.mockDataService.updateStudentPlan(previousPlan.id, {
            status: StudentPlanStatus.CANCELED,
            reasonCancellation: 'Replaced by new plan',
          })
        }

        // Calcular fecha de vencimiento
        const expirationDate = new Date(activateData.startDate)
        expirationDate.setDate(expirationDate.getDate() + plan.durationDays)

        // Crear nuevo plan alumno
        const newStudentPlan: Omit<StudentPlan, 'id'> = {
          studentId: activateData.studentId,
          planId: activateData.planId,
          startDate: activateData.startDate,
          endDate: expirationDate,
          remainingClasses: activateData.includedClasses || plan.includedClasses,
          status: StudentPlanStatus.ACTIVE,
        }

        const planCreated = this.mockDataService.addStudentPlan(newStudentPlan)

        return {
          success: true,
          data: planCreated,
          message: `Plan ${plan.name} activado para ${student.firstName} ${student.lastName}`,
        }
      })
    )
  }

  /**
   * Congela el plan de un alumno
   * @param freezeData Datos para congelar el plan
   */
  congelarPlanAlumno(freezeData: FreezePlanDto): Observable<ApiResponse<StudentPlan>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const planStudent = this.mockDataService.getStudentPlanById(freezeData.studentPlanId)
        if (!planStudent) {
          throw new Error('Plan del alumno no encontrado')
        }

        if (planStudent.status !== StudentPlanStatus.ACTIVE) {
          throw new Error('Solo se pueden congelar planes activos')
        }

        // Calcular días de congelamiento
        const daysFreezing = Math.ceil(
          (freezeData.endDate.getTime() - freezeData.startDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Extender fecha de vencimiento
        const newExpirationDate = new Date(planStudent.endDate)
        newExpirationDate.setDate(newExpirationDate.getDate() + daysFreezing)

        // Agregar período de congelamiento
        const freezingPeriods = planStudent.frozenPeriods || []
        freezingPeriods.push({
          start: freezeData.startDate,
          end: freezeData.endDate,
          reason: freezeData.reason,
        })

        // Actualizar plan
        const updatedPlan = this.mockDataService.updateStudentPlan(freezeData.studentPlanId, {
          status: StudentPlanStatus.FROZEN,
          endDate: newExpirationDate,
          frozenPeriods: freezingPeriods,
        })

        if (!updatedPlan) {
          throw new Error('Error al congelar el plan')
        }

        // TODO: Cancelar reservas futuras en el período de congelamiento
        // TODO: Enviar notificación al alumno

        return {
          success: true,
          data: updatedPlan,
          message: 'Plan congelado exitosamente',
        }
      })
    )
  }

  /**
   * Anula el plan de un alumno
   * @param cancelData Datos para anular el plan
   */
  cancelStudentPlan(cancelData: CancelPlanDto): Observable<ApiResponse<StudentPlan>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const studentPlan = this.mockDataService.getStudentPlanById(cancelData.studentPlanId)
        if (!studentPlan) {
          throw new Error('Plan del alumno no encontrado')
        }

        if (studentPlan.status === StudentPlanStatus.CANCELED) {
          throw new Error('El plan ya está anulado')
        }

        // Actualizar plan
        const updatedPlan = this.mockDataService.updateStudentPlan(cancelData.studentPlanId, {
          status: StudentPlanStatus.CANCELED,
          reasonCancellation: cancelData.reason,
        })

        if (!updatedPlan) {
          throw new Error('Error al anular el plan')
        }

        // TODO: Cancelar todas las reservas futuras
        // TODO: Liberar cupos
        // TODO: Enviar notificación al alumno

        return {
          success: true,
          data: updatedPlan,
          message: 'Plan anulado exitosamente',
        }
      })
    )
  }

  /**
   * Obtiene los planes activos de todos los alumnos
   */
  getActivePlans(): Observable<StudentPlan[]> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const studentPlans = this.mockDataService.getStudentPlans()
        return studentPlans.filter(sp => sp.status === StudentPlanStatus.ACTIVE)
      })
    )
  }

  /**
   * Obtiene estadísticas de planes
   */
  getStatisticsPlans(): Observable<any> {
    return of(null).pipe(
      delay(600),
      map(() => {
        // TODOS LOS PLANES
        const plans = this.mockDataService.getPlans()
        // TODOS LOS ESTUDIANTES CON PLANES
        const studentPlans = this.mockDataService.getStudentPlans()
        // TODOS LOS PLANES ACTIVOS
        const activePlans = plans.filter(p => p.status === 'ACTIVE').length
        // TOTAL DE ESTUDIANTES
        const totalAssignments = studentPlans.length
        // TOTAL DE ESTUDIANTES CON PLANES ACTIVOS
        const activeAssignments = studentPlans.filter(
          sp => sp.status === StudentPlanStatus.ACTIVE
        ).length

        return {
          // CANTIDAD TOTAL DE PLANES
          totalPlans: plans.length,
          // CANTIDAD TOTAL DE PLANES ACTIVOS
          activePlans: activePlans,
          // CANTIDAD TOTAL DE ESTUDIANTES
          totalAssignments: totalAssignments,
          // CANTIDAD TOTAL DE ESTUDIANTES CON PLANES ACTIVOS
          activeAssignments: activeAssignments,
          // CANTIDAD DE RESERVAS HECHAS HOY
          estimatedRevenue: activeAssignments * 50000, // Cálculo simplificado
        }
      })
    )
  }
}
