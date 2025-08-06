import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { v4 as uuidv4 } from 'uuid'
import {
  Instructor,
  InstructorState,
  NotificationType,
  Notification,
  Plan,
  PlanStatus,
  Reservation,
  ReservationStatus,
  Schedule,
  Student,
  StudentPlan,
  StudentPlanStatus,
  StudentStatus,
  User,
  UserRole,
  PlanFormat,
  PlanType,
} from '../models'

/**
 * Servicio que simula una base de datos en memoria
 * Proporciona datos mock para toda la aplicación
 * Compatible con SSR (Server-Side Rendering)
 */
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  // Flag para verificar si estamos en el navegador
  private isBrowser: boolean

  // Datos mock para instructores
  private instructors: Instructor[] = [
    {
      id: '1',
      name: 'Carlos',
      lastName: 'Rodriguez',
      email: 'carlos@boxtraining.com',
      phone: '+56912345678',
      specialties: ['CrossFit', 'Entrenamiento Funcional'],
      biography: 'Instructor certificado con 5 años de experiencia en CrossFit',
      photo: 'assets/images/instructors/carlos.jpg',
      status: InstructorState.ACTIVE,
    },
    {
      id: '2',
      name: 'Maria',
      lastName: 'Gonzalez',
      email: 'maria@boxtraining.com',
      phone: '+56912345679',
      specialties: ['Zumba', 'Baile', 'Cardio'],
      biography: 'Instructora de Zumba con certificación internacional',
      photo: 'assets/images/instructors/maria.jpg',
      status: InstructorState.ACTIVE,
    },
    {
      id: '3',
      name: 'Juan',
      lastName: 'Perez',
      email: 'juan@boxtraining.com',
      phone: '+56912345680',
      specialties: ['Entrenamiento Personalizado', 'Fuerza'],
      biography: 'Personal trainer especializado en entrenamiento de fuerza',
      photo: 'assets/images/instructors/juan.jpg',
      status: InstructorState.ACTIVE,
    },
  ]

  // Datos mock para horarios
  private schedules: Schedule[] = [
    // Horarios de CrossFit
    {
      id: '1',
      dayOfWeek: 1, // Lunes
      startTime: '07:00',
      endTime: '08:00',
      maxCapacity: 15,
      instructorId: '1',
      classType: {
        id: '1',
        name: 'CROSSFIT',
        format: PlanFormat.IN_PERSON,
      },
      room: 'Sala Principal',
      description: 'CrossFit matutino - Nivel intermedio',
    },
    {
      id: '2',
      dayOfWeek: 1, // Lunes
      startTime: '18:00',
      endTime: '19:00',
      maxCapacity: 20,
      instructorId: '1',
      classType: {
        id: '1',
        name: 'CROSSFIT',
        format: PlanFormat.IN_PERSON,
      },
      room: 'Sala Principal',
      description: 'CrossFit vespertino - Todos los niveles',
    },
    // Horarios de Zumba
    {
      id: '3',
      dayOfWeek: 2, // Martes
      startTime: '19:00',
      endTime: '20:00',
      maxCapacity: 25,
      instructorId: '2',
      classType: {
        id: '2',
        name: 'ZUMBA',
        format: PlanFormat.IN_PERSON,
      },
      room: 'Sala de Baile',
      description: 'Zumba fitness - Todos los niveles',
    },
    {
      id: '4',
      dayOfWeek: 4, // Jueves
      startTime: '19:00',
      endTime: '20:00',
      maxCapacity: 25,
      instructorId: '2',
      classType: {
        id: '2',
        name: 'ZUMBA',
        format: PlanFormat.IN_PERSON,
      },
      room: 'Sala de Baile',
      description: 'Zumba fitness - Todos los niveles',
    },
    // Horarios Personalizados
    {
      id: '5',
      dayOfWeek: 3, // Miércoles
      startTime: '09:00',
      endTime: '10:00',
      maxCapacity: 1,
      instructorId: '3',
      classType: {
        id: '3',
        name: 'PERSONALIZADO',
        format: PlanFormat.IN_PERSON,
      },
      room: 'Sala Privada',
      description: 'Entrenamiento personalizado',
    },
    {
      id: '6',
      dayOfWeek: 5, // Viernes
      startTime: '16:00',
      endTime: '17:00',
      maxCapacity: 1,
      instructorId: '3',
      classType: {
        id: '3',
        name: 'PERSONALIZADO',
        format: PlanFormat.IN_PERSON,
      },
      room: 'Sala Privada',
      description: 'Entrenamiento personalizado',
    },
  ]

  // Datos mock para tipos de plan
  private planTypes: PlanType[] = [
    { id: '1', format: PlanFormat.IN_PERSON, name: 'CROSSFIT' },
    { id: '2', format: PlanFormat.IN_PERSON, name: 'ZUMBA' },
    { id: '3', format: PlanFormat.IN_PERSON, name: 'PERSONALIZADO' },
    { id: '4', format: PlanFormat.ONLINE, name: 'YOGA_ONLINE' },
  ]

  // Datos mock para planes
  private plans: Plan[] = [
    {
      id: '1',
      name: 'Plan CrossFit Básico',
      type: [
        {
          id: '1',
          name: 'CROSSFIT',
          format: PlanFormat.IN_PERSON,
        },
      ],
      description: 'Plan para principiantes en CrossFit con 8 clases mensuales',
      durationDays: 30,
      includedClasses: 8,
      price: 45000,
      status: PlanStatus.ACTIVE,
      creationDate: new Date('2024-01-01'),
      lastModifiedDate: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Plan CrossFit Ilimitado',
      type: [
        {
          id: '1',
          name: 'CROSSFIT',
          format: PlanFormat.IN_PERSON,
        },
      ],
      description: 'Plan ilimitado de CrossFit para usuarios avanzados',
      durationDays: 30,
      includedClasses: 999,
      price: 75000,
      status: PlanStatus.ACTIVE,
      creationDate: new Date('2024-01-01'),
      lastModifiedDate: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Plan Zumba Mensual',
      type: [
        {
          id: '2',
          name: 'ZUMBA',
          format: PlanFormat.IN_PERSON,
        },
      ],
      description: 'Plan mensual de Zumba con clases ilimitadas',
      durationDays: 30,
      includedClasses: 999,
      price: 35000,
      status: PlanStatus.ACTIVE,
      creationDate: new Date('2024-01-01'),
      lastModifiedDate: new Date('2024-01-01'),
    },
    {
      id: '4',
      name: 'Entrenamiento Personal',
      type: [
        {
          id: '3',
          name: 'PERSONALIZADO',
          format: PlanFormat.IN_PERSON,
        },
      ],
      description: 'Sesiones de entrenamiento personalizado 1 a 1',
      durationDays: 30,
      includedClasses: 4,
      price: 120000,
      status: PlanStatus.ACTIVE,
      creationDate: new Date('2024-01-01'),
      lastModifiedDate: new Date('2024-01-01'),
    },
  ]

  // Datos mock para alumnos
  private students: Student[] = [
    {
      id: '1',
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana.silva@email.com',
      phone: '+56987654321',
      birthDate: new Date('1990-05-15'),
      registrationDate: new Date('2024-01-15'),
      status: StudentStatus.ACTIVE,
    },
    {
      id: '2',
      firstName: 'Luis',
      lastName: 'Martinez',
      email: 'luis.martinez@email.com',
      phone: '+56987654322',
      birthDate: new Date('1985-08-22'),
      registrationDate: new Date('2024-02-01'),
      status: StudentStatus.ACTIVE,
    },
    {
      id: '3',
      firstName: 'Carmen',
      lastName: 'Lopez',
      email: 'carmen.lopez@email.com',
      phone: '+56987654323',
      birthDate: new Date('1992-12-10'),
      registrationDate: new Date('2024-01-20'),
      status: StudentStatus.ACTIVE,
    },
  ]

  // Datos mock para planes de estudiantes
  private studentPlans: StudentPlan[] = [
    {
      id: '1',
      studentId: '1',
      planId: '1', // CrossFit Básico
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
      remainingClasses: 5,
      status: StudentPlanStatus.ACTIVE,
    },
    {
      id: '2',
      studentId: '2',
      planId: '3', // Zumba
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
      remainingClasses: 999,
      status: StudentPlanStatus.ACTIVE,
    },
    {
      id: '3',
      studentId: '3',
      planId: '4', // Personal
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
      remainingClasses: 2,
      status: StudentPlanStatus.ACTIVE,
    },
  ]

  // Datos mock para reservas
  private reservations: Reservation[] = [
    {
      id: '1',
      studentId: '1',
      scheduleId: '1',
      date: new Date('2024-07-29'), // próximo lunes
      status: ReservationStatus.SCHEDULED,
      reservationDate: new Date('2024-07-27'),
    },
    {
      id: '2',
      studentId: '2',
      scheduleId: '3',
      date: new Date('2024-07-30'), // próximo martes
      status: ReservationStatus.SCHEDULED,
      reservationDate: new Date('2024-07-27'),
    },
  ]

  // Datos mock para notificaciones
  private notifications: Notification[] = [
    {
      id: '1',
      studentId: '1',
      type: NotificationType.REMINDER,
      title: 'Clase mañana',
      message: 'Tienes una clase de CrossFit programada para mañana a las 07:00',
      creationDate: new Date(),
      read: false,
      actionRequired: false,
    },
    {
      id: '2',
      studentId: '3',
      type: NotificationType.PLAN_EXPIRATION,
      title: 'Plan próximo a vencer',
      message: 'Tu plan de entrenamiento personal vence en 4 días',
      creationDate: new Date(),
      read: false,
      actionRequired: true,
    },
  ]

  // Usuarios mock para autenticación
  private users: User[] = [
    {
      id: 'admin-1',
      email: 'admin@boxtraining.com',
      name: 'Administrador',
      lastName: 'Sistema',
      role: UserRole.ADMINISTRATOR,
    },
    {
      id: '1', // Coincide con alumno id
      email: 'ana.silva@email.com',
      name: 'Ana',
      lastName: 'Silva',
      role: UserRole.STUDENT,
    },
    {
      id: '2', // Coincide con alumno id
      email: 'luis.martinez@email.com',
      name: 'Luis',
      lastName: 'Martinez',
      role: UserRole.STUDENT,
    },
    {
      id: 'instructor-1',
      email: 'guillermo.morales@gmail.com',
      name: 'Guillermo',
      lastName: 'Morales',
      role: UserRole.INSTRUCTOR,
    },
  ]

  // Contraseñas mock para autenticación
  private mockPasswords = {
    [UserRole.ADMINISTRATOR]: 'admin123',
    [UserRole.STUDENT]: 'student123',
    [UserRole.INSTRUCTOR]: 'instructor123',
  }

  // Credenciales mock para demo en UI
  private mockCredentials = [
    {
      email: 'admin@boxtraining.com',
      password: 'admin123',
      role: 'Administrador',
    },
    {
      email: 'ana.silva@email.com',
      password: 'student123',
      role: 'Alumno',
    },
    {
      email: 'luis.martinez@email.com',
      password: 'student123',
      role: 'Alumno',
    },
    {
      email: 'guillermo.morales@gmail.com',
      password: 'instructor123',
      role: 'Instructor',
    },
  ]

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    // Verificamos si estamos en el navegador
    this.isBrowser = isPlatformBrowser(platformId)

    // Solo cargamos datos desde localStorage si estamos en el navegador
    if (this.isBrowser) {
      this.loadDataFromStorage()
    }
  }

  /**
   * Carga los datos desde localStorage si existen y estamos en el navegador
   */
  private loadDataFromStorage(): void {
    if (!this.isBrowser) {
      return // No hacer nada en el servidor
    }

    try {
      const savedData = localStorage.getItem('boxTrainingData')
      if (savedData) {
        const data = JSON.parse(savedData)
        this.plans = data.plans || this.plans
        this.schedules = data.schedules || this.schedules
        this.students = data.students || this.students
        this.instructors = data.instructors || this.instructors
        this.studentPlans = data.studentPlans || this.studentPlans
        this.reservations = data.reservations || this.reservations
        this.notifications = data.notifications || this.notifications
        this.users = data.users || this.users
      }
    } catch (error) {
      console.warn('Error al cargar datos desde localStorage:', error)
    }
  }

  /**
   * Guarda los datos en localStorage (solo en el navegador)
   */
  private saveDataToStorage(): void {
    if (!this.isBrowser) {
      return // No hacer nada en el servidor
    }

    try {
      const data = {
        plans: this.plans,
        schedules: this.schedules,
        students: this.students,
        instructors: this.instructors,
        studentPlans: this.studentPlans,
        reservations: this.reservations,
        notifications: this.notifications,
        users: this.users,
      }
      localStorage.setItem('boxTrainingData', JSON.stringify(data))
    } catch (error) {
      console.warn('Error al guardar datos en localStorage:', error)
    }
  }

  // Métodos para obtener datos

  getPlanTypes(): PlanType[] {
    return [...this.planTypes]
  }

  getPlans(): Plan[] {
    return [...this.plans]
  }

  getSchedules(): Schedule[] {
    return [...this.schedules]
  }

  getStudents(): Student[] {
    return [...this.students]
  }

  getInstructors(): Instructor[] {
    return [...this.instructors]
  }

  getStudentPlans(): StudentPlan[] {
    return [...this.studentPlans]
  }

  getReservations(): Reservation[] {
    return [...this.reservations]
  }

  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  getUsers(): User[] {
    return [...this.users]
  }

  /**
   * Obtiene las contraseñas mock para autenticación
   */
  getMockPasswords(): { [key: string]: string } {
    return { ...this.mockPasswords }
  }

  /**
   * Obtiene las credenciales mock para mostrar en UI
   */
  getMockCredentials(): { email: string; password: string; role: string }[] {
    return [...this.mockCredentials]
  }

  // Métodos para encontrar por ID

  getPlanById(id: string): Plan | undefined {
    return this.plans.find(plan => plan.id === id)
  }

  getScheduleById(id: string): Schedule | undefined {
    return this.schedules.find(schedule => schedule.id === id)
  }

  getStudentById(id: string): Student | undefined {
    return this.students.find(student => student.id === id)
  }

  getInstructorById(id: string): Instructor | undefined {
    return this.instructors.find(instructor => instructor.id === id)
  }

  getStudentPlanById(id: string): StudentPlan | undefined {
    return this.studentPlans.find(sp => sp.id === id)
  }

  getReservationById(id: string): Reservation | undefined {
    return this.reservations.find(reservation => reservation.id === id)
  }

  // Métodos para agregar datos

  addPlanType(planType: Omit<PlanType, 'id'>): PlanType {
    const newPlanType: PlanType = {
      id: uuidv4(),
      ...planType,
    }
    this.planTypes.push(newPlanType)
    this.saveDataToStorage()
    return newPlanType
  }

  addPlan(plan: Omit<Plan, 'id' | 'creationDate' | 'lastModifiedDate'>): Plan {
    const newPlan: Plan = {
      ...plan,
      id: uuidv4(),
      status: plan.status || PlanStatus.ACTIVE, // Respetar el estado pasado o usar ACTIVE por defecto
      creationDate: new Date(),
      lastModifiedDate: new Date(),
    }
    this.plans.push(newPlan)
    this.saveDataToStorage()
    return newPlan
  }

  addStudent(student: Omit<Student, 'id' | 'registrationDate'>): Student {
    const newStudent: Student = {
      ...student,
      id: uuidv4(),
      registrationDate: new Date(),
    }
    this.students.push(newStudent)
    this.saveDataToStorage()
    return newStudent
  }

  addStudentPlan(planStudent: Omit<StudentPlan, 'id'>): StudentPlan {
    const newPlanStudent: StudentPlan = {
      ...planStudent,
      id: uuidv4(),
    }
    this.studentPlans.push(newPlanStudent)
    this.saveDataToStorage()
    return newPlanStudent
  }

  addReservation(reservation: Omit<Reservation, 'id' | 'reservationDate' | 'status'>): Reservation {
    const newReservation: Reservation = {
      ...reservation,
      id: uuidv4(),
      reservationDate: new Date(),
      status: ReservationStatus.SCHEDULED,
    }
    this.reservations.push(newReservation)
    this.saveDataToStorage()
    return newReservation
  }

  // Métodos para actualizar datos
  updatePlan(id: string, updates: Partial<Plan>): Plan | null {
    const index = this.plans.findIndex(plan => plan.id === id)
    if (index === -1) return null

    this.plans[index] = {
      ...this.plans[index],
      ...updates,
      lastModifiedDate: new Date(),
    }
    this.saveDataToStorage()
    return this.plans[index]
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.students.findIndex(student => student.id === id)
    if (index === -1) return null

    this.students[index] = { ...this.students[index], ...updates }
    this.saveDataToStorage()
    return this.students[index]
  }

  updateStudentPlan(id: string, updates: Partial<StudentPlan>): StudentPlan | null {
    const index = this.studentPlans.findIndex(ps => ps.id === id)
    if (index === -1) return null

    this.studentPlans[index] = { ...this.studentPlans[index], ...updates }
    this.saveDataToStorage()
    return this.studentPlans[index]
  }

  updateReservation(id: string, updates: Partial<Reservation>): Reservation | null {
    const index = this.reservations.findIndex(reservation => reservation.id === id)
    if (index === -1) return null

    this.reservations[index] = { ...this.reservations[index], ...updates }
    this.saveDataToStorage()
    return this.reservations[index]
  }

  // Métodos para eliminar datos
  deletePlan(id: string): boolean {
    const index = this.plans.findIndex(plan => plan.id === id)
    if (index === -1) return false

    // Verificar que no haya alumnos con este plan activo
    const hasActiveStudents = this.studentPlans.some(
      sp => sp.planId === id && sp.status === StudentPlanStatus.ACTIVE
    )

    if (hasActiveStudents) {
      return false // No se puede eliminar
    }

    this.plans.splice(index, 1)
    this.saveDataToStorage()
    return true
  }

  deleteStudent(id: string): boolean {
    const index = this.students.findIndex(student => student.id === id)
    if (index === -1) return false

    // Verificar que no tenga planes activos
    const hasActivePlan = this.studentPlans.some(
      sp => sp.studentId === id && sp.status === StudentPlanStatus.ACTIVE
    )

    if (hasActivePlan) {
      return false // No se puede eliminar
    }

    this.students.splice(index, 1)
    this.saveDataToStorage()
    return true
  }

  deleteReservation(id: string): boolean {
    const index = this.reservations.findIndex(reservation => reservation.id === id)
    if (index === -1) return false

    this.reservations.splice(index, 1)
    this.saveDataToStorage()
    return true
  }

  // Métodos para instructores
  addInstructor(instructor: Omit<Instructor, 'id'>): Instructor {
    const newInstructor: Instructor = {
      ...instructor,
      id: uuidv4(),
    }
    this.instructors.push(newInstructor)
    this.saveDataToStorage()
    return newInstructor
  }

  updateInstructor(id: string, updates: Partial<Instructor>): Instructor | null {
    const index = this.instructors.findIndex(instructor => instructor.id === id)
    if (index === -1) return null

    this.instructors[index] = { ...this.instructors[index], ...updates }
    this.saveDataToStorage()
    return this.instructors[index]
  }

  deleteInstructor(id: string): boolean {
    const index = this.instructors.findIndex(instructor => instructor.id === id)
    if (index === -1) return false

    // Verificar que no tenga clases programadas (por ahora permitimos eliminar)
    this.instructors.splice(index, 1)
    this.saveDataToStorage()
    return true
  }

  // Métodos de negocio específicos

  /**
   * Obtiene el plan activo de un alumno
   */
  getStudentActivePlan(studentId: string): StudentPlan | undefined {
    return this.studentPlans.find(
      sp => sp.studentId === studentId && sp.status === StudentPlanStatus.ACTIVE
    )
  }

  /**
   * Obtiene las reservas futuras de un alumno
   */
  getStudentFutureReservations(studentId: string): Reservation[] {
    const today = new Date()
    return this.reservations.filter(
      reservation =>
        reservation.studentId === studentId &&
        reservation.date > today &&
        reservation.status === ReservationStatus.SCHEDULED
    )
  }

  /**
   * Verifica disponibilidad de un horario en una fecha
   */
  checkAvailability(scheduleId: string, date: Date): boolean {
    const schedule = this.getScheduleById(scheduleId)
    if (!schedule) return false

    const reservationsInSchedule = this.reservations.filter(
      reservation =>
        reservation.scheduleId === scheduleId &&
        reservation.date.toDateString() === date.toDateString() &&
        reservation.status === ReservationStatus.SCHEDULED
    )

    return reservationsInSchedule.length < schedule.maxCapacity
  }

  /**
   * Genera un ID único
   */
  generateId(): string {
    return uuidv4()
  }
}
