import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay, map } from 'rxjs/operators'
import {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  StudentStatus,
  DetailedStudent,
  StudentPlan,
  StudentPlanStatus,
} from '../models'
import { MockDataService } from './mock-data.service'

/**
 * Servicio para la gestión de alumnos
 * Maneja CRUD de alumnos y operaciones relacionadas con planes
 */
@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Obtiene todos los alumnos con paginación y filtros
   * @param params Parámetros de paginación
   * @param filters Filtros de búsqueda
   */
  getStudents(
    params?: PaginationParams,
    filters?: any
  ): Observable<PaginatedResponse<DetailedStudent>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        let students = this.mockDataService.getStudents()
        const studentPlans = this.mockDataService.getStudentPlans()
        const plans = this.mockDataService.getPlans()

        // Crear lista de alumnos detallados con información de planes activos
        let detailedStudents: DetailedStudent[] = students.map(student => {
          const activePlan = studentPlans.find(
            sp => sp.studentId === student.id && sp.status === StudentPlanStatus.ACTIVE
          )

          return {
            ...student,
            activePlan: activePlan || undefined,
          }
        })

        // Aplicar filtros si existen
        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            detailedStudents = detailedStudents.filter(
              student =>
                student.firstName.toLowerCase().includes(searchTerm) ||
                student.lastName.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm)
            )
          }

          if (filters.planId) {
            detailedStudents = detailedStudents.filter(
              student => student.activePlan?.planId === filters.planId
            )
          }

          if (filters.status) {
            detailedStudents = detailedStudents.filter(student => student.status === filters.status)
          }
        }

        // Aplicar paginación si se proporcionan parámetros
        const page = params?.page || 1
        const limit = params?.limit || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        const paginatedStudents = detailedStudents.slice(startIndex, endIndex)

        return {
          data: paginatedStudents,
          total: detailedStudents.length,
          page,
          limit,
          totalPages: Math.ceil(detailedStudents.length / limit),
        }
      })
    )
  }

  /**
   * Obtiene un alumno por su ID
   * @param id ID del alumno
   */
  getStudentById(id: string): Observable<DetailedStudent> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const student = this.mockDataService.getStudentById(id)
        if (!student) {
          throw new Error(`Alumno con ID ${id} no encontrado`)
        }

        const studentPlans = this.mockDataService.getStudentPlans()
        const activePlan = studentPlans.find(
          sp => sp.studentId === id && sp.status === StudentPlanStatus.ACTIVE
        )

        return {
          ...student,
          activePlan: activePlan || undefined,
        }
      })
    )
  }

  /**
   * Crea un nuevo alumno
   * @param studentData Datos del nuevo alumno
   */
  createStudent(studentData: CreateStudentDto): Observable<ApiResponse<Student>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Validar que el email sea único
        const students = this.mockDataService.getStudents()
        const existsEmail = students.some(
          s => s.email.toLowerCase() === studentData.email.toLowerCase()
        )

        if (existsEmail) {
          throw new Error('Ya existe un alumno con este email')
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(studentData.email)) {
          throw new Error('El formato del email no es válido')
        }

        // Validar que la fecha de nacimiento sea válida
        const today = new Date()
        if (studentData.birthDate >= today) {
          throw new Error('La fecha de nacimiento debe ser anterior a hoy')
        }

        // Crear el alumno
        const newStudent = this.mockDataService.addStudent({
          ...studentData,
          status: StudentStatus.ACTIVE,
        })

        return {
          success: true,
          data: newStudent,
          message: 'Alumno creado exitosamente',
        }
      })
    )
  }

  /**
   * Actualiza un alumno existente
   * @param updateData Datos de actualización del alumno
   */
  updateStudent(updateData: UpdateStudentDto): Observable<ApiResponse<Student>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const existingStudent = this.mockDataService.getStudentById(updateData.id)
        if (!existingStudent) {
          throw new Error('Alumno no encontrado')
        }

        // Validar email único si se está cambiando
        if (updateData.email && updateData.email !== existingStudent.email) {
          const students = this.mockDataService.getStudents()
          const existsEmail = students.some(
            s => s.id !== updateData.id && s.email.toLowerCase() === updateData.email!.toLowerCase()
          )

          if (existsEmail) {
            throw new Error('Ya existe un alumno con este email')
          }

          // Validar formato de email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(updateData.email)) {
            throw new Error('El formato del email no es válido')
          }
        }

        // Validar fecha de nacimiento si se está cambiando
        if (updateData.birthDate) {
          const today = new Date()
          if (updateData.birthDate >= today) {
            throw new Error('La fecha de nacimiento debe ser anterior a hoy')
          }
        }

        // Actualizar el alumno
        const updatedStudent = this.mockDataService.updateStudent(updateData.id, updateData)
        if (!updatedStudent) {
          throw new Error('Error al actualizar el alumno')
        }

        return {
          success: true,
          data: updatedStudent,
          message: 'Alumno actualizado exitosamente',
        }
      })
    )
  }

  /**
   * Alterna el estado de un alumno (activo/inactivo)
   * @param id ID del alumno
   * @param newStatus Nuevo estado del alumno
   */
  toggleStudentStatus(id: string, newStatus: StudentStatus): Observable<ApiResponse<Student>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const student = this.mockDataService.getStudentById(id)
        if (!student) {
          throw new Error('Alumno no encontrado')
        }

        // Si se está desactivando, verificar si tiene planes activos
        if (newStatus === StudentStatus.INACTIVE) {
          const studentPlans = this.mockDataService.getStudentPlans()
          const hasActivePlan = studentPlans.some(
            sp => sp.studentId === id && sp.status === StudentPlanStatus.ACTIVE
          )

          if (hasActivePlan) {
            throw new Error(
              'No se puede desactivar un alumno con planes activos. Primero cancele su plan.'
            )
          }
        }

        const updatedStudent = this.mockDataService.updateStudent(id, { status: newStatus })
        if (!updatedStudent) {
          throw new Error('Error al actualizar el estado del alumno')
        }

        const action = newStatus === StudentStatus.ACTIVE ? 'activado' : 'desactivado'
        return {
          success: true,
          data: updatedStudent,
          message: `Alumno ${action} exitosamente`,
        }
      })
    )
  }

  /**
   * Elimina un alumno
   * @param id ID del alumno a eliminar
   */
  deleteStudent(id: string): Observable<ApiResponse<void>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        // Verificar que no tenga planes activos
        const studentPlans = this.mockDataService.getStudentPlans()
        const hasActivePlan = studentPlans.some(
          sp => sp.studentId === id && sp.status === StudentPlanStatus.ACTIVE
        )

        if (hasActivePlan) {
          throw new Error('No se puede eliminar un alumno con planes activos')
        }

        const deleted = this.mockDataService.deleteStudent(id)

        if (!deleted) {
          throw new Error('No se pudo eliminar el alumno')
        }

        return {
          success: true,
          message: 'Alumno eliminado exitosamente',
        }
      })
    )
  }

  /**
   * Obtiene estadísticas de alumnos
   */
  getStudentsStatistics(): Observable<any> {
    return of(null).pipe(
      delay(600),
      map(() => {
        const students = this.mockDataService.getStudents()
        const studentPlans = this.mockDataService.getStudentPlans()

        const activeStudents = students.filter(s => s.status === StudentStatus.ACTIVE).length
        const inactiveStudents = students.filter(s => s.status === StudentStatus.INACTIVE).length
        const studentsWithActivePlans = studentPlans.filter(
          sp => sp.status === StudentPlanStatus.ACTIVE
        ).length
        const studentsWithoutPlans = activeStudents - studentsWithActivePlans

        return {
          totalStudents: students.length,
          activeStudents,
          inactiveStudents,
          studentsWithActivePlans,
          studentsWithoutPlans,
        }
      })
    )
  }

  /**
   * Obtiene la lista de planes únicos que tienen alumnos inscritos
   */
  getPlansWithStudents(): Observable<any[]> {
    return of(null).pipe(
      delay(400),
      map(() => {
        const studentPlans = this.mockDataService.getStudentPlans()
        const plans = this.mockDataService.getPlans()

        const planIds = [...new Set(studentPlans.map(sp => sp.planId))]

        return planIds.map(planId => {
          const plan = plans.find(p => p.id === planId)
          const studentsCount = studentPlans.filter(sp => sp.planId === planId).length

          return {
            id: planId,
            name: plan?.name || 'Plan no encontrado',
            studentsCount,
          }
        })
      })
    )
  }

  /**
   * Activa un plan para un alumno
   * @param activateData Datos para activar el plan
   */
  activateStudentPlan(activateData: any): Observable<ApiResponse<StudentPlan>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Aquí iría la lógica para activar el plan
        // Por ahora simularemos una respuesta exitosa
        return {
          success: true,
          message: 'Plan activado exitosamente',
        }
      })
    )
  }

  /**
   * Congela un plan de alumno
   * @param freezeData Datos para congelar el plan
   */
  freezeStudentPlan(freezeData: any): Observable<ApiResponse<StudentPlan>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Aquí iría la lógica para congelar el plan
        // Por ahora simularemos una respuesta exitosa
        return {
          success: true,
          message: 'Plan congelado exitosamente',
        }
      })
    )
  }

  /**
   * Anula un plan de alumno
   * @param cancelData Datos para anular el plan
   */
  cancelStudentPlan(cancelData: any): Observable<ApiResponse<void>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Aquí iría la lógica para anular el plan
        // Por ahora simularemos una respuesta exitosa
        return {
          success: true,
          message: 'Plan anulado exitosamente',
        }
      })
    )
  }
}
