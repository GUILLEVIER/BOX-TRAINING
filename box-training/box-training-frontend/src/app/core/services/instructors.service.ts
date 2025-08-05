import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay, map } from 'rxjs/operators'
import {
  Instructor,
  CreateInstructorDto,
  UpdateInstructorDto,
  InstructorState,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '../models'
import { MockDataService } from './mock-data.service'

/**
 * Servicio para la gestión de instructores
 * Maneja CRUD de instructores y operaciones relacionadas
 */
@Injectable({
  providedIn: 'root',
})
export class InstructorsService {
  constructor(private mockDataService: MockDataService) {}

  /**
   * Obtiene todos los instructores con paginación y filtros
   * @param params Parámetros de paginación
   * @param filters Filtros de búsqueda
   */
  getInstructors(
    params?: PaginationParams,
    filters?: any
  ): Observable<PaginatedResponse<Instructor>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        let instructors = this.mockDataService.getInstructors()

        // Aplicar filtros si existen
        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            instructors = instructors.filter(
              instructor =>
                instructor.name.toLowerCase().includes(searchTerm) ||
                instructor.lastName.toLowerCase().includes(searchTerm) ||
                instructor.email.toLowerCase().includes(searchTerm) ||
                instructor.specialties.some(specialty =>
                  specialty.toLowerCase().includes(searchTerm)
                )
            )
          }

          if (filters.status) {
            instructors = instructors.filter(instructor => instructor.status === filters.status)
          }
        }

        // Aplicar paginación si se proporcionan parámetros
        const page = params?.page || 1
        const limit = params?.limit || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        const paginatedInstructors = instructors.slice(startIndex, endIndex)

        return {
          data: paginatedInstructors,
          total: instructors.length,
          page,
          limit,
          totalPages: Math.ceil(instructors.length / limit),
        }
      })
    )
  }

  /**
   * Obtiene un instructor por su ID
   * @param id ID del instructor
   */
  getInstructorById(id: string): Observable<Instructor> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const instructor = this.mockDataService.getInstructorById(id)
        if (!instructor) {
          throw new Error(`Instructor con ID ${id} no encontrado`)
        }
        return instructor
      })
    )
  }

  /**
   * Crea un nuevo instructor
   * @param instructorData Datos del nuevo instructor
   */
  createInstructor(instructorData: CreateInstructorDto): Observable<ApiResponse<Instructor>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Validar que el email sea único
        const instructors = this.mockDataService.getInstructors()
        const existsEmail = instructors.some(
          i => i.email.toLowerCase() === instructorData.email.toLowerCase()
        )

        if (existsEmail) {
          throw new Error('Ya existe un instructor con este email')
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(instructorData.email)) {
          throw new Error('El formato del email no es válido')
        }

        // Validar que tenga al menos una especialidad
        if (!instructorData.specialties || instructorData.specialties.length === 0) {
          throw new Error('El instructor debe tener al menos una especialidad')
        }

        // Crear el instructor
        const newInstructor = this.mockDataService.addInstructor({
          ...instructorData,
          status: InstructorState.ACTIVE,
        })

        return {
          success: true,
          data: newInstructor,
          message: 'Instructor creado exitosamente',
        }
      })
    )
  }

  /**
   * Actualiza un instructor existente
   * @param updateData Datos de actualización del instructor
   */
  updateInstructor(updateData: UpdateInstructorDto): Observable<ApiResponse<Instructor>> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const existingInstructor = this.mockDataService.getInstructorById(updateData.id)
        if (!existingInstructor) {
          throw new Error('Instructor no encontrado')
        }

        // Validar email único si se está cambiando
        if (updateData.email && updateData.email !== existingInstructor.email) {
          const instructors = this.mockDataService.getInstructors()
          const existsEmail = instructors.some(
            i => i.id !== updateData.id && i.email.toLowerCase() === updateData.email!.toLowerCase()
          )

          if (existsEmail) {
            throw new Error('Ya existe un instructor con este email')
          }

          // Validar formato de email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(updateData.email)) {
            throw new Error('El formato del email no es válido')
          }
        }

        // Validar especialidades si se están cambiando
        if (updateData.specialties && updateData.specialties.length === 0) {
          throw new Error('El instructor debe tener al menos una especialidad')
        }

        // Actualizar el instructor
        const updatedInstructor = this.mockDataService.updateInstructor(updateData.id, updateData)
        if (!updatedInstructor) {
          throw new Error('Error al actualizar el instructor')
        }

        return {
          success: true,
          data: updatedInstructor,
          message: 'Instructor actualizado exitosamente',
        }
      })
    )
  }

  /**
   * Alterna el estado de un instructor (activo/inactivo)
   * @param id ID del instructor
   * @param newStatus Nuevo estado del instructor
   */
  toggleInstructorStatus(
    id: string,
    newStatus: InstructorState
  ): Observable<ApiResponse<Instructor>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        const instructor = this.mockDataService.getInstructorById(id)
        if (!instructor) {
          throw new Error('Instructor no encontrado')
        }

        // Si se está desactivando, verificar si tiene clases programadas
        if (newStatus === InstructorState.INACTIVE) {
          // Aquí se podría verificar si tiene clases programadas
          // Por ahora permitimos la desactivación
        }

        const updatedInstructor = this.mockDataService.updateInstructor(id, { status: newStatus })
        if (!updatedInstructor) {
          throw new Error('Error al actualizar el estado del instructor')
        }

        const action = newStatus === InstructorState.ACTIVE ? 'activado' : 'desactivado'
        return {
          success: true,
          data: updatedInstructor,
          message: `Instructor ${action} exitosamente`,
        }
      })
    )
  }

  /**
   * Elimina un instructor
   * @param id ID del instructor a eliminar
   */
  deleteInstructor(id: string): Observable<ApiResponse<void>> {
    return of(null).pipe(
      delay(800),
      map(() => {
        // Verificar que no tenga clases programadas
        // Por ahora permitimos la eliminación

        const deleted = this.mockDataService.deleteInstructor(id)

        if (!deleted) {
          throw new Error('No se pudo eliminar el instructor')
        }

        return {
          success: true,
          message: 'Instructor eliminado exitosamente',
        }
      })
    )
  }

  /**
   * Obtiene estadísticas de instructores
   */
  getInstructorsStatistics(): Observable<any> {
    return of(null).pipe(
      delay(600),
      map(() => {
        const instructors = this.mockDataService.getInstructors()

        const activeInstructors = instructors.filter(
          i => i.status === InstructorState.ACTIVE
        ).length
        const inactiveInstructors = instructors.filter(
          i => i.status === InstructorState.INACTIVE
        ).length

        // Obtener especialidades más comunes
        const specialtyCount: { [key: string]: number } = {}
        instructors.forEach(instructor => {
          instructor.specialties.forEach(specialty => {
            specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1
          })
        })

        const topSpecialties = Object.entries(specialtyCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([specialty, count]) => ({ specialty, count }))

        return {
          totalInstructors: instructors.length,
          activeInstructors,
          inactiveInstructors,
          topSpecialties,
        }
      })
    )
  }

  /**
   * Obtiene la lista de especialidades disponibles
   */
  getAvailableSpecialties(): Observable<string[]> {
    return of(null).pipe(
      delay(300),
      map(() => {
        // Lista de especialidades predefinidas
        return [
          'CrossFit',
          'Boxeo',
          'Muay Thai',
          'BJJ',
          'Kickboxing',
          'Entrenamiento Funcional',
          'Yoga',
          'Pilates',
          'Calistenia',
          'Halterofilia',
          'Cardio',
          'Nutrición Deportiva',
        ]
      })
    )
  }
}
